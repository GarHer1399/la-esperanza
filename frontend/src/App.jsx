import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Catalogo from "./pages/Catalogo";
import Entregas from "./pages/Entregas";
import "./styles/main.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/entregas" element={<Entregas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;