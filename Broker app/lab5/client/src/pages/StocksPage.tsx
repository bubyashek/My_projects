import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchStocks, toggleStockActive } from "../store/slices/stocksSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Stock } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faTableList } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StocksPage() {
  const dispatch = useAppDispatch();
  const { stocks, loading } = useAppSelector((state) => state.stocks);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  const handleToggle = async (symbol: string) => {
    await dispatch(toggleStockActive(symbol));
  };

  const showChart = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const getChartData = (stock: Stock) => {
    return {
      labels: stock.historicalData.map((d) => d.date),
      datasets: [
        {
          label: `${stock.symbol} - ${stock.name}`,
          data: stock.historicalData.map((d) =>
            parseFloat(d.open.replace("$", ""))
          ),
          borderColor: "#5a67d8",
          backgroundColor: "rgba(90, 103, 216, 0.1)",
          tension: 0.3,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: "#5a67d8",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#5a67d8",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#2d3748",
          font: {
            size: 14,
            weight: "bold" as const,
            family: "'Inter', system-ui, sans-serif",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        text: selectedStock
          ? `${selectedStock.symbol} - Исторические Данные`
          : "График Акций",
        color: "#1a202c",
        font: {
          size: 20,
          weight: "bold" as const,
          family: "'Inter', system-ui, sans-serif",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#1a202c",
        bodyColor: "#4a5568",
        borderColor: "#5a67d8",
        borderWidth: 2,
        padding: 16,
        displayColors: true,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          size: 14,
          weight: "bold" as const,
          family: "'Inter', system-ui, sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', system-ui, sans-serif",
        },
        callbacks: {
          label: function (context: any) {
            return " $" + context.parsed.y.toFixed(2);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "#e2e8f0",
          drawBorder: false,
        },
        ticks: {
          color: "#4a5568",
          font: {
            size: 12,
            family: "'Inter', system-ui, sans-serif",
          },
          padding: 10,
          callback: function (value: any) {
            return "$" + value;
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          color: "#f7fafc",
          drawBorder: false,
        },
        ticks: {
          color: "#4a5568",
          font: {
            size: 11,
            family: "'Inter', system-ui, sans-serif",
          },
          maxRotation: 45,
          minRotation: 45,
          padding: 10,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  if (loading) {
    return <div className="loading">Загрузка акций...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: "16px", color: "#2d3748" }}>
          Управление Акциями
        </h1>
        <p style={{ color: "#4a5568", marginBottom: "24px", fontSize: "14px" }}>
          Выберите акции, которые будут участвовать в торгах. Нажмите на акцию,
          чтобы просмотреть её исторические данные.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Символ</th>
                <th>Название Компании</th>
                <th>Статус</th>
                <th>Данные</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td data-label="Символ">
                    <strong style={{ color: "#5a67d8", fontSize: "16px" }}>
                      {stock.symbol}
                    </strong>
                  </td>
                  <td data-label="Название Компании">{stock.name}</td>
                  <td data-label="Статус">
                    <span
                      className={`status-badge ${
                        stock.isActive ? "active" : "inactive"
                      }`}
                    >
                      {stock.isActive ? "Активна" : "Неактивна"}
                    </span>
                  </td>
                  <td data-label="Данные">
                    {stock.historicalData.length} дней
                  </td>
                  <td data-label="Действия">
                    <div className="table-actions">
                      <button
                        className="button button-primary"
                        onClick={() => showChart(stock)}
                        style={{ fontSize: "13px", padding: "8px 16px" }}
                      >
                        <FontAwesomeIcon
                          icon={faChartLine}
                          style={{ marginRight: "6px" }}
                        />
                        График
                      </button>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={stock.isActive}
                          onChange={() => handleToggle(stock.symbol)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">
                          {stock.isActive ? "Активна" : "Неактивна"}
                        </span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStock && (
        <div className="modal-overlay" onClick={() => setSelectedStock(null)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "1200px",
              width: "95%",
              background: "#ffffff",
              padding: "32px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div>
                <h2
                  style={{
                    color: "#1a202c",
                    marginBottom: "8px",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  {selectedStock.symbol} - {selectedStock.name}
                </h2>
                <p style={{ color: "#4a5568", fontSize: "14px" }}>
                  Исторические данные о ценах открытия (2024-2025)
                </p>
              </div>
              <button
                onClick={() => setSelectedStock(null)}
                style={{
                  background: "#e2e8f0",
                  border: "none",
                  borderRadius: "12px",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#4a5568",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#cbd5e0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#e2e8f0";
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <button
                className={`button ${
                  viewMode === "chart" ? "button-primary" : "button-secondary"
                }`}
                onClick={() => setViewMode("chart")}
                style={{ fontSize: "13px", padding: "10px 20px" }}
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  style={{ marginRight: "6px" }}
                />
                График
              </button>
              <button
                className={`button ${
                  viewMode === "table" ? "button-primary" : "button-secondary"
                }`}
                onClick={() => setViewMode("table")}
                style={{ fontSize: "13px", padding: "10px 20px" }}
              >
                 <FontAwesomeIcon
                  icon={faTableList}
                  style={{ marginRight: "6px" }}
                />
                Таблица
              </button>
            </div>

            {viewMode === "chart" && (
              <div
                style={{
                  height: "450px",
                  background: "#f7fafc",
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <Line
                  data={getChartData(selectedStock)}
                  options={chartOptions}
                />
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <div style={{ maxHeight: "500px", overflow: "auto" }}>
                <p
                  style={{
                    marginBottom: "16px",
                    color: "#4a5568",
                    fontSize: "14px",
                  }}
                >
                  Всего записей: {selectedStock.historicalData.length} торговых
                  дней
                </p>
                <table className="table" style={{ fontSize: "13px" }}>
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "#f7fafc",
                      zIndex: 1,
                    }}
                  >
                    <tr>
                      <th style={{ textAlign: "center" }}>№</th>
                      <th>Дата</th>
                      <th>Цена Открытия</th>
                      <th>Изменение</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStock.historicalData.map((dataPoint, index) => {
                      const currentPrice = parseFloat(
                        dataPoint.open.replace("$", "")
                      );
                      const prevPrice =
                        index > 0
                          ? parseFloat(
                              selectedStock.historicalData[
                                index - 1
                              ].open.replace("$", "")
                            )
                          : currentPrice;
                      const change = currentPrice - prevPrice;
                      const changePercent =
                        prevPrice !== 0 ? (change / prevPrice) * 100 : 0;

                      return (
                        <tr key={index}>
                          <td
                            data-label="№"
                            style={{ textAlign: "center", color: "#718096" }}
                          >
                            {index + 1}
                          </td>
                          <td data-label="Дата" style={{ fontWeight: "600" }}>
                            {dataPoint.date}
                          </td>
                          <td
                            data-label="Цена Открытия"
                            style={{ fontWeight: "700", color: "#5a67d8" }}
                          >
                            {dataPoint.open}
                          </td>
                          <td data-label="Изменение">
                            {index > 0 ? (
                              <span
                                style={{
                                  color: change >= 0 ? "#38a169" : "#e53e3e",
                                  fontWeight: "600",
                                }}
                              >
                                {change >= 0 ? "+" : ""}
                                {change.toFixed(2)}({change >= 0 ? "+" : ""}
                                {changePercent.toFixed(2)}%)
                              </span>
                            ) : (
                              <span style={{ color: "#a0aec0" }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
