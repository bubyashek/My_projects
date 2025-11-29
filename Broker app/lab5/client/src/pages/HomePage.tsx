export default function HomePage() {
  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '20px', color: '#2d3748' }}>Администрирование Фондовой Биржи</h1>
        <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.6', marginBottom: '20px' }}>
          Добро пожаловать в систему администрирования фондовой биржи. Эта система позволяет управлять брокерами, 
          настраивать параметры торговли акциями и симулировать торги в реальном времени.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '30px' }}>
          <div style={{ padding: '28px', background: 'rgba(90, 103, 216, 0.08)', borderRadius: '20px', border: '2px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#5a67d8', fontWeight: '700' }}>Брокеры</h2>
            <p style={{ color: '#4a5568', fontSize: '14px', lineHeight: '1.6' }}>
              Управляйте учетными записями брокеров, устанавливайте начальные средства и отслеживайте их портфели во время торгов.
            </p>
          </div>

          <div style={{ padding: '28px', background: 'rgba(56, 178, 172, 0.08)', borderRadius: '20px', border: '2px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#38b2ac', fontWeight: '700' }}>Акции</h2>
            <p style={{ color: '#4a5568', fontSize: '14px', lineHeight: '1.6' }}>
              Просматривайте исторические данные акций, выбирайте акции для торгов и анализируйте тренды цен на графиках.
            </p>
          </div>

          <div style={{ padding: '28px', background: 'rgba(229, 62, 62, 0.08)', borderRadius: '20px', border: '2px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#e53e3e', fontWeight: '700' }}>Торговля</h2>
            <p style={{ color: '#4a5568', fontSize: '14px', lineHeight: '1.6' }}>
              Настройте параметры симуляции торгов, запускайте/останавливайте торги и следите за ценами в режиме реального времени через WebSockets.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(90, 103, 216, 0.05)', borderRadius: '20px', border: '2px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#5a67d8', fontWeight: '700' }}>Доступные Акции</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
            <div style={{ fontSize: '14px', color: '#2d3748', padding: '12px', background: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#5a67d8' }}>AAPL</strong> - Apple, Inc.
            </div>
            <div style={{ fontSize: '14px', color: '#2d3748', padding: '12px', background: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#5a67d8' }}>SBUX</strong> - Starbucks, Inc.
            </div>
            <div style={{ fontSize: '14px', color: '#2d3748', padding: '12px', background: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#5a67d8' }}>MSFT</strong> - Microsoft, Inc.
            </div>
            <div style={{ fontSize: '14px', color: '#2d3748', padding: '12px', background: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#5a67d8' }}>CSCO</strong> - Cisco Systems, Inc.
            </div>
            <div style={{ fontSize: '14px', color: '#2d3748', padding: '12px', background: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#5a67d8' }}>QCOM</strong> - QUALCOMM Inc.
            </div>
            <div style={{ fontSize: '14px', color: '#2d3748', padding: '12px', background: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#5a67d8' }}>AMZN</strong> - Amazon.com, Inc.
            </div>
            <div style={{ fontSize: '14px', color: '#2d3748', padding: '12px', background: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#5a67d8' }}>TSLA</strong> - Tesla, Inc.
            </div>
            <div style={{ fontSize: '14px', color: '#2d3748', padding: '12px', background: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#5a67d8' }}>AMD</strong> - Advanced Micro Devices
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(90, 103, 216, 0.08)', borderRadius: '20px', border: '2px solid rgba(90, 103, 216, 0.2)' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#5a67d8', fontWeight: '700' }}>Начало Работы</h3>
          <ol style={{ color: '#4a5568', fontSize: '14px', lineHeight: '1.8', marginLeft: '20px' }}>
            <li>Перейдите на страницу <strong style={{ color: '#5a67d8' }}>Брокеры</strong> для добавления учетных записей брокеров</li>
            <li>Откройте страницу <strong style={{ color: '#38b2ac' }}>Акции</strong> для активации акций для торговли</li>
            <li>Посетите страницу <strong style={{ color: '#e53e3e' }}>Торговля</strong> для настройки и запуска симуляции</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
