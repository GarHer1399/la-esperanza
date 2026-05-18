import { useEffect, useState } from "react";
import api from "../api/axios";

function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarEntregas();
  }, []);

  const cargarEntregas = async () => {
    try {
      const respuesta = await api.get("/entregas");
      setEntregas(respuesta.data);
    } catch (error) {
      console.error(error);
      setMensaje("Error cargando entregas");
    }
  };

  return (
    <div className="page">
      <h1>Entregas</h1>
      <p>Control de entregas programadas.</p>

      {mensaje && <div className="mensaje">{mensaje}</div>}

      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Comprador</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Punto</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {entregas.map((entrega) => (
              <tr key={entrega.id}>
                <td>{entrega.id}</td>
                <td>{entrega.producto}</td>
                <td>{entrega.comprador}</td>
                <td>{entrega.fecha_entrega}</td>
                <td>{entrega.hora_entrega}</td>
                <td>{entrega.punto_entrega}</td>
                <td>{entrega.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Entregas;