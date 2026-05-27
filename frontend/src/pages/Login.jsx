import { useState } from "react";
import api from "../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const normalizarRol = (rol) => {
    if (rol === "OPERADOR") return "PRODUCTOR";
    if (rol === "VENDEDOR") return "PRODUCTOR";
    if (rol === "ADMINISTRADOR") return "ADMIN";
    return rol;
  };

  const login = async (rolEsperado) => {
    if (!username || !password) {
      setMensaje("Ingresa usuario y contraseña");
      return;
    }

    try {
      const respuesta = await api.post("/auth/login", {
        username,
        password,
      });

      const usuario = respuesta.data.usuario;
      const rolUsuario = normalizarRol(usuario.rol);
      const rolBoton = normalizarRol(rolEsperado);

      if (rolBoton && rolUsuario !== rolBoton) {
        setMensaje(`Este usuario no tiene rol ${rolBoton}`);
        return;
      }

      const usuarioNormalizado = {
        ...usuario,
        rol: rolUsuario,
      };

      localStorage.setItem("token", respuesta.data.token);
      localStorage.setItem("usuario", JSON.stringify(usuarioNormalizado));

      window.location.href = "/dashboard";
    } catch (error) {
      setMensaje("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-screen">
      <div className="home-card">
        <div className="hero">
          <h1>LA ESPERANZA</h1>
          <p>Sistema de Gestión Comunitaria</p>
        </div>

        <div className="login-body">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus datos para continuar</p>

          <input
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

          <button className="btn verde" onClick={() => login("PRODUCTOR")}>
            ENTRAR COMO VENDEDOR
          </button>

          <button className="btn azul" onClick={() => login("COMPRADOR")}>
            ENTRAR COMO COMPRADOR
          </button>

          <button className="btn gris" onClick={() => login("ADMIN")}>
            ENTRAR COMO ADMINISTRADOR
          </button>

          {mensaje && <div className="mensaje error">{mensaje}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;