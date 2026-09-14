import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/admin/Dashboard';
import IngredientsManager from './pages/admin/IngredientsManager';
import ProductsManager from './pages/admin/ProductsManager';

import AnalysisResult from './pages/AnalysisResult';
import Scan from './pages/Scan';

// New Pages
import Profile from './pages/Profile';
import Store from './pages/Store';
import AdminStore from './pages/AdminStore';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/app" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/result/:id" element={<AnalysisResult />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/store" element={<Store />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="ingredients" element={<IngredientsManager />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="store" element={<AdminStore />} />
        </Route>

        {/* Rota provisória na raiz */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
