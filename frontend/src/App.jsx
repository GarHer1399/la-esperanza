import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Catalogo from "./pages/Catalogo";
import Solicitudes from "./pages/Solicitudes";
import Entregas from "./pages/Entregas";
import Incumplimientos from "./pages/Incumplimientos";
import Reputacion from "./pages/Reputacion";
import Admin from "./pages/Admin";
import Publicar from "./pages/Publicar";
import "./styles/main.css";

function RutaPrivada({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<RutaPrivada><Dashboard /></RutaPrivada>} />
        <Route path="/catalogo" element={<RutaPrivada><Catalogo /></RutaPrivada>} />
        <Route path="/publicar" element={<RutaPrivada><Publicar /></RutaPrivada>} />
        <Route path="/solicitudes" element={<RutaPrivada><Solicitudes /></RutaPrivada>} />
        <Route path="/entregas" element={<RutaPrivada><Entregas /></RutaPrivada>} />
        <Route path="/incumplimientos" element={<RutaPrivada><Incumplimientos /></RutaPrivada>} />
        <Route path="/reputacion" element={<RutaPrivada><Reputacion /></RutaPrivada>} />
        <Route path="/admin" element={<RutaPrivada><Admin /></RutaPrivada>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
