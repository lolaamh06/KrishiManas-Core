/**
 * Layer 3: Fallback Layer (Critical Reliability Requirement)
 * Gracefully switches to structured templates if AI fails.
 */

export const getFallbackResponse = (query, farmerData) => {
  const score = farmerData.score || 50;
  const crop = farmerData.crop || 'crops';
  const name = farmerData.name || 'Farmer';

  const templates = [
    `I'm currently working with limited connectivity, but looking at your ${crop} cultivation in ${farmerData.taluk}, I suggest reviewing the latest weather advisories. Your current score is ${score}.`,
    `Namaste ${name}, I am having trouble connecting to my AI core, but I can see you're an active part of the ${farmerData.taluk} sector. If you need immediate help, please use the SOS button.`,
    `I've noted your message about "${query}". While I wait for a full sync, I recommend checking your matched schemes for new financial support options.`,
    `Connectivity is currently low, but based on your profile, your assigned Mitra (${farmerData.assignedMitraName || 'Regional HQ'}) is the best person to guide you on this specific query right now.`
  ];

  // Pick a random template to avoid sounding robotic
  return templates[Math.floor(Math.random() * templates.length)];
};
