function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <h1>Bienvenido, {usuario?.nombre}</h1>
      <p>Rol: {usuario?.rol}</p>

      <div className="dashboard-cards">
        <div className="card">Productos</div>
        <div className="card">Publicaciones</div>
        <div className="card">Solicitudes</div>
        <div className="card">Entregas</div>
        <div className="card">Incumplimientos</div>
        <div className="card">Reputación</div>
      </div>

      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}

export default Dashboard;