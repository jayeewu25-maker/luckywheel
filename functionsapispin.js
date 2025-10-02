function weightedPick(items){
  const total = items.reduce((s,p)=>s+(+p.weight||0),0);
  if(total<=0) return items[Math.floor(Math.random()*items.length)];
  let r = Math.random()*total;
  for(const it of items){ r -= (+it.weight||0); if(r<=0) return it; }
  return items[items.length-1];
}

export const onRequestPost = async ({ request, env }) => {
  const { participant } = await request.json(); // e.g. 'EMP001' 或 '系統管理員'

  const state = (await env.APP_STATE.get('state', { type:'json' })) || {};
  state.prizes = (state.prizes||[]).sort((a,b)=>a.id-b.id);
  state.logs = state.logs||[];
  state.usedIds = state.usedIds||[];
  state.employees = state.employees||[];

  const available = state.prizes.filter(p=>p.remaining>0);
  if(available.length===0){
    return new Response(JSON.stringify({ ok:false, reason:'NO_PRIZE' }), { headers:{'content-type':'application/json'} });
  }

  const picked = weightedPick(available);
  state.prizes = state.prizes.map(p=>p.id===picked.id ? { ...p, remaining: Math.max(0,(p.remaining||0)-1) } : p);

  const log = { ts:new Date().toISOString(), prize:picked.label, id:picked.id, employeeId:participant };
  state.logs.push(log);
  if(state.logs.length>100) state.logs.shift();
  if(participant!=="系統管理員"){ state.usedIds.push(participant); }

  await env.APP_STATE.put('state', JSON.stringify(state));
  return new Response(JSON.stringify({ ok:true, picked }), { headers:{'content-type':'application/json'} });
};
