import { db, fb, collection, addDoc, serverTimestamp } from './frontend/src/utils/firebase.js';

async function triggerSOS() {
  const farmerId = 'MOCK_FARMER_123';
  const farmerName = 'Test Farmer';
  
  console.log('Triggering SOS for:', farmerName);
  
  const alertRef = await addDoc(collection(db, 'alerts'), {
    type: 'SOS',
    farmerId: farmerId,
    farmerName: farmerName,
    location: 'Test Sector',
    lat: 13,
    lng: 76,
    distressScore: 85,
    timestamp: serverTimestamp(),
    isClaimed: false,
    claimedBy: null,
    message: `${farmerName} is requesting immediate assistance (TEST).`
  });
  
  console.log('SOS Triggered. Alert ID:', alertRef.id);
  process.exit(0);
}

triggerSOS().catch(console.error);
