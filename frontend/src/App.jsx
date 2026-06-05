import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Catalogo from './pages/Catalogo';
import Publicar from './pages/Publicar';
import Solicitudes from './pages/Solicitudes';
import Entregas from './pages/Entregas';
import Incumplimientos from './pages/Incumplimientos';
import Reputacion from './pages/Reputacion';
import Admin from './pages/Admin';
import AdminUsuarios from './pages/AdminUsuarios';
import { getUser, hasRole, ROLES } from './utils/auth';
import './styles/main.css';

function RutaPrivada({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to='/' replace />;
}
function RutaRol({ roles, children }) {
  if (!localStorage.getItem('token')) return <Navigate to='/' replace />;
  return hasRole(...roles) ? children : <Navigate to='/no-autorizado' replace />;
}
function NoAutorizado(){ const u=getUser(); return <div className='login-screen farm-bg'><div className='home-card login-body'><h1>🔒 Acceso no autorizado</h1><p>Tu rol actual no tiene permiso para abrir esta sección.</p><p><b>Rol:</b> {u.rol}</p><button onClick={()=>location.href='/dashboard'}>🏠 Volver a mi panel</button></div></div> }
export default function App(){return <BrowserRouter><Routes>
  <Route path='/' element={<Login/>}/>
  <Route path='/dashboard' element={<RutaPrivada><Dashboard/></RutaPrivada>}/>
  <Route path='/catalogo' element={<RutaRol roles={[ROLES.COMPRADOR, ROLES.PRODUCTOR, ROLES.ADMIN]}><Catalogo/></RutaRol>}/>
  <Route path='/publicar' element={<RutaRol roles={[ROLES.PRODUCTOR]}><Publicar/></RutaRol>}/>
  <Route path='/solicitudes' element={<RutaRol roles={[ROLES.PRODUCTOR, ROLES.COMPRADOR, ROLES.ADMIN]}><Solicitudes/></RutaRol>}/>
  <Route path='/entregas' element={<RutaRol roles={[ROLES.PRODUCTOR, ROLES.COMPRADOR, ROLES.OPERADOR, ROLES.ADMIN]}><Entregas/></RutaRol>}/>
  <Route path='/incumplimientos' element={<RutaRol roles={[ROLES.PRODUCTOR, ROLES.COMPRADOR, ROLES.ADMIN, ROLES.OPERADOR]}><Incumplimientos/></RutaRol>}/>
  <Route path='/reputacion' element={<RutaPrivada><Reputacion/></RutaPrivada>}/>
  <Route path='/admin' element={<RutaRol roles={[ROLES.ADMIN]}><Admin/></RutaRol>}/>
  <Route path='/admin/usuarios' element={<RutaRol roles={[ROLES.ADMIN, ROLES.OPERADOR]}><AdminUsuarios/></RutaRol>}/>
  <Route path='/no-autorizado' element={<RutaPrivada><NoAutorizado/></RutaPrivada>}/>
  <Route path='*' element={<Navigate to='/' replace/>}/>
</Routes></BrowserRouter>}
