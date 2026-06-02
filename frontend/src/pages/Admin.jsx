import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Admin() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    cargarStats();
  }, []);

  const cargarStats = async () => {
    try {
      const respuesta = await api.get(
        "/admin/estadisticas"
      );

      setStats(
        respuesta.data
      );

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page">

      <h1>
        Panel Administrativo
      </h1>

      <p>
        Estadísticas generales del sistema.
      </p>

      {/* BOTONES DE ADMINISTRACIÓN */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "25px"
        }}
      >

        <Link to="/admin/usuarios">
          <button>
            Registrar Usuarios
          </button>
        </Link>

        <Link to="/solicitudes">
          <button>
            Solicitudes
          </button>
        </Link>

        <Link to="/entregas">
          <button>
            Entregas
          </button>
        </Link>

        <Link to="/incumplimientos">
          <button>
            Incumplimientos
          </button>
        </Link>

        <Link to="/reputacion">
          <button>
            Reputación
          </button>
        </Link>

      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}

      <div className="dashboard-cards">

        <div className="card">
          Usuarios
          <h2>
            {stats.usuarios}
          </h2>
        </div>

        <div className="card">
          Productos
          <h2>
            {stats.productos}
          </h2>
        </div>

        <div className="card">
          Solicitudes
          <h2>
            {stats.solicitudes}
          </h2>
        </div>

        <div className="card">
          Entregas
          <h2>
            {stats.entregas}
          </h2>
        </div>

        <div className="card">
          Incumplimientos
          <h2>
            {stats.incumplimientos}
          </h2>
        </div>

      </div>

    </div>
  );
}

export default Admin;