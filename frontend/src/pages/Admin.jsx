import {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../api/axios';
import {getQueue,syncQueue} from '../utils/offline';

export default function Admin(){
  const nav=useNavigate(); const [s,setS]=useState({}); const [msg,setMsg]=useState('');
  useEffect(()=>{api.get('/admin/estadisticas').then(r=>setS(r.data)).catch(e=>setMsg(e.response?.data?.mensaje||'No se pudo cargar panel'))},[]);
  async function sync(){const r=await syncQueue(api); setMsg(`Sincronizados: ${r.synced||0}. Pendientes: ${getQueue().length}`)}
  const labels={usuarios:'Usuarios',productos:'Productos',publicaciones:'Publicaciones',solicitudes_compra:'Solicitudes',entregas:'Entregas',incumplimientos:'Incumplimientos'};
  return <Layout title='Panel Asociación' subtitle='Administración, reportes y control general' color='gris-bg'><div className='dashboard-cards'>{Object.entries(s).map(([k,v])=><div className='card' key={k}><h2>{v}</h2><p>{labels[k]||k}</p></div>)}</div><div className='menu-grid'><button className='big-card' onClick={()=>nav('/admin/usuarios')}>👥<b>Gestionar usuarios y roles</b><small>Alta, baja y cambio de permisos</small></button><button className='big-card' onClick={()=>nav('/incumplimientos')}>⚠️<b>Revisar reportes</b><small>Aprobar o rechazar incumplimientos</small></button><button className='big-card' onClick={()=>nav('/reputacion')}>⭐<b>Reputación e historial</b><small>Indicadores comunitarios</small></button><button className='big-card' onClick={sync}>🔄<b>Sincronizar pendientes</b><small>Cola offline local</small></button></div>{msg&&<div className='mensaje'>{msg}</div>}</Layout>
}
