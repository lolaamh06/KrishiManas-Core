/**
 * Livelihood Vulnerability Index (LVI) Framework Algorithm
 * Calculates an integrated agricultural distress score (0-100).
 * Pillars: Financial Risk (45%), Production Shock (35%), Market Isolation (20%).
 */
export function calculateDistressScore(farmer) {
  // Normalize Inputs
  const loanDays = Number(farmer.loanDaysOverdue) || 0;
  const landAcres = Number(farmer.landSize) || 2.5; // Default to average if unknown
  const cropOutcome = farmer.cropOutcome || 'Good';
  const marketActivity = farmer.marketActivity || 'Active';

  // Pillar 1: Financial Risk (Scale 0-1) - Weight 0.45
  let financialScore = 0.2; // Baseline 0-30 days
  if (loanDays > 90) financialScore = 1.0;
  else if (loanDays > 30) financialScore = 0.6;

  // Pillar 2: Production Shock (Scale 0-1) - Weight 0.35
  let productionScore = 0;
  if (cropOutcome === 'Failed') productionScore = 1.0;
  else if (cropOutcome === 'Partial') productionScore = 0.5;

  // Apply Smallholder Vulnerability Penalty
  if (landAcres < 2.0) {
    productionScore = Math.min(1.0, productionScore * 1.25);
  }

  // Pillar 3: Market Isolation (Scale 0-1) - Weight 0.20
  let marketScore = 0;
  if (marketActivity === 'Inactive') marketScore = 1.0;
  else if (marketActivity === 'Low') marketScore = 0.5;

  // Calculate Weighted Baseline Score
  let rawScore = (financialScore * 0.45) + (productionScore * 0.35) + (marketScore * 0.20);

  // Compound Risk Multiplier (Debt Trap Detection)
  if (financialScore > 0.6 && productionScore > 0.5) {
    rawScore = Math.min(1.0, rawScore * 1.2);
  }

  // Convert to 0-100 scale and apply legacy manual overrides if present
  let finalScore = Math.round(rawScore * 100);
  if (farmer.scoreOffset) finalScore += farmer.scoreOffset;

  return Math.min(Math.max(finalScore, 0), 100);
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
