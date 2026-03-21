require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { calculateDistressScore, getDistressStatus, calculateTrajectory } = require('./utils/scoring');
const { farmers, schemes, mitras, statsData, alerts, documentRequests, caseHistory } = require('./data');
const { db, isFirebaseReady } = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

function matchSchemes(farmer) {
  const matches = [];
  schemes.forEach(s => {
    let eligible = false;
    let r = '', rk = '';
    if (s.name === 'PM Fasal Bima Yojana' && (farmer.cropOutcome === 'Failed' || farmer.cropOutcome === 'Partial')) {
      eligible = true; r = 'Your crop outcome was reported as ' + farmer.cropOutcome; rk = 'ನಿಮ್ಮ ಬೆಳೆ ಹಾಳಾಗಿದೆ ಎಂದು ವರದಿಯಾಗಿದೆ';
    } else if (s.name === 'PM-Kisan Samman Nidhi' && farmer.landSize <= 5) {
      eligible = true; r = 'You have 5 acres or less of land'; rk = 'ನಿಮ್ಮ ಬಳಿ 5 ಎಕರೆ ಮಾತ್ರ ಇದೆ';
    } else if (s.name === 'Karnataka Raitha Siri' && farmer.cropOutcome === 'Failed') {
      eligible = true; r = 'You reported crop failure'; rk = 'ಬೆಳೆ ಹಾನಿ ವರದಿಯಾಗಿದೆ';
    } else if (s.name === 'Kisan Credit Card') {
      eligible = true; r = 'All farmers eligible'; rk = 'ಎಲ್ಲರೈತರು ಅರ್ಹರು';
    }
    if (eligible) matches.push({ ...s, eligibilityReason: r, eligibilityReasonKannada: rk });
  });
  return matches;
}

app.get('/api/farmers', async (req, res) => {
  if (isFirebaseReady) {
    const snap = await db.collection('farmers').get();
    return res.json(snap.docs.map(d => d.data()));
  }
  res.json(farmers);
});

app.post('/api/farmers', async (req, res) => {
  const newFarmer = { ...req.body, id: 'f_' + Date.now() };
  const score = calculateDistressScore(newFarmer);
  newFarmer.score = score;
  newFarmer.status = getDistressStatus(score);
  newFarmer.history = [score];
  newFarmer.trajectory = 'Stable';
  newFarmer.lastCheckinDate = new Date().toISOString();
  
  const matchedSchemes = matchSchemes(newFarmer);
  
  let mList = mitras;
  if (isFirebaseReady) {
    const s = await db.collection('mitras').get();
    mList = s.docs.map(d => d.data());
    await db.collection('farmers').doc(newFarmer.id).set(newFarmer);
    if (score >= 65) await db.collection('alerts').add({ type: 'RED_ZONE', farmerId: newFarmer.id, timestamp: new Date().toISOString() });
  } else {
    farmers.push(newFarmer);
    if (score >= 65) alerts.push({ id: 'a_' + Date.now(), type: 'RED_ZONE', farmerId: newFarmer.id, timestamp: new Date().toISOString() });
  }

  const assignedMitra = mList.find(m => m.assigned.includes(newFarmer.taluk)) || mList[0];
  res.json({ farmer: newFarmer, score, status: newFarmer.status, schemes: matchedSchemes, mitra: assignedMitra });
});

app.post('/api/farmers/:id/checkin', async (req, res) => {
  let farmer;
  if (isFirebaseReady) {
    const doc = await db.collection('farmers').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    farmer = doc.data();
  } else {
    farmer = farmers.find(f => f.id === req.params.id);
    if (!farmer) return res.status(404).json({ error: 'Not found' });
  }

  farmer.selfCheckin = req.body.checkin;
  const newScore = calculateDistressScore(farmer);
  farmer.history.push(newScore);
  farmer.score = newScore;
  farmer.status = getDistressStatus(newScore);
  farmer.trajectory = calculateTrajectory(farmer.history);
  farmer.lastCheckinDate = new Date().toISOString();

  if (isFirebaseReady) {
    await db.collection('farmers').doc(farmer.id).set(farmer);
    if (newScore >= 65) await db.collection('alerts').add({ type: 'THRESHOLD_CROSSED', farmerId: farmer.id, timestamp: new Date().toISOString() });
  } else {
    if (newScore >= 65) alerts.push({ id: 'a_' + Date.now(), type: 'THRESHOLD_CROSSED', farmerId: farmer.id, timestamp: new Date().toISOString() });
  }
  res.json({ success: true, farmer });
});

app.get('/api/stats', async (req, res) => {
  if (isFirebaseReady) {
    const snap = await db.collection('farmers').where('score', '>=', 65).get();
    const sf = await db.collection('farmers').get();
    const st = await db.collection('stats').doc('current').get();
    const al = await db.collection('alerts').get();
    return res.json({
      totalFarmers: sf.size, redZoneCount: snap.size, schemesDispatchedToday: 12, alertsToday: al.size,
      seasonComparison: st.exists ? st.data().seasonComparison : []
    });
  }
  res.json({ totalFarmers: farmers.length, redZoneCount: farmers.filter(f => f.score >= 65).length, schemesDispatchedToday: 12, alertsToday: alerts.length, seasonComparison: statsData.seasonComparison });
});

app.post('/api/mitras/action', async (req, res) => {
  const { mitraId, farmerId, action, note, points } = req.body;
  if (isFirebaseReady) {
    const mRef = db.collection('mitras').doc(mitraId);
    if (points) await mRef.update({ points: admin.firestore.FieldValue.increment(points) });
    await db.collection('caseHistory').add({ farmerId, action, note, points, timestamp: new Date().toISOString() });
    const m = await mRef.get();
    return res.json({ success: true, newPoints: m.data().points });
  }
  const m = mitras.find(x => x.id === mitraId);
  if (m && points) m.points += points;
  res.json({ success: true, newPoints: m ? m.points : 0 });
});

// Other routes...
app.post('/api/alerts/demo', async (req, res) => {
  if (isFirebaseReady) {
    const r = await db.collection('alerts').add({ type: 'DEMO_TRIGGERED', farmerId: 'f1', timestamp: new Date().toISOString() });
    return res.json({ success: true, alertId: r.id });
  }
  res.json({ success: true, alertId: 'a_demo_f' });
});

app.get('/', (req, res) => res.send('KrishiManas API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
