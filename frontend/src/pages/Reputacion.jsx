import {useEffect,useState} from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import {hasRole, ROLES} from '../utils/auth';

export default function Reputacion(){
  const [data,setData]=useState([]),[hist,setHist]=useState([]),[msg,setMsg]=useState('');
  async function cargar(){try{setData((await api.get('/reputaciones')).data); setHist((await api.get('/historial')).data)}catch{setMsg('No se pudo cargar información actual.')}} useEffect(()=>{cargar()},[]);
  async function recalcular(id){try{await api.put(`/reputaciones/${id}/recalcular`); cargar()}catch(e){setMsg(e.response?.data?.mensaje||'No se pudo recalcular')}}
  return <Layout title='Reputación e historial' subtitle='Calificación por cumplimiento validado'><div className='catalogo-grid'>{data.map(u=><div className='card' key={u.id}><div className='icon-xl'>⭐</div><h2>{u.nombre}</h2><p>{'⭐'.repeat(Math.round(Number(u.reputacion||5)))} ({u.reputacion})</p><p>{u.rol}</p><p>Incumplimientos aprobados: {u.incumplimientos_aprobados}</p>{(hasRole(ROLES.ADMIN)||Number(JSON.parse(localStorage.getItem('usuario')||'{}').id)===Number(u.id))&&<button onClick={()=>recalcular(u.id)}>🔄 Recalcular</button>}</div>)}</div><h2>Historial comercial</h2><div className='tabla-contenedor'><table><thead><tr><th>Producto</th><th>Productor</th><th>Comprador</th><th>Estado</th><th>Fecha</th><th>Resultado</th></tr></thead><tbody>{hist.map((h,i)=><tr key={i}><td>{h.producto}</td><td>{h.productor}</td><td>{h.comprador}</td><td>{h.estado}</td><td>{h.fecha}</td><td>{h.resultado}</td></tr>)}</tbody></table></div>{msg&&<div className='mensaje error'>{msg}</div>}</Layout>
}
