export const ROLES = { ADMIN: 1, OPERADOR: 2, PRODUCTOR: 3, COMPRADOR: 4 };
export const roleName = (id) => ({1:'Administrador',2:'Operador',3:'Productor',4:'Comprador'}[Number(id)] || 'Usuario');
export const getUser = () => JSON.parse(localStorage.getItem('usuario') || '{}');
export const hasRole = (...roles) => roles.includes(Number(getUser().rol_id));
export const homeByRole = (rolId) => Number(rolId) === ROLES.ADMIN ? '/admin' : '/dashboard';
