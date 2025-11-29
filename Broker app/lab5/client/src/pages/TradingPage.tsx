import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchTradingSettings,
  updateTradingSettings,
  startTrading,
  stopTrading,
  resetTrading,
  updatePrices,
  setTradingState,
} from '../store/slices/tradingSlice';
import { fetchStocks } from '../store/slices/stocksSlice';
import socketService from '../services/socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faSync, faClock, faChartLine, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

// Функция для конвертации DD.MM.YYYY в формат ISO
const parseRuDate = (dateStr: string): string => {
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return '';
};

// Функция для форматирования Date в DD.MM.YYYY
const formatRuDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};

export default function TradingPage() {
  const dispatch = useAppDispatch();
  const trading = useAppSelector((state) => state.trading);
  const { stocks } = useAppSelector((state) => state.stocks);
  const [formData, setFormData] = useState({
    startDate: trading.startDate || '01.11.2024',
    speedInSeconds: trading.speedInSeconds || 1,
  });

  useEffect(() => {
    dispatch(fetchTradingSettings());
    dispatch(fetchStocks()); // Загружаем акции
  }, [dispatch]);

  // Sync formData with trading settings when they load
  useEffect(() => {
    if (trading.startDate) {
      setFormData({
        startDate: trading.startDate,
        speedInSeconds: trading.speedInSeconds,
      });
    }
  }, [trading.startDate, trading.speedInSeconds]);

  // Refresh stocks periodically to ensure we have the latest data
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchStocks());
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  // Connect to WebSocket
  useEffect(() => {
    const socket = socketService.connect();

    socket.on('priceUpdate', (data: { currentDate: string; currentPrices: { [key: string]: string } }) => {
      dispatch(updatePrices(data));
    });

    socket.on('tradingState', (state: any) => {
      dispatch(setTradingState(state));
    });

    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateTradingSettings(formData));
  };

  const handleStart = async () => {
    await dispatch(startTrading());
  };

  const handleStop = async () => {
    await dispatch(stopTrading());
  };

  const handleReset = async () => {
    await dispatch(resetTrading());
    // Wait for the reset to complete and fetch updated settings
    await dispatch(fetchTradingSettings());
  };

  const activeStocks = stocks.filter((s) => s.isActive);
  const hasActiveStocks = activeStocks.length > 0;

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '24px', color: '#2d3748' }}>Настройки Биржи и Торговля</h1>

        {!hasActiveStocks && (
          <div className="error" style={{ marginBottom: '24px' }}>
            <strong>⚠️ Внимание:</strong> В данный момент нет активных акций. Пожалуйста, активируйте хотя бы одну акцию на странице Акции.
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '20px', color: '#5a67d8' }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: '12px' }} />
            Настройки Торговли
          </h2>
          <form onSubmit={handleUpdateSettings}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label>Дата Начала</label>
                <input
                  className="input"
                  type="date"
                  value={parseRuDate(formData.startDate)}
                  onChange={(e) => {
                    setFormData({ ...formData, startDate: formatRuDate(e.target.value) });
                  }}
                  disabled={trading.isRunning}
                />
                {formData.startDate < '01.01.2024' && (
                  <div className="error" style={{ marginBottom: '24px' }}>
                    <strong>⚠️ Внимание:</strong> Выбранной даты в данных нет. Будет установлена ближайшая дата: 01.01.2024.
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Скорость (секунд на день)</label>
                <input
                  className="input"
                  type="number"
                  value={formData.speedInSeconds}
                  onChange={(e) => setFormData({ ...formData, speedInSeconds: Number(e.target.value) })}
                  min="0.1"
                  step="0.1"
                  disabled={trading.isRunning}
                />
              </div>
            </div>
            <button
              type="submit"
              className="button button-primary"
              disabled={trading.isRunning}
              style={{ opacity: trading.isRunning ? 0.5 : 1, marginTop: '8px' }}
            >
              Обновить Настройки
            </button>
          </form>
        </div>

        <div style={{ marginBottom: '32px', padding: '28px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '2px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '20px', color: '#2d3748' }}>
            <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '12px' }} />
            Управление Торговлей
          </h2>
          <div className="flex-wrap-mobile" style={{ marginBottom: '20px' }}>
            {!trading.isRunning ? (
              <button
                className="button button-success"
                onClick={handleStart}
                disabled={!hasActiveStocks}
                style={{ opacity: hasActiveStocks ? 1 : 0.5 }}
              >
                <FontAwesomeIcon icon={faPlay} style={{ marginRight: '8px' }} />
                Начать Торговлю
              </button>
            ) : (
              <button className="button button-danger" onClick={handleStop}>
                <FontAwesomeIcon icon={faStop} style={{ marginRight: '8px' }} />
                Остановить Торговлю
              </button>
            )}
            <button
              className="button button-secondary"
              onClick={handleReset}
              disabled={trading.isRunning}
              style={{ opacity: trading.isRunning ? 0.5 : 1 }}
            >
              <FontAwesomeIcon icon={faSync} style={{ marginRight: '8px' }} />
              Сбросить
            </button>
          </div>
          <div>
            <span className={`status-badge ${trading.isRunning ? 'running' : 'inactive'}`}>
              {trading.isRunning ? '● Торги Активны' : '○ Торги Остановлены'}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '20px', color: '#2d3748' }}>
            <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: '12px' }} />
            Текущий Статус Торговли
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="stat-card" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '2px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div className="stat-label" style={{ color: '#718096', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '6px' }} />
                Текущая Дата
              </div>
              <div className="stat-value" style={{ fontSize: '24px', fontWeight: '700', color: '#5a67d8' }}>
                {trading.currentDate || formData.startDate}
              </div>
            </div>
            <div className="stat-card" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '2px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div className="stat-label" style={{ color: '#718096', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '6px' }} />
                Активные Акции
              </div>
              <div className="stat-value" style={{ fontSize: '24px', fontWeight: '700', color: '#38b2ac' }}>
                {activeStocks.length}
              </div>
            </div>
            <div className="stat-card" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '2px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div className="stat-label" style={{ color: '#718096', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: '6px' }} />
                Скорость
              </div>
              <div className="stat-value" style={{ fontSize: '24px', fontWeight: '700', color: '#e53e3e' }}>
                {trading.speedInSeconds}с/день
              </div>
            </div>
          </div>
        </div>

        {!hasActiveStocks && (
          <div className="error">
            <strong>⚠️ Внимание:</strong> В данный момент нет активных акций. Пожалуйста, активируйте хотя бы одну акцию на странице Акции.
          </div>
        )}

        {hasActiveStocks && Object.keys(trading.currentPrices).length > 0 && (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '20px', color: '#2d3748' }}>Текущие Цены Акций</h2>
            <div className="price-display">
              {Object.entries(trading.currentPrices).map(([symbol, price]) => (
                <div key={symbol} className="price-card">
                  <h3>{symbol}</h3>
                  <div className="price">{price}</div>
                  <div style={{ color: '#718096', fontSize: '12px', marginTop: '8px' }}>
                    {stocks.find((s) => s.symbol === symbol)?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
