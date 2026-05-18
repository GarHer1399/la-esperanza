import { useEffect, useState } from "react";

import api from "../api/axios";

function Solicitudes() {

  const [solicitudes, setSolicitudes] = useState([]);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {

    cargarSolicitudes();

  }, []);

  const cargarSolicitudes = async () => {

    try {

      const respuesta = await api.get(
        "/solicitudes"
      );

      setSolicitudes(respuesta.data);

    } catch (error) {

      console.error(error);

      setMensaje(
        "Error cargando solicitudes"
      );
    }
  };

  const cambiarEstado = async (
    id,
    estado
  ) => {

    try {

      await api.put(
        `/solicitudes/${id}/estado`,
        {
          estado
        }
      );

      setMensaje(
        `Solicitud ${estado.toLowerCase()} correctamente`
      );

      cargarSolicitudes();

    } catch (error) {

      console.error(error);

      setMensaje(
        "Error actualizando solicitud"
      );
    }
  };

  return (

    <div className="page">

      <h1>
        Solicitudes de Compra
      </h1>

      <p>
        Gestión de solicitudes realizadas.
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

              <th>Producto</th>

              <th>Comprador</th>

              <th>Cantidad</th>

              <th>Estado</th>

              <th>Acciones</th>

            </tr>

          </thead>

          <tbody>

            {
              solicitudes.map(
                (solicitud) => (

                <tr key={solicitud.id}>

                  <td>
                    {solicitud.id}
                  </td>

                  <td>
                    {solicitud.producto}
                  </td>

                  <td>
                    {solicitud.comprador}
                  </td>

                  <td>
                    {solicitud.cantidad_solicitada}
                  </td>

                  <td>
                    {solicitud.estado}
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        cambiarEstado(
                          solicitud.id,
                          "ACEPTADA"
                        )
                      }
                    >
                      Aceptar
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() =>
                        cambiarEstado(
                          solicitud.id,
                          "RECHAZADA"
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

export default Solicitudes;