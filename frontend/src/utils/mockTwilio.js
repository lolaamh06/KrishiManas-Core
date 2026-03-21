/**
 * Mock Twilio SMS integration for KrishiManas.
 * In demo mode, logs the SMS to console instead of sending.
 * When VITE_API_URL backend is available and Twilio keys are set, this will call /api/send-sms instead.
 */

export async function sendSMS({ to = '+91XXXXXXXXXX', message, farmerName = 'Farmer' }) {
  // Try real backend first (Twilio is configured server-side)
  try {
    const res = await fetch(import.meta.env.VITE_API_URL + '/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message, farmerName }),
    });
    if (res.ok) {
      console.log('[Twilio] SMS sent via backend');
      return { success: true, via: 'backend' };
    }
  } catch {
    // Backend unavailable — use mock
  }

  // Mock: simulate a Twilio SID and log the message
  const mockSid = 'SM' + Math.random().toString(36).substring(2, 18).toUpperCase();
  console.log(`[Mock Twilio] SMS to ${to}`);
  console.log(`[Mock Twilio] Message: ${message}`);
  console.log(`[Mock Twilio] SID: ${mockSid}`);

  return {
    success: true,
    via: 'mock',
    sid: mockSid,
    preview: message.substring(0, 60) + '...',
  };
}

/**
 * Pre-built Twilio message templates
 */
export const SMS_TEMPLATES = {
  distressAlert: (farmerName, score, taluk) =>
    `[KrishiManas] ALERT: ${farmerName} in ${taluk} taluk has a distress score of ${score}/100. Immediate intervention required. Log in to your Mitra portal.`,

  schemeReminder: (farmerName, schemeName, deadline) =>
    `[KrishiManas] Reminder: ${farmerName}, your ${schemeName} application deadline is in ${deadline}. Please upload your documents or contact your Mitra.`,

  mitraAssigned: (farmerName, mitraName) =>
    `[KrishiManas] Your Krishi Mitra ${mitraName} has been assigned to your case. They will contact you within 24 hours.`,

  checkinReminder: (farmerName) =>
    `[KrishiManas] Hello ${farmerName}, 14 days have passed since your last check-in. Please visit your dashboard or tap: https://krishimanas.app/checkin`,
};
