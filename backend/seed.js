const { db, isFirebaseReady } = require('./firebase');
const { farmers, schemes, mitras, statsData } = require('./data');

async function seedDatabase() {
  if (!isFirebaseReady || !db) {
    console.log('Firebase not ready. Skipping seed.');
    return;
  }

  try {
    const farmersSnap = await db.collection('farmers').limit(1).get();
    if (!farmersSnap.empty) {
      console.log('Database already seeded. Skipping.');
      return;
    }

    console.log('Seeding farmers...');
    for (const f of farmers) {
      await db.collection('farmers').doc(f.id).set(f);
    }
    console.log('Seeding schemes...');
    for (const s of schemes) {
      await db.collection('schemes').doc(s.id).set(s);
    }
    console.log('Seeding mitras...');
    for (const m of mitras) {
      await db.collection('mitras').doc(m.id).set(m);
    }
    console.log('Seeding stats...');
    await db.collection('stats').doc('current').set(statsData);

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
