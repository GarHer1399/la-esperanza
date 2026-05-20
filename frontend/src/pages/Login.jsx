import { useState } from "react";
import api from "../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", respuesta.data.token);
      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));

      setMensaje("Login exitoso");

      window.location.href = "/dashboard";
    } catch (error) {
      setMensaje("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={iniciarSesion}>
        <h1 className="login-title">Sistema La Esperanza</h1>

        <p className="login-subtitle">Ingreso al sistema agrícola</p>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Iniciar sesión</button>

        {mensaje && <span className="login-message">{mensaje}</span>}
      </form>
    </div>
  );
}

export default Login;