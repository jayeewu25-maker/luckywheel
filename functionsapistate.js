export const onRequestGet = async ({ env }) => {
  const defaults = {
    prizes: [
      { id:1,label:"特獎",color:"#FBBF24",weight:1,remaining:1,defaultRemaining:1 },
      { id:2,label:"頭獎",color:"#F87171",weight:2,remaining:2,defaultRemaining:2 },
      { id:3,label:"二獎",color:"#34D399",weight:3,remaining:3,defaultRemaining:3 },
      { id:4,label:"三獎",color:"#60A5FA",weight:4,remaining:5,defaultRemaining:5 },
      { id:5,label:"再接再厲",color:"#A78BFA",weight:5,remaining:10,defaultRemaining:10 },
      { id:6,label:"銘謝惠顧",color:"#9CA3AF",weight:8,remaining:20,defaultRemaining:20 },
    ],
    logs: [],
    usedIds: [],
    employees: [
      { empId:"EMP001",pmtId:"A123456781" },
      { empId:"EMP002",pmtId:"A123456782" },
      { empId:"EMP003",pmtId:"A123456783" },
      { empId:"EMP004",pmtId:"A123456784" },
      { empId:"EMP005",pmtId:"A123456785" },
    ],
  };
  const state = await env.APP_STATE.get('state', { type:'json' });
  return new Response(JSON.stringify(state || defaults), {
    headers: { 'content-type': 'application/json' }
  });
};

export const onRequestPost = async ({ request, env }) => {
  const incoming = await request.json(); // 直接覆寫整個 state
  await env.APP_STATE.put('state', JSON.stringify(incoming));
  return new Response('OK');
};
