import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Products from "./pages/Products";
import Sales from "./pages/Sales";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sales />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;