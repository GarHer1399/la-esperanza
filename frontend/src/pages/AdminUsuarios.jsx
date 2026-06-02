import { useState } from "react";
import api from "../api/axios";

function AdminUsuarios() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    ubicacion: "",
    username: "",
    password: "",
    rol_id: 2,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        ...form,
        rol_id: Number(form.rol_id),
      });

      alert("Usuario registrado correctamente");

      setForm({
        nombre: "",
        telefono: "",
        ubicacion: "",
        username: "",
        password: "",
        rol_id: 2,
      });
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al registrar usuario");
    }
  };

  return (
    <div className="page">
      <h1>Gestión de usuarios</h1>
      <p>Registro asistido de productores y compradores.</p>

      <form onSubmit={registrarUsuario} className="form-card">
        <input
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <input
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          required
        />

        <input
          name="ubicacion"
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={handleChange}
        />

        <input
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select name="rol_id" value={form.rol_id} onChange={handleChange}>
          <option value={2}>Productor / Vendedor</option>
          <option value={3}>Comprador</option>
          <option value={1}>Administrador</option>
        </select>

        <button type="submit">Registrar usuario</button>
      </form>
    </div>
  );
}

export default AdminUsuarios;