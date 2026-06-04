import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { homeByRole } from '../utils/auth';

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar(e) {
    e?.preventDefault();
    setMsg('');
    if (!username.trim() || !password) {
      setMsg('Ingresa tu usuario y contraseña.');
      return;
    }
    try {
      setLoading(true);
      const r = await api.post('/auth/login', { username: username.trim(), password });
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('usuario', JSON.stringify(r.data.usuario));
      nav(homeByRole(r.data.usuario.rol_id), { replace: true });
    } catch (e) {
      setMsg(e.response?.data?.mensaje || 'No se pudo iniciar sesión. Revisa usuario, contraseña o conexión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='login-screen farm-bg'>
      <div className='home-card'>
        <div className='hero'>
          <h1>🌾 LA ESPERANZA</h1>
          <p>Sistema de Gestión y Comercialización Agrícola</p>
        </div>
        <form className='login-body' onSubmit={entrar}>
          <h2>Iniciar sesión</h2>
          <p>Acceso privado para productores, compradores, operador y asociación.</p>
          <input placeholder='Usuario' value={username} onChange={e => setUsername(e.target.value)} autoComplete='username' />
          <input placeholder='Contraseña' type='password' value={password} onChange={e => setPassword(e.target.value)} autoComplete='current-password' />
          <button className='btn verde' disabled={loading}>{loading ? 'Ingresando...' : '👨‍🌾 ENTRAR AL SISTEMA'}</button>
          {msg && <div className='mensaje error'>{msg}</div>}
          <small>Aplicación offline-first: permite trabajar con baja conectividad y sincroniza cuando vuelve internet.</small>
        </form>
      </div>
    </div>
  );
}
