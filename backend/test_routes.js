const http = require('http');

function testGet(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
  });
}

function testPost(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, res => {
      let result = '';
      res.on('data', chunk => result += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(result) }));
    });
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log("Testing POST /api/farmers (Onboarding)...");
  const onbRes = await testPost('/api/farmers', {
    name: "Test Farmer", taluk: "Alur", cropOutcome: "Failed", loanDaysOverdue: 50, marketActivity: "Inactive", selfCheckin: "Bad"
  });
  console.log(`Status: ${onbRes.status}. Farmer Score: ${onbRes.data.score}, Status: ${onbRes.data.status}`);
  if (onbRes.status !== 200 || !onbRes.data.score) throw new Error("Onboarding failed");

  console.log("\nTesting GET /api/farmers...");
  const getF = await testGet('/api/farmers');
  console.log(`Status: ${getF.status}. Total farmers: ${getF.data.length}`);
  if (getF.status !== 200 || getF.data.length < 6) throw new Error("Get farmers failed");

  console.log("\nTesting GET /api/stats...");
  const statsRes = await testGet('/api/stats');
  console.log(`Status: ${statsRes.status}. Stats:`, statsRes.data);
  if (statsRes.status !== 200) throw new Error("Stats failed");

  console.log("\nTesting GET /api/mitras/m1/farmers...");
  const mitraF = await testGet('/api/mitras/m1/farmers');
  console.log(`Status: ${mitraF.status}. Flagged farmers for m1: ${mitraF.data.length}`);
  if (mitraF.status !== 200) throw new Error("Mitra farmers failed");

  console.log("\nTesting POST /api/mitras/action...");
  const actRes = await testPost('/api/mitras/action', {
    mitraId: 'm1', farmerId: 'f1', action: 'Call', note: 'Checked in', points: 25
  });
  console.log(`Status: ${actRes.status}. New points: ${actRes.data.newPoints}`);
  if (actRes.status !== 200) throw new Error("Action failed");

  console.log("\nTesting POST /api/alerts/demo...");
  const dAlert = await testPost('/api/alerts/demo', {});
  console.log(`Status: ${dAlert.status}. Alert ID: ${dAlert.data.alertId}`);
  if (dAlert.status !== 200) throw new Error("Demo alert failed");

  console.log("\nTesting GET /api/alerts...");
  const alertsGet = await testGet('/api/alerts');
  console.log(`Status: ${alertsGet.status}. Alerts generated: ${alertsGet.data.length}`);

  console.log("\nSUCCESS: All endpoints responded correctly with valid JSON and ZERO crashes.");
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});
