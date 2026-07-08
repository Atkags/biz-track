import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import SaleHistory from './pages/SaleHistory';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from "./components/ProtectedRoute"

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

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