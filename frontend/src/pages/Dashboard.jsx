function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const rol = usuario?.rol;

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const ir = (ruta) => (window.location.href = ruta);

  return (
    <div className="panel-page">
      <header className={`top ${rol === "COMPRADOR" ? "azul-bg" : rol === "ADMINISTRADOR" ? "gris-bg" : "verde-bg"}`}>
        <p className="status">🟢 CONECTADO (Los datos se envían en tiempo real)</p>
        <h1>{rol === "COMPRADOR" ? "Centro de Compras" : rol === "ADMINISTRADOR" ? "Panel Asociación" : "Mi Puesto de Venta"}</h1>
        <p>Asociación La Esperanza</p>
      </header>

      <main className="menu">
        <h2>¡Bienvenido, {usuario?.nombre}!</h2>

        {rol === "PRODUCTOR" && (
          <>
            <div className="menu-card" onClick={() => ir("/publicar")}>➕ PUBLICAR NUEVA COSECHA</div>
            <div className="menu-card" onClick={() => ir("/catalogo")}>📦 MIS PRODUCTOS ACTUALES</div>
            <div className="menu-card" onClick={() => ir("/solicitudes")}>📥 PEDIDOS POR RESPONDER</div>
            <div className="menu-card" onClick={() => ir("/entregas")}>🤝 CONFIRMAR ENTREGAS</div>
          </>
        )}

        {rol === "COMPRADOR" && (
          <>
            <div className="menu-card" onClick={() => ir("/catalogo")}>🔍 BUSCAR PRODUCTOS</div>
            <div className="menu-card" onClick={() => ir("/solicitudes")}>📜 MIS PEDIDOS Y ESTADO</div>
            <div className="menu-card" onClick={() => ir("/entregas")}>✅ CONFIRMAR RECEPCIÓN</div>
          </>
        )}

        {rol === "ADMINISTRADOR" && (
          <>
            <div className="menu-card" onClick={() => ir("/admin")}>📊 ESTADÍSTICAS GENERALES</div>
            <div className="menu-card" onClick={() => ir("/incumplimientos")}>⚠️ REPORTES / CONFLICTOS</div>
            <div className="menu-card" onClick={() => ir("/reputacion")}>⭐ REPUTACIÓN</div>
          </>
        )}

        <button className="btn-outline" onClick={cerrarSesion}>SALIR / CERRAR SESIÓN</button>
      </main>
    </div>
  );
}

export default Dashboard;
