const { calculateDistressScore, getDistressStatus, calculateTrajectory, shouldShowCheckin } = require('./utils/scoring');

const seededFarmers = [
  {
    name: "Ramesh Kumar",
    cropOutcome: "Failed",
    loanDaysOverdue: 60,
    marketActivity: "Inactive",
    scoreOffset: 8, // 25 + 25 + 20 + 8 = 78
  },
  {
    name: "Kavitha Reddy",
    cropOutcome: "Failed",
    loanDaysOverdue: 45, // 45 or less: +15
    marketActivity: "Inactive",
    scoreOffset: 22, // 25 + 15 + 20 + 22 = 82
  },
  {
    name: "Prakash N",
    cropOutcome: "Partial",
    marketActivity: "Low",
    selfCheckin: "Bad", // 12 + 10 + 30 = 52
    loanDaysOverdue: 0,
    scoreOffset: 0
  },
  {
    name: "Manjunath S",
    cropOutcome: "Partial", // 12
    marketActivity: "Active",
    selfCheckin: "Bad", // 30
    scoreOffset: 3, // 12 + 30 + 3 = 45
    loanDaysOverdue: 0
  },
  {
    name: "Suresh Gowda",
    cropOutcome: "Good",
    marketActivity: "Active",
    loanDaysOverdue: 0,
    scoreOffset: 18 
  }
];

console.log("--- DISTRESS SCORING ENGINE TEST ---");
let totalPassed = 0;
const expectedScores = {
  "Ramesh Kumar": 78,
  "Kavitha Reddy": 82,
  "Prakash N": 52,
  "Manjunath S": 45,
  "Suresh Gowda": 18
};

seededFarmers.forEach(f => {
  const score = calculateDistressScore(f);
  const status = getDistressStatus(score);
  const expected = expectedScores[f.name];
  const passed = score === expected;
  console.log(`${f.name} => Score: ${score} [${status}] ${passed ? '✅' : '❌ Expected ' + expected}`);
  if (passed) totalPassed++;
});

console.log("--- TRAJECTORY TEST ---");
const worsening = calculateTrajectory([40, 50]) === 'Worsening';
const improving = calculateTrajectory([60, 45]) === 'Improving';
const stable = calculateTrajectory([50, 50]) === 'Stable';
console.log(`Worsening: ${worsening ? '✅' : '❌'}`);
console.log(`Improving: ${improving ? '✅' : '❌'}`);
console.log(`Stable: ${stable ? '✅' : '❌'}`);

console.log("--- CHECKIN DATE TEST ---");
const d = new Date();
d.setDate(d.getDate() - 15);
const needsCheckin = shouldShowCheckin(d.toISOString()) === true;
const recentDate = new Date();
recentDate.setDate(recentDate.getDate() - 2);
const doesntNeedCheckin = shouldShowCheckin(recentDate.toISOString()) === false;
console.log(`15 Days Ago (True): ${needsCheckin ? '✅' : '❌'}`);
console.log(`2 Days Ago (False): ${doesntNeedCheckin ? '✅' : '❌'}`);

if (totalPassed === 5 && worsening && improving && stable && needsCheckin && doesntNeedCheckin) {
  console.log('\nSUCCESS: All seeded farmers correct & helpers work!');
} else {
  console.log('\nFAILURE: Tests did not pass.');
}
