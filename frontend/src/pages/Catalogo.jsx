import { useEffect, useState } from "react";
import api from "../api/axios";

function Catalogo() {
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    try {
      const respuesta = await api.get("/publicaciones");
      setPublicaciones(respuesta.data);
    } catch (error) {
      console.error("Error cargando publicaciones", error);
    }
  };

  return (
    <div className="page">
      <h1>Catálogo de Productos</h1>
      <p>Productos agrícolas disponibles en la comunidad.</p>

      <div className="catalogo-grid">
        {publicaciones.map((item) => (
          <div className="producto-card" key={item.id}>
            <h2>{item.producto}</h2>
            <p><strong>Productor:</strong> {item.productor}</p>
            <p><strong>Cantidad:</strong> {item.cantidad} {item.unidad}</p>
            <p><strong>Precio referencial:</strong> Q{item.precio_referencial}</p>
            <p><strong>Estado:</strong> {item.estado}</p>
            <p>{item.descripcion}</p>
            <button>Solicitar compra</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;