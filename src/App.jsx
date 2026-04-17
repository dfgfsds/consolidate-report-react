import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StockPage from './pages/StockPage';
import SalesPage from './pages/SalesPage';
import PurchasePage from './pages/PurchasePage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/purchase" element={<PurchasePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
