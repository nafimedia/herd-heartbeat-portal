async function waitFor(url, attempts = 10, delay = 300) {
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url, { method: 'GET' });
      if (r.ok) return true;
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, delay));
  }
  return false;
}

async function run() {
  const base = 'http://localhost:3001';
  const ready = await waitFor(`${base}/api/health`, 20, 300);
  if (!ready) {
    console.error('Server not ready at', `${base}/api/health`);
    process.exit(2);
  }

  // login
  const loginRes = await fetch(`${base}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@farm.local', password: 'password' }),
  });
  console.log('login status', loginRes.status);
  const loginBody = await loginRes.text();
  console.log('login body', loginBody);
  if (loginRes.status !== 200) process.exit(3);
  const token = JSON.parse(loginBody).token;

  // logout
  const logoutRes = await fetch(`${base}/api/logout`, { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
  console.log('logout status', logoutRes.status);
  console.log('logout body', await logoutRes.text());

  // protected POST after logout
  const postRes = await fetch(`${base}/api/animals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ name: 'AfterLogout' }),
  });
  console.log('post after logout', postRes.status, await postRes.text());

  process.exit(0);
}

run();
