import {useEffect,useState} from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import {cacheGet,cacheSet,queueAction} from '../utils/offline';
import {hasRole, ROLES} from '../utils/auth';

export default function Solicitudes(){
  const [data,setData]=useState(cacheGet('solicitudes')); const [msg,setMsg]=useState('');
  async function cargar(){try{const r=await api.get('/solicitudes'); setData(r.data); cacheSet('solicitudes',r.data)}catch{setMsg('Mostrando solicitudes guardadas.')}} useEffect(()=>{cargar()},[]);
  async function estado(id,estado){try{await api.put(`/solicitudes/${id}/estado`,{estado}); setMsg('✅ Estado actualizado'); cargar()}catch(e){if(!navigator.onLine){queueAction({url:`/solicitudes/${id}/estado`,method:'put',data:{estado}}); setMsg('🟠 Cambio guardado para sincronizar.')}else setMsg(e.response?.data?.mensaje||'No se pudo actualizar')}}
  return <Layout title={hasRole(ROLES.PRODUCTOR)?'Solicitudes recibidas':'Mis solicitudes'} subtitle='Seguimiento de negociación por rol'><div className='tabla-contenedor'><table><thead><tr><th>Producto</th><th>Productor</th><th>Comprador</th><th>Cantidad</th><th>Estado</th><th>Acciones permitidas</th></tr></thead><tbody>{data.map(s=><tr key={s.id}><td>🌱 {s.producto}</td><td>{s.productor}</td><td>{s.comprador}</td><td>{s.cantidad_solicitada}</td><td><span className='badge'>{s.estado}</span></td><td>{hasRole(ROLES.PRODUCTOR,ROLES.ADMIN)&&s.estado==='PENDIENTE'&&<><button onClick={()=>estado(s.id,'ACEPTADA')}>✅ Aceptar</button><button className='btn-danger' onClick={()=>estado(s.id,'RECHAZADA')}>❌ Rechazar</button></>}{hasRole(ROLES.COMPRADOR)&&['PENDIENTE','ACEPTADA'].includes(s.estado)&&<button className='btn-secondary' onClick={()=>estado(s.id,'CANCELADA')}>↩️ Cancelar</button>}</td></tr>)}</tbody></table></div>{msg&&<div className='mensaje'>{msg}</div>}</Layout>
}
