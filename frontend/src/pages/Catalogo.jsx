import { useEffect, useState } from "react";
import api from "../api/axios";

function Catalogo() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [publicaciones, setPublicaciones] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const cargar = async () => {
    try {
      const r = await api.get("/publicaciones");
      setPublicaciones(r.data);
    } catch {
      setMensaje("Error cargando publicaciones");
    }
  };

  useEffect(() => { cargar(); }, []);

  const solicitar = async (publicacion) => {
    const cantidad = prompt(`¿Cuántos ${publicacion.unidad} deseas solicitar de ${publicacion.producto}?`);
    if (!cantidad) return;

    try {
      await api.post("/solicitudes", {
        publicacion_id: publicacion.id,
        comprador_id: usuario.id,
        cantidad_solicitada: cantidad,
      });
      setMensaje("Solicitud enviada al productor");
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error enviando solicitud");
    }
  };

  return (
    <div className="page">
      <h1>Catálogo de Productos</h1>
      <p>Productos agrícolas disponibles en la comunidad.</p>
      {mensaje && <div className="mensaje">{mensaje}</div>}

      <div className="catalogo-grid">
        {publicaciones.map((item) => (
          <div className="producto-card" key={item.id}>
            <h2>{item.producto}</h2>
            <p><strong>Productor:</strong> {item.productor}</p>
            <p><strong>Cantidad:</strong> {item.cantidad} {item.unidad}</p>
            <p><strong>Precio referencial:</strong> Q{item.precio_referencial}</p>
            <p><strong>Estado:</strong> {item.estado}</p>
            <p>{item.descripcion}</p>
            {usuario?.rol === "COMPRADOR" && <button onClick={() => solicitar(item)}>Solicitar compra</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
