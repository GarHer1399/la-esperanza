import { useState } from "react";
import api from "../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const obtenerRol = (usuario) => {
    if (usuario.rol) return usuario.rol.toUpperCase();

    switch (usuario.rol_id) {
      case 1:
        return "ADMIN";
      case 2:
        return "PRODUCTOR";
      case 3:
        return "COMPRADOR";
      default:
        return "SIN_ROL";
    }
  };

  const login = async (rolEsperado) => {
    setMensaje("");

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

      const rolUsuario = obtenerRol(usuario);

      console.log("Usuario:", usuario);
      console.log("Rol detectado:", rolUsuario);

      if (rolUsuario !== rolEsperado) {
        setMensaje(
          `Este usuario tiene rol ${rolUsuario}, no ${rolEsperado}`
        );
        return;
      }

      const usuarioFinal = {
        ...usuario,
        rol: rolUsuario,
      };

      localStorage.setItem(
        "token",
        respuesta.data.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioFinal)
      );

      // Redirección por rol
      if (rolUsuario === "ADMIN") {
        window.location.href = "/admin";
      } else if (rolUsuario === "PRODUCTOR") {
        window.location.href = "/dashboard";
      } else if (rolUsuario === "COMPRADOR") {
        window.location.href = "/catalogo";
      } else {
        setMensaje("Rol no reconocido");
      }

    } catch (error) {
      console.error(error);

      setMensaje(
        error.response?.data?.mensaje ||
        "Usuario o contraseña incorrectos"
      );
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

          <p>
            Ingresa tus datos para continuar
          </p>

          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="btn verde"
            onClick={() =>
              login("PRODUCTOR")
            }
          >
            ENTRAR COMO VENDEDOR
          </button>

          <button
            className="btn azul"
            onClick={() =>
              login("COMPRADOR")
            }
          >
            ENTRAR COMO COMPRADOR
          </button>

          <button
            className="btn gris"
            onClick={() =>
              login("ADMIN")
            }
          >
            ENTRAR COMO ADMINISTRADOR
          </button>

          {mensaje && (
            <div className="mensaje error">
              {mensaje}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Login;