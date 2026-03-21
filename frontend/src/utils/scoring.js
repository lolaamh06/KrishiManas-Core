export function calculateDistressScore(farmer) {
  let score = 0;

  if (farmer.scoreOffset) score += farmer.scoreOffset;

  if (farmer.selfCheckin === 'Bad') score += 30;
  else if (farmer.selfCheckin === 'Okay') score += 15;

  if (farmer.cropOutcome === 'Failed') score += 25;
  else if (farmer.cropOutcome === 'Partial') score += 12;

  if (farmer.loanDaysOverdue > 45) score += 25;
  else if (farmer.loanDaysOverdue > 0 && farmer.loanDaysOverdue <= 45) score += 15;

  if (farmer.marketActivity === 'Inactive') score += 20;
  else if (farmer.marketActivity === 'Low') score += 10;

  if (farmer.weatherShock) score += 10;

  return Math.min(Math.max(score, 0), 100);
}

export function getDistressStatus(score) {
  if (score >= 65) return 'Red';
  if (score >= 35) return 'Yellow';
  return 'Green';
}

export function calculateTrajectory(scores) {
  if (!scores || scores.length < 2) return 'Stable';
  const lastScore = scores[scores.length - 1];
  const previousScore = scores[scores.length - 2];
  
  if (lastScore > previousScore) return 'Worsening';
  if (lastScore < previousScore) return 'Improving';
  return 'Stable';
}

export function shouldShowCheckin(lastCheckinDate) {
  if (!lastCheckinDate) return true;
  const lastDate = new Date(lastCheckinDate);
  const now = new Date();
  const diffTime = Math.abs(now - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays >= 14;
}
