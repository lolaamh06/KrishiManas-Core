function calculateDistressScore(farmer) {
  let score = 0;

  // Base score or offset to hit exact demo numbers
  if (farmer.scoreOffset) {
    score += farmer.scoreOffset;
  }

  // Self check-in
  if (farmer.selfCheckin === 'Bad') score += 30;
  else if (farmer.selfCheckin === 'Okay') score += 15;
  // Good = 0

  // Crop outcome
  if (farmer.cropOutcome === 'Failed') score += 25;
  else if (farmer.cropOutcome === 'Partial') score += 12;

  // Loan status
  if (farmer.loanDaysOverdue > 45) {
      score += 25;
  } else if (farmer.loanDaysOverdue > 0 && farmer.loanDaysOverdue <= 45) {
      score += 15;
  }

  // Market activity
  if (farmer.marketActivity === 'Inactive') score += 20;
  else if (farmer.marketActivity === 'Low') score += 10;

  // Weather shock
  if (farmer.weatherShock) score += 10;

  return Math.min(Math.max(score, 0), 100);
}

function getDistressStatus(score) {
  if (score >= 65) return 'Red';
  if (score >= 35) return 'Yellow';
  return 'Green';
}

function calculateTrajectory(scores) {
  // scores should be array of previous scores, e.g. [45, 52] (oldest to newest)
  if (!scores || scores.length < 2) return 'Stable';
  const lastScore = scores[scores.length - 1];
  const previousScore = scores[scores.length - 2];
  
  if (lastScore > previousScore) return 'Worsening';
  if (lastScore < previousScore) return 'Improving';
  return 'Stable';
}

function shouldShowCheckin(lastCheckinDate) {
  if (!lastCheckinDate) return true;
  const lastDate = new Date(lastCheckinDate);
  const now = new Date();
  const diffTime = Math.abs(now - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays >= 14;
}

module.exports = {
  calculateDistressScore,
  getDistressStatus,
  calculateTrajectory,
  shouldShowCheckin
};
