function Dashboard() {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const cerrarSesion = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

    window.location.href = "/";
  };

  return (

    <div className="dashboard">

      <h1>
        Bienvenido, {usuario?.nombre}
      </h1>

      <p>
        Rol: {usuario?.rol}
      </p>

      <div className="dashboard-cards">

        <div
          className="card"
          onClick={() =>
            window.location.href =
              "/catalogo"
          }
        >
          Productos
        </div>

        <div className="card">
          Publicaciones
        </div>

        <div
          className="card"
          onClick={() =>
            window.location.href =
              "/solicitudes"
          }
        >
          Solicitudes
        </div>

        <div
          className="card"
          onClick={() =>
            window.location.href =
              "/entregas"
          }
        >
          Entregas
        </div>

        <div
          className="card"
          onClick={() =>
            window.location.href =
              "/incumplimientos"
          }
        >
          Incumplimientos
        </div>

        <div
          className="card"
          onClick={() =>
            window.location.href =
              "/reputacion"
          }
        >
          Reputación
        </div>

      </div>

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>

    </div>
  );
}

export default Dashboard;