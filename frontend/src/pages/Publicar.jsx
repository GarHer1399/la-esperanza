import {useEffect,useState} from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import {queueAction} from '../utils/offline';

export default function Publicar(){
  const [productos,setProductos]=useState([]),[unidades,setUnidades]=useState([]),[msg,setMsg]=useState('');
  const [f,setF]=useState({producto_id:'',unidad_id:'',cantidad:'',precio_referencial:'',descripcion:''});
  useEffect(()=>{api.get('/productos').then(r=>setProductos(r.data)).catch(()=>{}); api.get('/unidades').then(r=>setUnidades(r.data)).catch(()=>{})},[]);
  async function guardar(e){e.preventDefault(); const data={...f,cantidad:Number(f.cantidad),precio_referencial:Number(f.precio_referencial)}; try{await api.post('/publicaciones',data); setMsg('✅ Publicación creada y visible para compradores.'); setF({producto_id:'',unidad_id:'',cantidad:'',precio_referencial:'',descripcion:''});}catch(err){if(!navigator.onLine){queueAction({url:'/publicaciones',method:'post',data}); setMsg('🟠 Guardado sin internet. Se sincronizará al reconectar.')}else setMsg(err.response?.data?.mensaje||'No se pudo crear la publicación')}}
  return <Layout title='Publicar nueva cosecha' subtitle='Solo productores pueden publicar inventario'><form className='form-card' onSubmit={guardar}><label>🌽 Producto</label><select required value={f.producto_id} onChange={e=>setF({...f,producto_id:e.target.value})}><option value=''>Seleccione</option>{productos.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</select><label>⚖️ Unidad</label><select required value={f.unidad_id} onChange={e=>setF({...f,unidad_id:e.target.value})}><option value=''>Seleccione</option>{unidades.map(x=><option key={x.id} value={x.id}>{x.nombre}</option>)}</select><input required min='0.01' step='0.01' type='number' placeholder='Cantidad disponible' value={f.cantidad} onChange={e=>setF({...f,cantidad:e.target.value})}/><input required min='0.01' step='0.01' type='number' placeholder='Precio referencial Q' value={f.precio_referencial} onChange={e=>setF({...f,precio_referencial:e.target.value})}/><textarea placeholder='Descripción corta: calidad, tamaño, observaciones' value={f.descripcion} onChange={e=>setF({...f,descripcion:e.target.value})}/><button>✅ Guardar publicación</button></form>{msg&&<div className='mensaje'>{msg}</div>}</Layout>
}
