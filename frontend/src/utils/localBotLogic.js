/**
 * Layer 1: Primary Response Layer (Local / Rule-Based)
 * Provides instant responses for predictable, structured questions.
 * Handles: Visitor, Farmer, Mitra, Admin.
 */

export const getLocalResponse = (query, userData) => {
  const q = query.toLowerCase();
  const role = (userData.roles && userData.roles.includes('admin')) ? 'admin' : 
               (userData.roles && userData.roles.includes('mitra')) ? 'mitra' : 
               (userData.roles && userData.roles.includes('farmer')) ? 'farmer' : 'visitor';
  
  // --- 1. GENERAL / VISITOR LOGIC ---
  if (role === 'visitor') {
    if (q.includes('registration') || q.includes('join') || q.includes('onboard')) {
      return "Welcome to KrishiManas! You can register as a Farmer to get personalized support, or join as a Mitra to help your community. Click the icons on our dashboard to start.";
    }
    if (q.includes('what') && q.includes('this')) {
      return "KrishiManas is a regional support platform combining financial data and mental health resources to help farmers stay resilient. We use real-time monitoring to provide early intervention.";
    }
  }

  // --- 2. FARMER LOGIC ---
  if (role === 'farmer') {
    if (q.includes('score') || q.includes('status') || q.includes('points')) {
        const score = userData.score || 50;
        const zone = score >= 65 ? 'Urgent' : (score >= 35 ? 'Watch' : 'Safe');
        return `Your current distress score is **${score}** (${zone} zone). Your trajectory is ${userData.trajectory || 'Stable'}.`;
    }
    if (q.includes('loan') || q.includes('money')) {
        return `You have a loan status recorded in the **${userData.taluk}** sector. Please check your dashboard for details on overdue days and repayment status.`;
    }
  }

  // --- 3. MITRA / ADMIN LOGIC ---
  if (role === 'admin' || role === 'mitra') {
    if (q.includes('case') || q.includes('farmer') || q.includes('active')) {
      return "You can view all active and priority cases in your dashboard queue. Red markers on the map indicate entities requiring immediate intervention.";
    }
    if (q.includes('sos') || q.includes('emergency')) {
      return "Incoming SOS signals are broadcasted to all active Mitras in the sector. You can 'Intercept' a case directly from the dashboard overlay.";
    }
  }

  // --- 4. SHARED LOGIC ---
  if (q.includes('hi') || q.includes('hello') || q.includes('namaste')) {
    return `Namaste ${userData.name || 'friend'}! I am here to help you navigate the KrishiManas system as a ${role}. What's on your mind?`;
  }

  return null; // Move to Next Layer (Gemini AI)
};
