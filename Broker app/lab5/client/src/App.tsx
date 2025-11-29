import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import HomePage from './pages/HomePage';
import BrokersPage from './pages/BrokersPage';
import StocksPage from './pages/StocksPage';
import TradingPage from './pages/TradingPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserTie, faChartLine, faChartBar } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <FontAwesomeIcon icon={faHome} style={{ marginRight: '8px' }} />
            Главная
          </Link>
        </li>
        <li>
          <Link to="/brokers" className={location.pathname === '/brokers' ? 'active' : ''}>
            <FontAwesomeIcon icon={faUserTie} style={{ marginRight: '8px' }} />
            Брокеры
          </Link>
        </li>
        <li>
          <Link to="/stocks" className={location.pathname === '/stocks' ? 'active' : ''}>
            <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '8px' }} />
            Акции
          </Link>
        </li>
        <li>
          <Link to="/trading" className={location.pathname === '/trading' ? 'active' : ''}>
            <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '8px' }} />
            Торговля
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function AppContent() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/brokers" element={<BrokersPage />} />
        <Route path="/stocks" element={<StocksPage />} />
        <Route path="/trading" element={<TradingPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
