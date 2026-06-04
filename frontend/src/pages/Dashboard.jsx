import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getUser, roleName, ROLES } from '../utils/auth';

export default function Dashboard(){
  const nav=useNavigate(); const u=getUser(); const rol=Number(u.rol_id);
  const menus = {
    [ROLES.PRODUCTOR]: [
      ['➕','Publicar cosecha','/publicar','Crear productos disponibles para venta'],
      ['📋','Solicitudes recibidas','/solicitudes','Aceptar o rechazar pedidos de compradores'],
      ['🚚','Mis entregas','/entregas','Programar y confirmar entregas'],
      ['⚠️','Reportar problema','/incumplimientos','Reportar incumplimientos de entregas'],
      ['⭐','Mi reputación','/reputacion','Ver historial y estrellas'],
      ['🌽','Mi inventario','/catalogo','Consultar mis publicaciones']
    ],
    [ROLES.COMPRADOR]: [
      ['🌽','Catálogo agrícola','/catalogo','Buscar productos y enviar solicitudes'],
      ['📋','Mis solicitudes','/solicitudes','Ver seguimiento de compras'],
      ['🚚','Mis entregas','/entregas','Validar recepción de productos'],
      ['⚠️','Reportar problema','/incumplimientos','Reportar incumplimientos'],
      ['⭐','Mi reputación','/reputacion','Ver historial y estrellas']
    ],
    [ROLES.OPERADOR]: [
      ['👥','Registro asistido','/admin/usuarios','Crear productores o compradores'],
      ['🚚','Entregas','/entregas','Apoyar coordinación logística'],
      ['⚠️','Incumplimientos','/incumplimientos','Apoyar captura de reportes']
    ],
    [ROLES.ADMIN]: [
      ['⚙️','Panel de administración','/admin','Reportes, roles y control general']
    ]
  };
  const cards = menus[rol] || [];
  return <Layout title='Mi Panel Principal' subtitle={`${u.nombre||''} · Rol: ${roleName(rol)}`} color={rol===ROLES.COMPRADOR?'azul-bg':rol===ROLES.ADMIN?'gris-bg':'verde-bg'}><div className='quick-help'>👋 Aquí solo aparecen las opciones permitidas para tu rol. Si no hay internet, las acciones se guardan y se sincronizan después.</div><div className='menu-grid'>{cards.map(c=><button className='big-card' key={c[2]} onClick={()=>nav(c[2])}><span>{c[0]}</span><b>{c[1]}</b><small>{c[3]}</small></button>)}</div></Layout>
}
