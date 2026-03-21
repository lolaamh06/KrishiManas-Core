/**
 * District-Aware AI Scheme Matcher for KrishiManas.
 * Simulates a localized intelligence layer for Hassan District.
 */

export const SCHEME_CATEGORIES = {
  EMERGENCY: 'EMERGENCY_AID',
  PREVENTATIVE: 'PREVENTATIVE_CARE',
  GROWTH: 'GROWTH_INCENTIVES'
};

const ALL_SCHEMES = [
  // --- EMERGENCY AID (Red Zone) ---
  {
    id: 'sch_parihara', name: 'Parihara (Crop Disaster Relief)', zone: ['Red'], category: SCHEME_CATEGORIES.EMERGENCY,
    benefit: 'Immediate ₹8,000–₹25,000 relief fund',
    eligibilityReason: 'Critical distress score ≥ 65 with crop failure',
    documents: ['Aadhaar', 'RTC / Pahani', 'Bank Passbook'], deadline: '7 Days',
  },
  {
    id: 'sch_coffee_board_relief', name: 'Coffee Board Rainfall Compensation', zone: ['Red', 'Yellow'], cropTarget: ['Coffee'], category: SCHEME_CATEGORIES.EMERGENCY,
    benefit: 'Per-hectare compensation for blossom shower failure',
    eligibilityReason: 'Coffee plantation damage due to erratic rainfall in Malnad region',
    documents: ['Coffee Board Registration', 'Damage Photos'], deadline: '15 Days',
  },
  {
    id: 'sch_pepper_revital', name: 'Spices Board Quick-Wilt Aid', zone: ['Red'], cropTarget: ['Pepper'], category: SCHEME_CATEGORIES.EMERGENCY,
    benefit: '100% subsidy on bio-fungicides and replanting material',
    eligibilityReason: 'Severe Quick-Wilt disease outbreak detected in vines',
    documents: ['RTC', 'Spices Board ID'], deadline: '10 Days',
  },

  // --- PREVENTATIVE CARE (Yellow Zone) ---
  {
    id: 'sch_krishi_bhagya', name: 'Krishi Bhagya Scheme', zone: ['Red', 'Yellow'], category: SCHEME_CATEGORIES.PREVENTATIVE,
    benefit: '₹5,000 input subsidy for farm ponds and polyhouses',
    eligibilityReason: 'Preventive infrastructural subsidy to avoid escalation',
    documents: ['Aadhaar', 'Loan Statement'], deadline: '21 Days',
  },
  {
    id: 'sch_ginger_rot_prevent', name: 'Ginger Soft-Rot Prevention Drive', zone: ['Yellow'], cropTarget: ['Ginger'], category: SCHEME_CATEGORIES.PREVENTATIVE,
    benefit: 'Subsidised Trichoderma and processing yard setup',
    eligibilityReason: 'High moisture risk detection in primary ginger belts',
    documents: ['Aadhaar', 'RTC'], deadline: '30 Days',
  },
  {
    id: 'sch_pmfby', name: 'PMFBY Crop Insurance', zone: ['Yellow', 'Green'], category: SCHEME_CATEGORIES.PREVENTATIVE,
    benefit: 'Crop insurance premium allocation',
    eligibilityReason: 'Active cultivation record with volatile market crop',
    documents: ['RTC / Pahani', 'Bank Passbook'], deadline: '30 Days',
  },

  // --- GROWTH INCENTIVES (Green Zone) ---
  {
    id: 'sch_soil_health', name: 'Soil Health Card Scheme', zone: ['Green'], category: SCHEME_CATEGORIES.GROWTH,
    benefit: 'Free soil testing and personalised nutrient plan',
    eligibilityReason: 'Active cultivation — preventive soil health analysis',
    documents: ['Aadhaar', 'Land Records'], deadline: 'No deadline',
  },
  {
    id: 'sch_coffee_mech', name: 'Coffee Mechanization Subsidy', zone: ['Green'], cropTarget: ['Coffee'], category: SCHEME_CATEGORIES.GROWTH,
    benefit: '40% subsidy on eco-pulpers and pruning machinery',
    eligibilityReason: 'Stable farmer seeking yield and labor optimization',
    documents: ['Quote for Machinery', 'Coffee Board ID'], deadline: 'Ongoing',
  },
  {
    id: 'sch_pm_kisan', name: 'PM-KISAN', zone: ['Green', 'Yellow'], category: SCHEME_CATEGORIES.GROWTH,
    benefit: '₹6,000 per year direct income support',
    eligibilityReason: 'Smallholder farmer with < 5 acres landholding',
    documents: ['Aadhaar', 'Land Records', 'Bank Passbook'], deadline: 'Ongoing',
  },
];

/**
 * Simulates District-Aware AI scheme recommendation.
 * Requires farmerData Object containing score, crop, taluk, etc.
 */
export function matchSchemes(farmerData) {
  const { score = 50, crop = 'Paddy', taluk = 'Hassan', loanDaysOverdue = 0 } = farmerData;
  
  // 1. Determine Zone
  const zone = score >= 65 ? 'Red' : score >= 35 ? 'Yellow' : 'Green';
  
  // 2. Filter Schemes by Zone & Crop Context
  const matches = ALL_SCHEMES.filter(s => {
    // Must match the distress zone
    const zoneMatch = s.zone.includes(zone);
    // If scheme has a specific crop target, farmer must grow it. Otherwise, it's a general scheme.
    const cropMatch = s.cropTarget ? s.cropTarget.includes(crop) : true;
    return zoneMatch && cropMatch;
  });

  // 3. Categorize Matches
  const categorized = {
    [SCHEME_CATEGORIES.EMERGENCY]: matches.filter(m => m.category === SCHEME_CATEGORIES.EMERGENCY),
    [SCHEME_CATEGORIES.PREVENTATIVE]: matches.filter(m => m.category === SCHEME_CATEGORIES.PREVENTATIVE),
    [SCHEME_CATEGORIES.GROWTH]: matches.filter(m => m.category === SCHEME_CATEGORIES.GROWTH),
  };

  // 4. Generate Spatial AI Summary
  const isHorticulture = ['Coffee', 'Pepper', 'Ginger'].includes(crop);
  const regionContext = isHorticulture ? `Horticulture belt (${taluk})` : `Standard agriculture sector (${taluk})`;
  const loanFlag = loanDaysOverdue > 30 ? `Critical debt exposure (${loanDaysOverdue} days overdue).` : 'Debt within acceptable thresholds.';
  
  const aiSummary = `Distress Index indicates ${zone} Phase. ${regionContext} analysis detects ${crop} cultivation. ${loanFlag} System has isolated ${matches.length} highly-targeted interventions.`;

  return { 
    zone, 
    schemes: matches, 
    categorized,
    aiSummary 
  };
}
