import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Catalogo from "./pages/Catalogo";
import Solicitudes from "./pages/Solicitudes";
import Entregas from "./pages/Entregas";
import Incumplimientos from "./pages/Incumplimientos";
import Reputacion from "./pages/Reputacion";

import "./styles/main.css";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/catalogo"
          element={<Catalogo />}
        />

        <Route
          path="/solicitudes"
          element={<Solicitudes />}
        />

        <Route
          path="/entregas"
          element={<Entregas />}
        />

        <Route
          path="/incumplimientos"
          element={<Incumplimientos />}
        />

        <Route
          path="/reputacion"
          element={<Reputacion />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;