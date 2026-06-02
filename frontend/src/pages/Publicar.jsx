import { useEffect, useState } from "react";
import api from "../api/axios";

function Publicar() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [productos, setProductos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [form, setForm] = useState({ producto_id: "", unidad_id: "", cantidad: "", precio_referencial: "", descripcion: "" });

  useEffect(() => {
    api.get("/productos").then((r) => setProductos(r.data));
    api.get("/unidades").then((r) => setUnidades(r.data));
  }, []);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await api.post("/publicaciones", { ...form, productor_id: usuario.id });
      setMensaje("Cosecha publicada correctamente");
      setForm({ producto_id: "", unidad_id: "", cantidad: "", precio_referencial: "", descripcion: "" });
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al publicar");
    }
  };

  return (
    <div className="page narrow">
      <h1>Publicar nueva cosecha</h1>
      <p>Registra producto, cantidad y precio referencial público.</p>
      {mensaje && <div className="mensaje">{mensaje}</div>}

      <form className="form-card" onSubmit={guardar}>
        <select name="producto_id" value={form.producto_id} onChange={cambiar} required>
          <option value="">Seleccionar producto</option>
          {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>

        <select name="unidad_id" value={form.unidad_id} onChange={cambiar} required>
          <option value="">Seleccionar unidad</option>
          {unidades.map((u) => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>

        <input name="cantidad" type="number" min="1" placeholder="Cantidad disponible" value={form.cantidad} onChange={cambiar} required />
        <input name="precio_referencial" type="number" min="1" placeholder="Precio referencial Q" value={form.precio_referencial} onChange={cambiar} required />
        <textarea name="descripcion" placeholder="Observaciones de la cosecha" value={form.descripcion} onChange={cambiar} />
        <button>GUARDAR PUBLICACIÓN</button>
        <button type="button" className="btn-secondary" onClick={() => history.back()}>Regresar</button>
      </form>
    </div>
  );
}

export default Publicar;
