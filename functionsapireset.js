export const onRequestPost = async ({ request, env }) => {
  const { op, adminToken } = await request.json();
  // Demo：超簡易管理驗證。正式可換 Cloudflare Access / Turnstile / JWT
  if(adminToken!=='2025') return new Response('Forbidden', { status:403 });

  const state = (await env.APP_STATE.get('state', { type:'json' })) || {};
  const defaults = (state.prizes||[]).map(p=>({ ...p, remaining: p.defaultRemaining ?? p.remaining ?? 0 }));

  if(op==='reset-remaining'){
    state.prizes = defaults;
  } else if(op==='reset-all'){
    state.logs = [];
    state.usedIds = [];
  } else {
    return new Response('Bad Request', { status:400 });
  }

  await env.APP_STATE.put('state', JSON.stringify(state));
  return new Response('OK');
};
