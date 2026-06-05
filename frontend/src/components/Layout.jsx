import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { getQueue, syncQueue } from '../utils/offline';
import { getUser, roleName, homeByRole } from '../utils/auth';

export default function Layout({title, subtitle, color='verde-bg', children}){
  const nav=useNavigate(); const [online,setOnline]=useState(navigator.onLine); const [pending,setPending]=useState(getQueue().length); const user=getUser();
  useEffect(()=>{ const up=()=>setOnline(true), down=()=>setOnline(false); addEventListener('online',up); addEventListener('offline',down); const i=setInterval(()=>setPending(getQueue().length),1000); return()=>{removeEventListener('online',up);removeEventListener('offline',down);clearInterval(i)} },[]);
  useEffect(()=>{ if(online) syncQueue(api).then(()=>setPending(getQueue().length)); },[online]);
  const logout=()=>{localStorage.removeItem('token');localStorage.removeItem('usuario');nav('/')};
  return <div className="panel-page farm-bg">
    <header className={`top ${color}`}>
      <div className="nav-actions"><button className="mini" onClick={()=>nav(-1)}>⬅️ Regresar</button><button className="mini" onClick={()=>nav(homeByRole(user.rol_id))}>🏠 Inicio</button><button className="mini logout" onClick={logout}>🚪 Salir</button></div>
      <p className="status">{online?'🟢 CONECTADO':'🟠 SIN INTERNET'} {pending>0 && ` | ${pending} pendiente(s) por sincronizar`}</p>
      <h1>{title}</h1><p>{subtitle || `Hola ${user.nombre || ''} · ${roleName(user.rol_id)}`}</p>
    </header>
    <main className="page">{children}</main>
  </div>
}
