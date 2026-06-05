const QUEUE_KEY = 'la_esperanza_offline_queue';
const CACHE_KEY = 'la_esperanza_cache';

export function getQueue(){ return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); }
export function queueAction(action){ const q=getQueue(); q.push({...action, id: crypto.randomUUID(), createdAt:new Date().toISOString(), status:'PENDIENTE'}); localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); return q; }
export function clearQueue(){ localStorage.setItem(QUEUE_KEY,'[]'); }
export function cacheSet(key,data){ const c=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}'); c[key]={data, savedAt:new Date().toISOString()}; localStorage.setItem(CACHE_KEY,JSON.stringify(c)); }
export function cacheGet(key,fallback=[]){ const c=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}'); return c[key]?.data ?? fallback; }
export async function syncQueue(api){
  if(!navigator.onLine) return {ok:false, synced:0, message:'Sin conexión'};
  const q=getQueue(); let synced=0; const pending=[];
  for(const item of q){
    try{ await api({method:item.method||'post', url:item.url, data:item.data}); synced++; }
    catch(e){ pending.push({...item,status:'ERROR', error:e.response?.data?.mensaje||e.message}); }
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(pending));
  return {ok: pending.length===0, synced, pending: pending.length};
}
