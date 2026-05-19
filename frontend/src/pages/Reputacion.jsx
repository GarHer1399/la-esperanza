import { useEffect, useState } from "react";

import api from "../api/axios";

function Reputacion() {

  const [usuarios, setUsuarios] = useState([]);

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {

    cargarReputaciones();

  }, []);

  const cargarReputaciones = async () => {

    try {

      const respuesta = await api.get(
        "/reputaciones"
      );

      setUsuarios(respuesta.data);

    } catch (error) {

      console.error(error);

      setMensaje(
        "Error cargando reputaciones"
      );
    }
  };

  const recalcular = async (id) => {

    try {

      await api.put(
        `/reputaciones/${id}/recalcular`
      );

      setMensaje(
        "Reputación recalculada"
      );

      cargarReputaciones();

    } catch (error) {

      console.error(error);

      setMensaje(
        "Error recalculando reputación"
      );
    }
  };

  const estrellas = (valor) => {

    const cantidad = Math.round(valor);

    return "⭐".repeat(cantidad);
  };

  return (

    <div className="page">

      <h1>
        Reputación de Usuarios
      </h1>

      <p>
        Sistema de reputación y confianza.
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

              <th>Nombre</th>

              <th>Rol</th>

              <th>Reputación</th>

              <th>Incumplimientos</th>

              <th>Acciones</th>

            </tr>

          </thead>

          <tbody>

            {
              usuarios.map((usuario) => (

                <tr key={usuario.id}>

                  <td>
                    {usuario.id}
                  </td>

                  <td>
                    {usuario.nombre}
                  </td>

                  <td>
                    {usuario.rol}
                  </td>

                  <td>
                    {estrellas(usuario.reputacion)}
                  </td>

                  <td>
                    {
                      usuario.incumplimientos_aprobados
                    }
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        recalcular(usuario.id)
                      }
                    >
                      Recalcular
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

export default Reputacion;