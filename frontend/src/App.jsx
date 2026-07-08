import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import SaleHistory from './pages/SaleHistory';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Purchases from './pages/Purchases';
import ProtectedRoute from "./components/ProtectedRoute";
import PurchasesHistory from './pages/PurchasesHistory';
import Reports from './pages/Reports';

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } 
        />
        <Route path="/purchases-history" element={
          <ProtectedRoute>
            <PurchasesHistory />
          </ProtectedRoute>
        } />
        <Route path='/purchases' element={
          <ProtectedRoute>
            <Purchases />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
          } 
        />
        
        <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
        />

        <Route path="/sales" element={
          <ProtectedRoute>
            <Sales />
          </ProtectedRoute>
        }
        />

        <Route path="/sales-history" element={
          <ProtectedRoute>
            <SaleHistory />
          </ProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;