import { useEffect,useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import {cacheGet,cacheSet,queueAction} from '../utils/offline';
import { hasRole, ROLES } from '../utils/auth';

export default function Catalogo(){
  const [items,setItems]=useState(cacheGet('publicaciones')); const [q,setQ]=useState(''); const [msg,setMsg]=useState('');
  async function cargar(){try{const r=await api.get('/publicaciones'); setItems(r.data); cacheSet('publicaciones',r.data)}catch{setMsg('Mostrando datos guardados porque no hay conexión.')}} useEffect(()=>{cargar()},[]);
  async function solicitar(p){const cantidad=prompt(`¿Cuánto deseas solicitar de ${p.producto}?`); if(!cantidad) return; const data={publicacion_id:p.id, cantidad_solicitada:Number(cantidad)}; try{await api.post('/solicitudes',data); setMsg('✅ Solicitud enviada al productor.');}catch(e){if(!navigator.onLine){queueAction({url:'/solicitudes',method:'post',data}); setMsg('🟠 Sin conexión. La solicitud quedó pendiente para sincronizar.')}else setMsg(e.response?.data?.mensaje||'No se pudo enviar la solicitud')}}
  const filtrados=items.filter(i=>(i.producto||'').toLowerCase().includes(q.toLowerCase()));
  return <Layout title={hasRole(ROLES.PRODUCTOR)?'Mi inventario publicado':'Catálogo de productos'} subtitle={hasRole(ROLES.COMPRADOR)?'Busca productos disponibles y envía solicitudes':'Consulta publicaciones permitidas'} color='azul-bg'><input className='search' placeholder='🔎 Buscar tomate, papa, maíz...' value={q} onChange={e=>setQ(e.target.value)}/>{msg&&<div className='mensaje'>{msg}</div>}<div className='catalogo-grid'>{filtrados.map(p=><div className='producto-card' key={p.id}><div className='icon-xl'>🌱</div><h2>{p.producto}</h2><p><b>Disponible:</b> {p.cantidad} {p.unidad}</p><p><b>Precio referencial:</b> Q{p.precio_referencial}</p><p><b>Productor:</b> {p.productor}</p><p><b>Reputación:</b> {'⭐'.repeat(Math.round(Number(p.reputacion||5)))}</p><span className='semaforo'>🟢 {p.estado}</span>{hasRole(ROLES.COMPRADOR)&&<button className='btn azul' onClick={()=>solicitar(p)}>🛒 Solicitar compra</button>}</div>)}</div></Layout>
}
