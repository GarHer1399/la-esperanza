import { useEffect, useState } from "react";
import api from "../api/axios";

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const cargar = async () => {
    try {
      const r = await api.get("/solicitudes");
      setSolicitudes(r.data);
    } catch {
      setMensaje("Error al cargar solicitudes");
    }
  };

  useEffect(() => { cargar(); }, []);

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/solicitudes/${id}/estado`, { estado });
      setMensaje(`Solicitud ${estado.toLowerCase()}`);
      cargar();
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al cambiar estado");
    }
  };

  return (
    <div className="page">
      <h1>Solicitudes de Compra</h1>
      <p>Pedidos enviados por compradores y estado de negociación.</p>
      {mensaje && <div className="mensaje">{mensaje}</div>}

      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr><th>ID</th><th>Producto</th><th>Comprador</th><th>Cantidad</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.producto}</td>
                <td>{s.comprador}</td>
                <td>{s.cantidad_solicitada}</td>
                <td><span className="badge">{s.estado}</span></td>
                <td>
                  <button onClick={() => cambiarEstado(s.id, "ACEPTADA")}>Aceptar</button>
                  <button className="btn-danger" onClick={() => cambiarEstado(s.id, "RECHAZADA")}>Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Solicitudes;
