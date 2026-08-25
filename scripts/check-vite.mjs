const base = 'http://localhost:3001';
const html = await (await fetch(base + '/')).text();
console.log('GET / :', html.includes('id="root"') ? 'HTML ok' : 'HTML MISSING ROOT');
for (const m of ['/src/main.tsx', '/src/App.tsx', '/src/components/WorksPage.tsx', '/src/context/ContentContext.tsx', '/src/admin/AdminPanel.tsx']) {
  const r = await fetch(base + m);
  console.log(m, '->', r.status);
}
const api = await fetch(base + '/api/content');
const data = await api.json();
console.log('proxy /api/content ->', api.status, '| projects:', data.projects.length);
const img = await fetch(base + '/img/poster/RentMasterFinal.jpg', { method: 'HEAD' });
console.log('proxy /img HEAD ->', img.status);
