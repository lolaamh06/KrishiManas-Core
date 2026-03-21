const farmers = [
  {
    id: "f1", name: "Ramesh Kumar", taluk: "Alur", village: "Alur HQ", crop: "Paddy", 
    cropOutcome: "Failed", loanDaysOverdue: 60, marketActivity: "Inactive", 
    scoreOffset: 8, score: 78, status: "Red", lat: 12.9691, lng: 76.0450,
    lastCheckinDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    history: [40, 50, 78], trajectory: "Worsening"
  },
  {
    id: "f2", name: "Kavitha Reddy", taluk: "Arsikere", village: "Arsikere HQ", crop: "Sugarcane", 
    cropOutcome: "Failed", loanDaysOverdue: 45, marketActivity: "Inactive", 
    scoreOffset: 22, score: 82, status: "Red", lat: 13.3150, lng: 76.2580,
    lastCheckinDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    history: [60, 75, 82], trajectory: "Worsening"
  },
  {
    id: "f3", name: "Prakash N", taluk: "Hassan", village: "Hassan HQ", crop: "Maize", 
    cropOutcome: "Partial", loanDaysOverdue: 0, marketActivity: "Low", selfCheckin: "Bad",
    scoreOffset: 0, score: 52, status: "Yellow", lat: 13.0068, lng: 76.1004,
    lastCheckinDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    history: [50, 52], trajectory: "Stable"
  },
  {
    id: "f4", name: "Manjunath S", taluk: "Sakleshpur", village: "Sakleshpur HQ", crop: "Coffee", 
    cropOutcome: "Partial", loanDaysOverdue: 0, marketActivity: "Active", selfCheckin: "Bad",
    scoreOffset: 3, score: 45, status: "Yellow", lat: 12.9630, lng: 75.7860,
    lastCheckinDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    history: [45, 45], trajectory: "Stable"
  },
  {
    id: "f5", name: "Suresh Gowda", taluk: "Belur", village: "Belur HQ", crop: "Ragi", 
    cropOutcome: "Good", loanDaysOverdue: 0, marketActivity: "Active", 
    scoreOffset: 18, score: 18, status: "Green", lat: 13.1610, lng: 75.8580,
    lastCheckinDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    history: [18], trajectory: "Stable"
  }
];

const schemes = [
  {
    id: "s1", name: "PM Fasal Bima Yojana", benefit: "₹2 lakh crop insurance", deadline: "March 31 2026",
    eligibleIf: "Crop failed or partial",
    documents: ["Aadhaar", "Land Records", "Bank Passbook"]
  },
  {
    id: "s2", name: "PM-Kisan Samman Nidhi", benefit: "₹6,000/year", deadline: "No deadline",
    eligibleIf: "Land size 5 acres or less",
    documents: ["Aadhaar", "RTC", "Bank account"]
  },
  {
    id: "s3", name: "Karnataka Raitha Siri", benefit: "₹10,000/hectare", deadline: "April 15 2026",
    eligibleIf: "Crop failed in Karnataka",
    documents: ["Crop Loss Certificate", "Aadhaar"]
  },
  {
    id: "s4", name: "Kisan Credit Card", benefit: "₹3 lakh at 4% interest", deadline: "No deadline",
    eligibleIf: "Any loan status",
    documents: ["Bank Application", "Aadhaar", "Photo"]
  }
];

const mitras = [
  { id: "m1", name: "Suresh Naik", village: "Alur HQ", points: 340, rank: 1, assigned: ["Alur"] },
  { id: "m2", name: "Ravi Kumar", village: "Hassan HQ", points: 280, rank: 2, assigned: ["Hassan", "Channarayapatna"] }
];

const statsData = {
  seasonComparison: [
    { taluk: "Hassan", lastSeason: 31, thisSeason: 42, change: "+35%" },
    { taluk: "Alur", lastSeason: 44, thisSeason: 71, change: "+61%" },
    { taluk: "Sakleshpur", lastSeason: 29, thisSeason: 38, change: "+31%" },
    { taluk: "Arsikere", lastSeason: 51, thisSeason: 68, change: "+33%" },
    { taluk: "Belur", lastSeason: 22, thisSeason: 29, change: "+32%" },
    { taluk: "Channarayapatna", lastSeason: 40, thisSeason: 55, change: "+38%" }
  ]
};

let alerts = [];
let documentRequests = [];
let caseHistory = {}; // Keyed by farmerId

module.exports = { farmers, schemes, mitras, statsData, alerts, documentRequests, caseHistory };
