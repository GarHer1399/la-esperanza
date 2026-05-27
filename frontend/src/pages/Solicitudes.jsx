import { useEffect, useState } from "react";
import api from "../api/axios";

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarSolicitudes = async () => {
    try {
      const respuesta = await api.get("/solicitudes");
      setSolicitudes(respuesta.data);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/solicitudes/${id}/estado`, { estado });
      cargarSolicitudes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  if (cargando) {
    return <p>Cargando solicitudes...</p>;
  }

  return (
    <div>
      <h1>Solicitudes de Compra</h1>

      {solicitudes.length === 0 ? (
        <p>No hay solicitudes registradas.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id_solicitud}>
                <td>{solicitud.id_solicitud}</td>
                <td>{solicitud.producto}</td>
                <td>{solicitud.cantidad_solicitada}</td>
                <td>{solicitud.estado}</td>
                <td>
                  <button
                    onClick={() =>
                      cambiarEstado(solicitud.id_solicitud, "aceptada")
                    }
                  >
                    Aceptar
                  </button>

                  <button
                    onClick={() =>
                      cambiarEstado(solicitud.id_solicitud, "rechazada")
                    }
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Solicitudes;