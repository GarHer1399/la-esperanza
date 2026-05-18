import { useEffect, useState } from "react";

import api from "../api/axios";

function Incumplimientos() {

  const [incumplimientos, setIncumplimientos] = useState([]);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {

    cargarIncumplimientos();

  }, []);

  const cargarIncumplimientos = async () => {

    try {

      const respuesta = await api.get(
        "/incumplimientos"
      );

      setIncumplimientos(respuesta.data);

    } catch (error) {

      console.error(error);

      setMensaje(
        "Error cargando incumplimientos"
      );
    }
  };

  const revisarReporte = async (
    id,
    aprobado
  ) => {

    try {

      await api.put(
        `/incumplimientos/${id}/revisar`,
        {
          aprobado
        }
      );

      setMensaje(
        "Reporte revisado correctamente"
      );

      cargarIncumplimientos();

    } catch (error) {

      console.error(error);

      setMensaje(
        "Error revisando reporte"
      );
    }
  };

  return (
    <div className="page">

      <h1>
        Incumplimientos
      </h1>

      <p>
        Gestión de reportes y auditoría.
      </p>

      {
        mensaje && (
          <div className="mensaje">
            {mensaje}
          </div>
        )
      }

      <div className="tabla-contenedor">

        <table>

          <thead>

            <tr>

              <th>ID</th>

              <th>Descripción</th>

              <th>Reportado por</th>

              <th>Estado</th>

              <th>Aprobado</th>

              <th>Acciones</th>

            </tr>

          </thead>

          <tbody>

            {
              incumplimientos.map(
                (item) => (

                <tr key={item.id}>

                  <td>
                    {item.id}
                  </td>

                  <td>
                    {item.descripcion}
                  </td>

                  <td>
                    {item.reportado_por}
                  </td>

                  <td>
                    {item.estado}
                  </td>

                  <td>
                    {
                      item.aprobado
                        ? "Sí"
                        : "No"
                    }
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        revisarReporte(
                          item.id,
                          true
                        )
                      }
                    >
                      Aprobar
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() =>
                        revisarReporte(
                          item.id,
                          false
                        )
                      }
                    >
                      Rechazar
                    </button>

                  </td>

                </tr>
              ))
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Incumplimientos;