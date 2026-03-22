export const NEWS = [
  {
    id: 'n1',
    slug: 'pmfby-claims-hassan-tumkur',
    category: 'Insurance',
    categoryKannada: 'ವಿಮೆ',
    categoryColor: '#E74C3C',
    date: 'March 18, 2026',
    dateKannada: 'ಮಾರ್ಚ್ 18, 2026',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop',
    imageAlt: 'Paddy fields after rain in Karnataka',
    title: 'PMFBY Claims Surge in Hassan and Tumkur After Unseasonal Rain',
    titleKannada: 'ಅಕಾಲಿಕ ಮಳೆ ನಂತರ ಹಾಸನ ಮತ್ತು ತುಮಕೂರಿನಲ್ಲಿ PMFBY ಕ್ಲೇಮ್ ಹೆಚ್ಚಳ',
    summary: 'Over 48,000 farmers in Hassan and Tumkur districts have filed crop insurance claims under PMFBY after 48mm of unseasonal rainfall destroyed standing paddy and ragi crops in the first two weeks of March.',
    summaryKannada: 'ಮಾರ್ಚ್ ತಿಂಗಳ ಮೊದಲ ಎರಡು ವಾರಗಳಲ್ಲಿ 48mm ಅಕಾಲಿಕ ಮಳೆಯಿಂದ ಭತ್ತ ಮತ್ತು ರಾಗಿ ಬೆಳೆ ನಾಶವಾದ ನಂತರ ಹಾಸನ ಮತ್ತು ತುಮಕೂರು ಜಿಲ್ಲೆಗಳಲ್ಲಿ 48,000 ಕ್ಕಿಂತ ಹೆಚ್ಚು ರೈತರು PMFBY ಅಡಿಯಲ್ಲಿ ಬೆಳೆ ವಿಮೆ ಕ್ಲೇಮ್ ಸಲ್ಲಿಸಿದ್ದಾರೆ.',
    content: `The state government has directed district agriculture officers to expedite claim processing under PMFBY following unprecedented crop losses across Hassan and Tumkur districts.

The 48mm rainfall recorded between March 8-14 was 340% above the seasonal average, causing widespread damage to paddy at the grain-filling stage.

The agriculture department has deployed 120 field officers across affected taluks to conduct crop loss surveys. Hassan district alone accounts for 31,200 of the total claims filed.

Farmers in Alur, Arsikere, and Channarayapatna taluks are the worst affected, with crop loss estimates ranging from 40% to 85% of the standing crop.

The last date for filing PMFBY claims has been extended to March 31, 2026. Farmers are advised to visit their nearest Common Service Centre with Aadhaar, land records, and crop loss photographs.`,
    contentKannada: `ಹಾಸನ ಮತ್ತು ತುಮಕೂರು ಜಿಲ್ಲೆಗಳಲ್ಲಿ ವ್ಯಾಪಕ ಬೆಳೆ ನಷ್ಟದ ನಂತರ ರಾಜ್ಯ ಸರ್ಕಾರವು ಜಿಲ್ಲಾ ಕೃಷಿ ಅಧಿಕಾರಿಗಳಿಗೆ PMFBY ಅಡಿಯಲ್ಲಿ ಕ್ಲೇಮ್ ಪ್ರಕ್ರಿಯೆಯನ್ನು ತ್ವರಿತಗೊಳಿಸಲು ನಿರ್ದೇಶನ ನೀಡಿದೆ.

ಮಾರ್ಚ್ 8-14 ರ ನಡುವೆ ದಾಖಲಾದ 48mm ಮಳೆಯು ಋತುಮಾನದ ಸರಾಸರಿಗಿಂತ 340% ಹೆಚ್ಚಾಗಿದ್ದು, ಧಾನ್ಯ ತುಂಬುವ ಹಂತದಲ್ಲಿ ಭತ್ತಕ್ಕೆ ವ್ಯಾಪಕ ಹಾನಿ ಉಂಟಾಗಿದೆ.

PMFBY ಕ್ಲೇಮ್ ಸಲ್ಲಿಸಲು ಕೊನೆಯ ದಿನಾಂಕವನ್ನು ಮಾರ್ಚ್ 31, 2026 ರವರೆಗೆ ವಿಸ್ತರಿಸಲಾಗಿದೆ.`,
    chartData: [
      { taluk: 'Alur', claims: 8200, loss: 78 },
      { taluk: 'Arsikere', claims: 7100, loss: 71 },
      { taluk: 'Hassan', claims: 6800, loss: 58 },
      { taluk: 'Channarayapatna', claims: 5200, loss: 65 },
      { taluk: 'Belur', claims: 3900, loss: 42 }
    ],
    chartType: 'bar',
    chartTitle: 'PMFBY Claims by Taluk — Hassan District',
    chartTitleKannada: 'ತಾಲ್ಲೂಕುವಾರು PMFBY ಕ್ಲೇಮ್ಗಳು',
    chartXKey: 'taluk',
    chartBars: [
      { key: 'claims', name: 'Claims Filed', color: '#0D7377' },
      { key: 'loss', name: 'Crop Loss %', color: '#E74C3C' }
    ],
    tableHeaders: ['District', 'Claims Filed', 'Area Affected (Ha)', 'Estimated Loss'],
    tableHeadersKannada: ['ಜಿಲ್ಲೆ', 'ಕ್ಲೇಮ್ ಸಲ್ಲಿಕೆ', 'ಪ್ರಭಾವಿತ ಪ್ರದೇಶ', 'ಅಂದಾಜು ನಷ್ಟ'],
    tableRows: [
      ['Hassan', '31,200', '42,800 Ha', '₹180 Cr'],
      ['Tumkur', '16,800', '21,200 Ha', '₹94 Cr'],
      ['Chitradurga', '8,400', '11,600 Ha', '₹52 Cr'],
      ['Total', '56,400', '75,600 Ha', '₹326 Cr']
    ],
    tags: ['PMFBY', 'Hassan', 'Crop Insurance', 'Paddy'],
    tagsKannada: ['PMFBY', 'ಹಾಸನ', 'ಬೆಳೆ ವಿಮೆ', 'ಭತ್ತ']
  },

  {
    id: 'n2',
    slug: 'raitha-siri-deadline-extended',
    category: 'Government Scheme',
    categoryKannada: 'ಸರ್ಕಾರಿ ಯೋಜನೆ',
    categoryColor: '#0D7377',
    date: 'March 15, 2026',
    dateKannada: 'ಮಾರ್ಚ್ 15, 2026',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&h=400&fit=crop',
    imageAlt: 'Karnataka government agriculture scheme',
    title: 'Karnataka Extends Raitha Siri Deadline to April 30 Amid Surge in Applications',
    titleKannada: 'ಅರ್ಜಿಗಳ ಹೆಚ್ಚಳದ ಮಧ್ಯೆ ಕರ್ನಾಟಕ ರೈತ ಸಿರಿ ಗಡುವನ್ನು ಏಪ್ರಿಲ್ 30 ಕ್ಕೆ ವಿಸ್ತರಿಸಿದೆ',
    summary: 'The Karnataka government has extended the Raitha Siri drought relief scheme deadline by 45 days following a flood of late applications from farmers in 12 distress-affected districts.',
    summaryKannada: '12 ಸಂಕಷ್ಟ ಪೀಡಿತ ಜಿಲ್ಲೆಗಳಿಂದ ತಡವಾದ ಅರ್ಜಿಗಳ ಪ್ರವಾಹದ ನಂತರ ಕರ್ನಾಟಕ ಸರ್ಕಾರವು ರೈತ ಸಿರಿ ಬರ ಪರಿಹಾರ ಯೋಜನೆಯ ಅರ್ಜಿ ಗಡುವನ್ನು 45 ದಿನಗಳಷ್ಟು ವಿಸ್ತರಿಸಿದೆ.',
    content: `The Karnataka Department of Agriculture announced that the Raitha Siri drought relief scheme has been extended to April 30, 2026.

The decision comes after district offices received over 2.4 lakh applications in the final week before the original deadline — nearly triple the weekly average.

Under the Raitha Siri scheme, eligible farmers receive Rs 10,000 per hectare as drought relief, capped at 2 hectares per farmer household.

Mobile application camps will be set up in villages with less than 60% enrollment.

Districts with the highest pending applications include Hassan (18,400), Tumkur (14,200), Chitradurga (12,800), and Bellary (11,200).`,
    contentKannada: `ಕರ್ನಾಟಕ ಕೃಷಿ ಇಲಾಖೆ ರೈತ ಸಿರಿ ಬರ ಪರಿಹಾರ ಯೋಜನೆಯನ್ನು ಏಪ್ರಿಲ್ 30, 2026 ರವರೆಗೆ ವಿಸ್ತರಿಸಿದೆ.

ರೈತ ಸಿರಿ ಯೋಜನೆಯಡಿ, ಅರ್ಹ ರೈತರು ಪ್ರತಿ ಹೆಕ್ಟೇರ್ಗೆ ₹10,000 ಬರ ಪರಿಹಾರ ಪಡೆಯುತ್ತಾರೆ.

60% ಕ್ಕಿಂತ ಕಡಿಮೆ ನೋಂದಣಿ ಹೊಂದಿರುವ ಗ್ರಾಮಗಳಲ್ಲಿ ಮೊಬೈಲ್ ಅರ್ಜಿ ಶಿಬಿರಗಳನ್ನು ಸ್ಥಾಪಿಸಲಾಗುವುದು.`,
    chartData: [
      { district: 'Hassan', pending: 18400, processed: 12200 },
      { district: 'Tumkur', pending: 14200, processed: 8900 },
      { district: 'Chitradurga', pending: 12800, processed: 7400 },
      { district: 'Bellary', pending: 11200, processed: 6100 },
      { district: 'Raichur', pending: 9800, processed: 5200 }
    ],
    chartType: 'bar',
    chartTitle: 'Raitha Siri — Pending vs Processed Applications',
    chartTitleKannada: 'ರೈತ ಸಿರಿ — ಬಾಕಿ vs ಪ್ರಕ್ರಿಯೆ ಅರ್ಜಿಗಳು',
    chartXKey: 'district',
    chartBars: [
      { key: 'pending', name: 'Pending', color: '#E74C3C' },
      { key: 'processed', name: 'Processed', color: '#27AE60' }
    ],
    tableHeaders: ['Benefit', 'Amount', 'Cap', 'Eligibility'],
    tableHeadersKannada: ['ಪ್ರಯೋಜನ', 'ಮೊತ್ತ', 'ಮಿತಿ', 'ಅರ್ಹತೆ'],
    tableRows: [
      ['Drought Relief', '₹10,000/hectare', '2 hectares', '>50% crop loss'],
      ['Input Subsidy', '₹2,000 flat', 'Once/season', 'All registered'],
      ['Transport Aid', '₹500 flat', 'Once/year', '<1 hectare farmers']
    ],
    tags: ['Raitha Siri', 'Drought Relief', 'Karnataka', 'Deadline'],
    tagsKannada: ['ರೈತ ಸಿರಿ', 'ಬರ ಪರಿಹಾರ', 'ಕರ್ನಾಟಕ', 'ಗಡುವು']
  },

  {
    id: 'n3',
    slug: 'coffee-exports-coorg-record',
    category: 'Export',
    categoryKannada: 'ರಫ್ತು',
    categoryColor: '#27AE60',
    date: 'March 12, 2026',
    dateKannada: 'ಮಾರ್ಚ್ 12, 2026',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop',
    imageAlt: 'Coffee plantation in Coorg Karnataka',
    title: 'Coorg Coffee Exports Hit Rs 2,800 Crore — Record High for Karnataka',
    titleKannada: 'ಕೊಡಗು ಕಾಫಿ ರಫ್ತು ₹2,800 ಕೋಟಿ ತಲುಪಿದೆ — ಕರ್ನಾಟಕಕ್ಕೆ ದಾಖಲೆ',
    summary: 'Karnataka coffee exports have crossed Rs 2,800 crore in the 2025-26 fiscal year, driven by record demand from European markets and a 15% premium on Arabica varieties from Coorg and Chikkamagaluru.',
    summaryKannada: 'ಯುರೋಪಿಯನ್ ಮಾರುಕಟ್ಟೆಗಳಿಂದ ದಾಖಲೆ ಬೇಡಿಕೆ ಮತ್ತು ಕೊಡಗಿನ ಅರೇಬಿಕಾ ತಳಿಗಳ 15% ಪ್ರೀಮಿಯಂನಿಂದ ಕರ್ನಾಟಕ ಕಾಫಿ ರಫ್ತು ₹2,800 ಕೋಟಿ ದಾಟಿದೆ.',
    content: `Karnataka, which accounts for 71% of India's total coffee production, has achieved a landmark export milestone in the 2025-26 fiscal year.

Arabica exports from Coorg and Chikkamagaluru districts commanded a 15% price premium in European markets, driven by increased demand for single-origin specialty coffee.

Robusta varieties from the Sakleshpur region of Hassan district have also seen a 12% price increase due to tightening global supply from Vietnam.

Total coffee area under cultivation in Karnataka stands at 2.58 lakh hectares, with 1.04 lakh farmer households directly dependent on coffee cultivation.`,
    contentKannada: `ಭಾರತದ ಒಟ್ಟು ಕಾಫಿ ಉತ್ಪಾದನೆಯ 71% ಪಾಲು ಹೊಂದಿರುವ ಕರ್ನಾಟಕ 2025-26 ಹಣಕಾಸು ವರ್ಷದಲ್ಲಿ ₹2,800 ಕೋಟಿ ರಫ್ತು ಮೈಲಿಗಲ್ಲು ಸಾಧಿಸಿದೆ.

ಕರ್ನಾಟಕದಲ್ಲಿ ಕಾಫಿ ಕೃಷಿ ಅಡಿಯಲ್ಲಿ ಒಟ್ಟು 2.58 ಲಕ್ಷ ಹೆಕ್ಟೇರ್ ಇದ್ದು, 1.04 ಲಕ್ಷ ರೈತ ಕುಟುಂಬಗಳು ಕಾಫಿ ಕೃಷಿಯನ್ನೇ ಅವಲಂಬಿಸಿವೆ.`,
    chartData: [
      { year: '2021-22', exports: 1840 },
      { year: '2022-23', exports: 2100 },
      { year: '2023-24', exports: 2380 },
      { year: '2024-25', exports: 2610 },
      { year: '2025-26', exports: 2800 }
    ],
    chartType: 'area',
    chartTitle: 'Karnataka Coffee Exports (Rs Crore) — 5 Year Trend',
    chartTitleKannada: 'ಕರ್ನಾಟಕ ಕಾಫಿ ರಫ್ತು (₹ ಕೋಟಿ) — 5 ವರ್ಷ',
    chartXKey: 'year',
    chartBars: [
      { key: 'exports', name: 'Export Value (Rs Cr)', color: '#0D7377' }
    ],
    tableHeaders: ['Variety', 'Region', 'Volume (MT)', 'Price Premium'],
    tableHeadersKannada: ['ತಳಿ', 'ಪ್ರದೇಶ', 'ಪ್ರಮಾಣ (MT)', 'ಬೆಲೆ ಪ್ರೀಮಿಯಂ'],
    tableRows: [
      ['Arabica', 'Coorg, Chikkamagaluru', '48,200 MT', '+15%'],
      ['Robusta', 'Sakleshpur, Hassan', '82,400 MT', '+12%'],
      ['Specialty', 'Coorg', '4,800 MT', '+35%']
    ],
    tags: ['Coffee', 'Coorg', 'Exports', 'Record'],
    tagsKannada: ['ಕಾಫಿ', 'ಕೊಡಗು', 'ರಫ್ತು', 'ದಾಖಲೆ']
  },

  {
    id: 'n4',
    slug: 'ragi-bonus-hassan',
    category: 'Price Support',
    categoryKannada: 'ಬೆಲೆ ಬೆಂಬಲ',
    categoryColor: '#F39C12',
    date: 'March 10, 2026',
    dateKannada: 'ಮಾರ್ಚ್ 10, 2026',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=400&fit=crop',
    imageAlt: 'Ragi harvest in Karnataka',
    title: 'Hassan Ragi Farmers Get Rs 500 Bonus Per Quintal Under Millet Mission 2026',
    titleKannada: 'ಹಾಸನ ರಾಗಿ ರೈತರಿಗೆ ಮಿಲೆಟ್ ಮಿಷನ್ 2026 ರಡಿ ಕ್ವಿಂಟಾಲ್ಗೆ ₹500 ಬೋನಸ್',
    summary: 'The Karnataka government has announced a Rs 500 per quintal bonus over MSP for ragi farmers in Hassan, Tumkur, and Mysuru districts as part of the Millet Mission 2026 initiative.',
    summaryKannada: 'ಮಿಲೆಟ್ ಮಿಷನ್ 2026 ಉಪಕ್ರಮದ ಭಾಗವಾಗಿ ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಹಾಸನ, ತುಮಕೂರು ಮತ್ತು ಮೈಸೂರು ಜಿಲ್ಲೆಗಳ ರಾಗಿ ರೈತರಿಗೆ MSP ಮೇಲೆ ₹500 ಬೋನಸ್ ಘೋಷಿಸಿದೆ.',
    content: `Karnataka's Millet Mission 2026 has announced a Rs 500 per quintal bonus over the MSP for ragi — a crop grown by approximately 3.8 lakh farmer families in the state.

The current MSP for ragi is Rs 3,846 per quintal. With the bonus, farmers will receive Rs 4,346 per quintal — a 13% increase.

Hassan district, which accounts for 18% of Karnataka's ragi production, is expected to be among the primary beneficiaries.

Procurement will happen through KASAMB directly at village-level collection centres, eliminating the need for farmers to transport produce to distant APMCs.`,
    contentKannada: `ಕರ್ನಾಟಕ ಮಿಲೆಟ್ ಮಿಷನ್ 2026 ರಾಗಿ MSP ಮೇಲೆ ₹500 ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್ ಬೋನಸ್ ಘೋಷಿಸಿದೆ.

ಪ್ರಸ್ತುತ ರಾಗಿಯ MSP ₹3,846 ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್. ಬೋನಸ್ನೊಂದಿಗೆ ರೈತರು ₹4,346 ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್ ಪಡೆಯುತ್ತಾರೆ.

ಹಾಸನ ಜಿಲ್ಲೆಯು ಕರ್ನಾಟಕದ ರಾಗಿ ಉತ್ಪಾದನೆಯ 18% ಪಾಲು ಹೊಂದಿದೆ.`,
    chartData: [
      { year: '2022', msp: 3578, withBonus: 3578 },
      { year: '2023', msp: 3846, withBonus: 3846 },
      { year: '2024', msp: 3846, withBonus: 3846 },
      { year: '2025', msp: 3846, withBonus: 4346 }
    ],
    chartType: 'bar',
    chartTitle: 'Ragi MSP vs Effective Price with Bonus (Rs/Quintal)',
    chartTitleKannada: 'ರಾಗಿ MSP vs ಬೋನಸ್ ಸಹಿತ ಬೆಲೆ',
    chartXKey: 'year',
    chartBars: [
      { key: 'msp', name: 'MSP', color: '#95A5A6' },
      { key: 'withBonus', name: 'With Bonus', color: '#27AE60' }
    ],
    tableHeaders: ['District', 'Ragi Area (Ha)', 'Farmers', 'Extra Income'],
    tableHeadersKannada: ['ಜಿಲ್ಲೆ', 'ರಾಗಿ ಕ್ಷೇತ್ರ', 'ರೈತರು', 'ಹೆಚ್ಚುವರಿ ಆದಾಯ'],
    tableRows: [
      ['Hassan', '48,200 Ha', '42,800', '₹38 Cr'],
      ['Tumkur', '62,400 Ha', '56,200', '₹48 Cr'],
      ['Mysuru', '38,800 Ha', '34,100', '₹29 Cr'],
      ['Total', '1,49,400 Ha', '1,33,100', '₹115 Cr']
    ],
    tags: ['Ragi', 'MSP', 'Millet Mission', 'Hassan'],
    tagsKannada: ['ರಾಗಿ', 'MSP', 'ಮಿಲೆಟ್ ಮಿಷನ್', 'ಹಾಸನ']
  },

  {
    id: 'n5',
    slug: 'cooperative-loan-restructuring',
    category: 'Finance',
    categoryKannada: 'ಹಣಕಾಸು',
    categoryColor: '#2471AE',
    date: 'March 8, 2026',
    dateKannada: 'ಮಾರ್ಚ್ 8, 2026',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    imageAlt: 'Rural cooperative bank Karnataka',
    title: 'Karnataka Cooperative Banks Announce Loan Restructuring for 2.1 Lakh Distressed Farmers',
    titleKannada: 'ಕರ್ನಾಟಕ ಸಹಕಾರಿ ಬ್ಯಾಂಕ್ಗಳು 2.1 ಲಕ್ಷ ರೈತರಿಗೆ ಸಾಲ ಮರುರಚನೆ ಘೋಷಿಸಿದೆ',
    summary: 'The Karnataka State Cooperative Apex Bank has announced a one-time loan restructuring scheme for 2.1 lakh farmers with overdue agricultural loans, offering 24-month moratorium and 50% interest waiver.',
    summaryKannada: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಸಹಕಾರಿ ಅಪೆಕ್ಸ್ ಬ್ಯಾಂಕ್ 2.1 ಲಕ್ಷ ರೈತರಿಗೆ 24 ತಿಂಗಳ ಮೊರಾಟೋರಿಯಂ ಮತ್ತು 50% ಬಡ್ಡಿ ಮನ್ನಾ ನೀಡುವ ಏಕಕಾಲಿಕ ಸಾಲ ಮರುರಚನೆ ಯೋಜನೆ ಘೋಷಿಸಿದೆ.',
    content: `The Karnataka State Cooperative Apex Bank (KSCAB) has announced a one-time loan restructuring programme targeting 2.1 lakh agricultural borrowers whose loans have been classified as NPAs.

The scheme offers a 24-month moratorium on principal repayment, a 50% waiver on accumulated interest, and the option to convert short-term crop loans into medium-term loans at 4% interest.

The total portfolio under restructuring is estimated at Rs 4,200 crore. NABARD has agreed to provide refinance support at a concessional rate of 3.5%.

Hassan district has the highest concentration of eligible borrowers at approximately 28,400 farmers.`,
    contentKannada: `ಕರ್ನಾಟಕ ರಾಜ್ಯ ಸಹಕಾರಿ ಅಪೆಕ್ಸ್ ಬ್ಯಾಂಕ್ (KSCAB) ಸಾಲ ಮರುರಚನೆ ಕಾರ್ಯಕ್ರಮ ಘೋಷಿಸಿದೆ.

ಈ ಯೋಜನೆಯು 24 ತಿಂಗಳ ಮೊರಾಟೋರಿಯಂ, 50% ಬಡ್ಡಿ ಮನ್ನಾ ಮತ್ತು 4% ಬಡ್ಡಿಯಲ್ಲಿ ಮಧ್ಯಮ ಅವಧಿ ಸಾಲ ಪರಿವರ್ತನೆ ನೀಡುತ್ತದೆ.

ಹಾಸನ ಜಿಲ್ಲೆಯಲ್ಲಿ ಅತ್ಯಧಿಕ 28,400 ಅರ್ಹ ರೈತರಿದ್ದಾರೆ.`,
    chartData: [
      { district: 'Hassan', eligible: 28400 },
      { district: 'Chitradurga', eligible: 24800 },
      { district: 'Tumkur', eligible: 21200 },
      { district: 'Davangere', eligible: 18600 },
      { district: 'Bellary', eligible: 16400 }
    ],
    chartType: 'bar',
    chartTitle: 'Top 5 Districts — Eligible Farmers for Restructuring',
    chartTitleKannada: 'ಮರುರಚನೆಗೆ ಅರ್ಹ ರೈತರು — ಮೇಲಿನ 5 ಜಿಲ್ಲೆಗಳು',
    chartXKey: 'district',
    chartBars: [
      { key: 'eligible', name: 'Eligible Farmers', color: '#0D7377' }
    ],
    tableHeaders: ['Benefit', 'Details'],
    tableHeadersKannada: ['ಪ್ರಯೋಜನ', 'ವಿವರ'],
    tableRows: [
      ['Moratorium', '24 months on principal'],
      ['Interest Waiver', '50% of accumulated interest'],
      ['New Rate', '4% (KCC rate)'],
      ['Total Portfolio', 'Rs 4,200 crore'],
      ['Application Period', 'April 1 – June 30, 2026']
    ],
    tags: ['Cooperative Banks', 'Loan', 'NPA', 'Restructuring'],
    tagsKannada: ['ಸಹಕಾರಿ ಬ್ಯಾಂಕ್', 'ಸಾಲ', 'NPA', 'ಮರುರಚನೆ']
  },

  {
    id: 'n6',
    slug: 'drip-irrigation-north-karnataka',
    category: 'Technology',
    categoryKannada: 'ತಂತ್ರಜ್ಞಾನ',
    categoryColor: '#8E44AD',
    date: 'March 6, 2026',
    dateKannada: 'ಮಾರ್ಚ್ 6, 2026',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop',
    imageAlt: 'Drip irrigation system in Karnataka farm',
    title: 'Drip Irrigation Adoption Doubles in North Karnataka — 1.8 Lakh Hectares Added',
    titleKannada: 'ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ ಹನಿ ನೀರಾವರಿ ದ್ವಿಗುಣ — 1.8 ಲಕ್ಷ ಹೆಕ್ಟೇರ್ ಸೇರ್ಪಡೆ',
    summary: 'Drip irrigation adoption has doubled in northern districts this season with 1.8 lakh hectares brought under micro-irrigation through the PM Krishi Sinchayee Yojana subsidy.',
    summaryKannada: 'PM ಕೃಷಿ ಸಿಂಚಾಯಿ ಯೋಜನೆ ಸಬ್ಸಿಡಿ ಮೂಲಕ 1.8 ಲಕ್ಷ ಹೆಕ್ಟೇರ್ ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ಅಡಿ ತರಲಾಗಿದ್ದು ಉತ್ತರ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಹನಿ ನೀರಾವರಿ ದ್ವಿಗುಣಗೊಂಡಿದೆ.',
    content: `Karnataka's PMKSY implementation has achieved a significant milestone this season, with drip and sprinkler irrigation adoption doubling across northern districts.

A total of 1.8 lakh hectares have been brought under micro-irrigation in Vijayapura, Bagalkot, Dharwad, and Haveri districts.

The state government provides a 55% subsidy on drip irrigation for small and marginal farmers, with an additional 10% top-up for SC/ST farmers.

Water use efficiency studies show drip-irrigated sugarcane requires 42% less water while achieving 23% yield improvement.`,
    contentKannada: `ಕರ್ನಾಟಕದ PMKSY ಅನುಷ್ಠಾನವು ವಿಜಯಪುರ, ಬಾಗಲಕೋಟ, ಧಾರವಾಡ ಮತ್ತು ಹಾವೇರಿ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ದ್ವಿಗುಣ ಸಾಧಿಸಿದೆ.

ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ 55% ಸಬ್ಸಿಡಿ ನೀಡಲಾಗುತ್ತದೆ.

ಹನಿ ನೀರಾವರಿ ಕಬ್ಬಿಗೆ 42% ಕಡಿಮೆ ನೀರು ಬೇಕಾಗುತ್ತದೆ ಮತ್ತು 23% ಹೆಚ್ಚು ಇಳುವರಿ ಬರುತ್ತದೆ.`,
    chartData: [
      { district: 'Vijayapura', hectares: 42000 },
      { district: 'Bagalkot', hectares: 38000 },
      { district: 'Dharwad', hectares: 28000 },
      { district: 'Haveri', hectares: 24000 },
      { district: 'Gadag', hectares: 18000 }
    ],
    chartType: 'bar',
    chartTitle: 'Drip Irrigation — Hectares Added This Season',
    chartTitleKannada: 'ಹನಿ ನೀರಾವರಿ — ಈ ಋತುವಿನ ಹೆಕ್ಟೇರ್',
    chartXKey: 'district',
    chartBars: [
      { key: 'hectares', name: 'Hectares Added', color: '#0D7377' }
    ],
    tableHeaders: ['Farmer Type', 'Subsidy %', 'Net Cost (1 Ha)', 'Payback Period'],
    tableHeadersKannada: ['ರೈತ ವಿಧ', 'ಸಬ್ಸಿಡಿ %', 'ನಿವ್ವಳ ವೆಚ್ಚ', 'ಹಣ ವಾಪಸಾತಿ'],
    tableRows: [
      ['Small (<2 Ha)', '55%', 'Rs 36,000', '2.5 years'],
      ['Marginal (<1 Ha)', '65%', 'Rs 28,000', '2 years'],
      ['SC/ST', '75%', 'Rs 20,000', '1.5 years'],
      ['Large (>2 Ha)', '35%', 'Rs 52,000', '3.5 years']
    ],
    tags: ['Drip Irrigation', 'PMKSY', 'Water', 'North Karnataka'],
    tagsKannada: ['ಹನಿ ನೀರಾವರಿ', 'PMKSY', 'ನೀರು', 'ಉತ್ತರ ಕರ್ನಾಟಕ']
  },

  {
    id: 'n7',
    slug: 'krishi-bhagya-farm-ponds',
    category: 'Infrastructure',
    categoryKannada: 'ಮೂಲಸೌಕರ್ಯ',
    categoryColor: '#E67E22',
    date: 'March 4, 2026',
    dateKannada: 'ಮಾರ್ಚ್ 4, 2026',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop',
    imageAlt: 'Farm pond Karnataka',
    title: 'Krishi Bhagya Scheme Constructs 12,000 Farm Ponds This Season',
    titleKannada: 'ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ ಈ ಋತುವಿನಲ್ಲಿ 12,000 ಕೃಷಿ ಕೊಳಗಳ ನಿರ್ಮಾಣ',
    summary: 'The Karnataka government\'s Krishi Bhagya scheme has constructed 12,000 farm ponds this season, providing water security to dryland farmers across 14 districts.',
    summaryKannada: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ ಈ ಋತುವಿನಲ್ಲಿ 14 ಜಿಲ್ಲೆಗಳ ಒಣಭೂಮಿ ರೈತರಿಗೆ ನೀರಿನ ಭದ್ರತೆ ನೀಡಿ 12,000 ಕೃಷಿ ಕೊಳಗಳನ್ನು ನಿರ್ಮಿಸಿದೆ.',
    content: `Karnataka's Krishi Bhagya scheme has achieved its highest single-season construction target with 12,000 ponds completed across 14 districts.

Each farm pond measuring 30x24x3 metres has a water storage capacity of approximately 2,160 cubic metres — sufficient to irrigate 0.8 hectares through a critical dry spell.

Studies show Krishi Bhagya beneficiaries experienced 28% lower crop failure rates during the 2024-25 drought season.

The cumulative impact since 2014 stands at 2.18 lakh farm ponds covering 1.74 lakh hectares of drought-protected area.`,
    contentKannada: `ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ 14 ಜಿಲ್ಲೆಗಳಲ್ಲಿ 12,000 ಕೊಳಗಳ ನಿರ್ಮಾಣ ಪೂರ್ಣಗೊಳಿಸಿ ಅತ್ಯಧಿಕ ಋತುಮಾನ ಗುರಿ ಸಾಧಿಸಿದೆ.

ಕೃಷಿ ಭಾಗ್ಯ ಫಲಾನುಭವಿಗಳು 2024-25 ಬರ ಋತುವಿನಲ್ಲಿ 28% ಕಡಿಮೆ ಬೆಳೆ ವೈಫಲ್ಯ ಅನುಭವಿಸಿದ್ದಾರೆ.

2014 ರಿಂದ ಒಟ್ಟು 2.18 ಲಕ್ಷ ಕೊಳಗಳು 1.74 ಲಕ್ಷ ಹೆಕ್ಟೇರ್ ರಕ್ಷಿಸುತ್ತಿವೆ.`,
    chartData: [
      { season: '2021-22', ponds: 6200 },
      { season: '2022-23', ponds: 7800 },
      { season: '2023-24', ponds: 9400 },
      { season: '2024-25', ponds: 10800 },
      { season: '2025-26', ponds: 12000 }
    ],
    chartType: 'area',
    chartTitle: 'Krishi Bhagya — Farm Ponds Built Per Season',
    chartTitleKannada: 'ಕೃಷಿ ಭಾಗ್ಯ — ಋತುವಾರು ನಿರ್ಮಿತ ಕೊಳಗಳು',
    chartXKey: 'season',
    chartBars: [
      { key: 'ponds', name: 'Ponds Built', color: '#0D7377' }
    ],
    tableHeaders: ['District', 'Ponds This Season', 'Total Since 2014', 'Area Protected'],
    tableHeadersKannada: ['ಜಿಲ್ಲೆ', 'ಈ ಋತು', '2014 ರಿಂದ', 'ರಕ್ಷಿತ ಪ್ರದೇಶ'],
    tableRows: [
      ['Tumkur', '1,840', '18,200', '14,560 Ha'],
      ['Chitradurga', '1,620', '16,800', '13,440 Ha'],
      ['Bellary', '1,400', '14,200', '11,360 Ha'],
      ['Hassan', '1,180', '12,400', '9,920 Ha']
    ],
    tags: ['Krishi Bhagya', 'Farm Ponds', 'Water', 'Dryland'],
    tagsKannada: ['ಕೃಷಿ ಭಾಗ್ಯ', 'ಕೃಷಿ ಕೊಳ', 'ನೀರು', 'ಒಣಭೂಮಿ']
  },

  {
    id: 'n8',
    slug: 'hassan-paddy-yield-decline',
    category: 'Alert',
    categoryKannada: 'ಎಚ್ಚರಿಕೆ',
    categoryColor: '#C0392B',
    date: 'March 2, 2026',
    dateKannada: 'ಮಾರ್ಚ್ 2, 2026',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop',
    imageAlt: 'Damaged paddy crop Hassan district',
    title: 'Hassan District Paddy Yield Down 23% — Worst Season in 8 Years',
    titleKannada: 'ಹಾಸನ ಜಿಲ್ಲೆ ಭತ್ತ ಇಳುವರಿ 23% ಕಡಿಮೆ — 8 ವರ್ಷಗಳಲ್ಲಿ ಕೆಟ್ಟ ಋತು',
    summary: 'Hassan district has recorded a 23% decline in paddy yield this Rabi season, marking the worst agricultural season since 2018 due to three separate weather shocks.',
    summaryKannada: 'ಹಾಸನ ಜಿಲ್ಲೆಯು ಮೂರು ಹವಾಮಾನ ಆಘಾತಗಳಿಂದ ಈ ರಬಿ ಋತುವಿನಲ್ಲಿ ಭತ್ತದ ಇಳುವರಿಯಲ್ಲಿ 23% ಕುಸಿತ ದಾಖಲಿಸಿದ್ದು 2018 ರ ನಂತರ ಕೆಟ್ಟ ಕೃಷಿ ಋತು ಎಂದು ಗುರುತಿಸಿದೆ.',
    content: `Hassan district's paddy farmers are facing their most difficult season in nearly a decade, with crop cutting experiments recording an average yield of 32.4 quintals per hectare — a 23% decline from the 5-year average of 42.1 quintals.

The decline is attributed to a triple weather shock: flooding in October 2025 during transplanting, a 28-day dry spell in January 2026 during tillering, and 48mm of unseasonal rain in March 2026 during grain filling.

Alur taluk is the hardest hit with 31% yield losses. Arsikere and Channarayapatna recorded 27% and 24% declines respectively.

The state government has directed KSNDMC to activate drought relief protocols for Hassan district.`,
    contentKannada: `ಹಾಸನ ಜಿಲ್ಲೆಯ ಭತ್ತ ರೈತರು ಪ್ರತಿ ಹೆಕ್ಟೇರ್ಗೆ ಸರಾಸರಿ 32.4 ಕ್ವಿಂಟಾಲ್ ಇಳುವರಿ ದಾಖಲಿಸಿದ್ದು 5 ವರ್ಷದ ಸರಾಸರಿ 42.1 ಕ್ವಿಂಟಾಲ್ಗಿಂತ 23% ಕಡಿಮೆ.

ಅಲೂರು ತಾಲ್ಲೂಕು 31% ಇಳುವರಿ ನಷ್ಟದೊಂದಿಗೆ ಅತ್ಯಂತ ಹಾನಿಗೊಳಗಾಗಿದೆ.

ರಾಜ್ಯ ಸರ್ಕಾರ KSNDMC ಗೆ ಹಾಸನ ಜಿಲ್ಲೆಗೆ ಬರ ಪರಿಹಾರ ಶಿಷ್ಟಾಚಾರ ಸಕ್ರಿಯಗೊಳಿಸಲು ನಿರ್ದೇಶನ ನೀಡಿದೆ.`,
    chartData: [
      { season: '2019-20', yield: 41.2 },
      { season: '2020-21', yield: 43.8 },
      { season: '2021-22', yield: 40.9 },
      { season: '2022-23', yield: 44.2 },
      { season: '2023-24', yield: 42.1 },
      { season: '2024-25', yield: 40.8 },
      { season: '2025-26', yield: 32.4 }
    ],
    chartType: 'area',
    chartTitle: 'Hassan District Paddy Yield (Quintals/Ha) — 7 Year Trend',
    chartTitleKannada: 'ಹಾಸನ ಜಿಲ್ಲೆ ಭತ್ತ ಇಳುವರಿ — 7 ವರ್ಷ',
    chartXKey: 'season',
    chartBars: [
      { key: 'yield', name: 'Yield (Q/Ha)', color: '#E74C3C' }
    ],
    tableHeaders: ['Taluk', 'Avg Yield (Q/Ha)', 'Decline', 'Farmers Affected'],
    tableHeadersKannada: ['ತಾಲ್ಲೂಕು', 'ಸರಾಸರಿ ಇಳುವರಿ', 'ಕುಸಿತ', 'ಪ್ರಭಾವಿತ ರೈತರು'],
    tableRows: [
      ['Alur', '28.2 Q/Ha', '-31%', '18,400'],
      ['Arsikere', '30.8 Q/Ha', '-27%', '14,200'],
      ['Channarayapatna', '31.4 Q/Ha', '-24%', '12,800'],
      ['Hassan', '34.2 Q/Ha', '-18%', '22,600'],
      ['Belur', '36.8 Q/Ha', '-12%', '8,900']
    ],
    tags: ['Paddy', 'Yield', 'Hassan', 'Weather'],
    tagsKannada: ['ಭತ್ತ', 'ಇಳುವರಿ', 'ಹಾಸನ', 'ಹವಾಮಾನ']
  },

  {
    id: 'n9',
    slug: 'karnataka-ai-crop-advisory',
    category: 'Technology',
    categoryKannada: 'ತಂತ್ರಜ್ಞಾನ',
    categoryColor: '#8E44AD',
    date: 'March 1, 2026',
    dateKannada: 'ಮಾರ್ಚ್ 1, 2026',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&h=400&fit=crop',
    imageAlt: 'AI crop advisory app for farmers',
    title: 'Karnataka Launches AI Crop Advisory Platform for 5 Lakh Farmers',
    titleKannada: '5 ಲಕ್ಷ ರೈತರಿಗೆ ಕರ್ನಾಟಕ AI ಬೆಳೆ ಸಲಹಾ ವೇದಿಕೆ ಆರಂಭ',
    summary: 'Karnataka has launched Krishi Sahayak AI — a multilingual AI platform providing real-time crop advisory, pest management guidance, and weather-based farming recommendations via SMS and app.',
    summaryKannada: 'ಕರ್ನಾಟಕ SMS ಮತ್ತು ಅಪ್ಲಿಕೇಶನ್ ಮೂಲಕ ನೈಜ-ಸಮಯ ಬೆಳೆ ಸಲಹೆ ಮತ್ತು ಕೀಟ ನಿರ್ವಹಣೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುವ ಬಹುಭಾಷಾ AI ವೇದಿಕೆ ಕೃಷಿ ಸಹಾಯಕ AI ಆರಂಭಿಸಿದೆ.',
    content: `The Karnataka Department of Agriculture launched Krishi Sahayak AI on March 1, 2026 — an AI platform designed to democratize expert agricultural advisory for smallholder farmers.

The platform uses a large language model trained on Karnataka-specific data including soil types, crop calendars, rainfall patterns, and pest outbreak histories from the past 15 years. It supports Kannada, English, Telugu, and Urdu.

In the first 24 hours of launch, over 1.2 lakh farmers registered — exceeding the first-month target of 50,000.

The platform is integrated with the PM-Kisan database for automatic profile pre-population.`,
    contentKannada: `ಕರ್ನಾಟಕ ಕೃಷಿ ಇಲಾಖೆ ಮಾರ್ಚ್ 1, 2026 ರಂದು ಕೃಷಿ ಸಹಾಯಕ AI ಆರಂಭಿಸಿತು.

ಮೊದಲ 24 ಗಂಟೆಗಳಲ್ಲಿ 1.2 ಲಕ್ಷ ರೈತರು ನೋಂದಾಯಿಸಿಕೊಂಡರು.

ವೇದಿಕೆಯು ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್, ತೆಲುಗು ಮತ್ತು ಉರ್ದು ಭಾಷೆಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ.`,
    chartData: [
      { day: 'Day 1', registrations: 120000 },
      { day: 'Day 2', registrations: 148000 },
      { day: 'Day 3', registrations: 172000 },
      { day: 'Day 7', registrations: 224000 },
      { day: 'Day 14', registrations: 318000 },
      { day: 'Day 21', registrations: 398000 }
    ],
    chartType: 'area',
    chartTitle: 'Krishi Sahayak AI — Cumulative Registrations',
    chartTitleKannada: 'ಕೃಷಿ ಸಹಾಯಕ AI — ಸಂಚಿತ ನೋಂದಣಿಗಳು',
    chartXKey: 'day',
    chartBars: [
      { key: 'registrations', name: 'Registrations', color: '#0D7377' }
    ],
    tableHeaders: ['Feature', 'Description', 'Languages'],
    tableHeadersKannada: ['ವೈಶಿಷ್ಟ್ಯ', 'ವಿವರಣೆ', 'ಭಾಷೆಗಳು'],
    tableRows: [
      ['Pest ID', 'Photo upload diagnosis', 'Kannada, English'],
      ['Crop Calendar', 'Weather-integrated', 'All 4 languages'],
      ['Soil Advisory', 'Linked to Soil Health Card', 'Kannada, English'],
      ['Market Prices', 'Real-time APMC rates', 'All 4 languages']
    ],
    tags: ['AI', 'Technology', 'Crop Advisory', 'Kannada'],
    tagsKannada: ['AI', 'ತಂತ್ರಜ್ಞಾನ', 'ಬೆಳೆ ಸಲಹೆ', 'ಕನ್ನಡ']
  },

  {
    id: 'n10',
    slug: 'nabard-karnataka-infrastructure',
    category: 'Finance',
    categoryKannada: 'ಹಣಕಾಸು',
    categoryColor: '#2471AE',
    date: 'February 28, 2026',
    dateKannada: 'ಫೆಬ್ರವರಿ 28, 2026',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    imageAlt: 'Rural infrastructure Karnataka',
    title: 'NABARD Approves Rs 450 Crore for Rural Infrastructure in Karnataka',
    titleKannada: 'NABARD ಕರ್ನಾಟಕದಲ್ಲಿ ಗ್ರಾಮೀಣ ಮೂಲಸೌಕರ್ಯಕ್ಕೆ ₹450 ಕೋಟಿ ಅನುಮೋದಿಸಿದೆ',
    summary: 'NABARD has sanctioned Rs 450 crore under RIDF for Karnataka, targeting 240 rural roads, 18 cold storage facilities, and 42 APMC market yard upgrades across 18 districts.',
    summaryKannada: 'NABARD ಕರ್ನಾಟಕಕ್ಕಾಗಿ RIDF ಅಡಿ ₹450 ಕೋಟಿ ಮಂಜೂರು ಮಾಡಿದ್ದು 18 ಜಿಲ್ಲೆಗಳಲ್ಲಿ 240 ಗ್ರಾಮೀಣ ರಸ್ತೆಗಳು, 18 ಶೀತಲ ಸಂಗ್ರಹ ಮತ್ತು 42 APMC ನವೀಕರಣ ಗುರಿಯಾಗಿದೆ.',
    content: `NABARD has approved Rs 450 crore under the Rural Infrastructure Development Fund (RIDF-XXXI) for Karnataka, targeting critical agricultural infrastructure gaps.

The sanctioned amount will fund 240 rural road projects, 18 cold storage facilities with combined capacity of 1.2 lakh metric tonnes, and upgradation of 42 APMC market yards.

Hassan district has been allocated Rs 42 crore — the highest single-district allocation.

Karnataka currently loses approximately Rs 1,800 crore annually in post-harvest losses due to inadequate cold chain infrastructure.`,
    contentKannada: `NABARD ಕರ್ನಾಟಕಕ್ಕಾಗಿ RIDF-XXXI ಅಡಿ ₹450 ಕೋಟಿ ಅನುಮೋದಿಸಿದೆ.

ಹಾಸನ ಜಿಲ್ಲೆಗೆ ₹42 ಕೋಟಿ ಹಂಚಿಕೆ ಮಾಡಲಾಗಿದ್ದು ಅತ್ಯಧಿಕ ಏಕ-ಜಿಲ್ಲೆ ಹಂಚಿಕೆಯಾಗಿದೆ.

ಕರ್ನಾಟಕ ಪ್ರತಿ ವರ್ಷ ₹1,800 ಕೋಟಿ ಕೊಯ್ಲೋತ್ತರ ನಷ್ಟ ಅನುಭವಿಸುತ್ತಿದೆ.`,
    chartData: [
      { category: 'Rural Roads', allocation: 180 },
      { category: 'Cold Storage', allocation: 142 },
      { category: 'APMC Upgrades', allocation: 84 },
      { category: 'Irrigation', allocation: 44 }
    ],
    chartType: 'bar',
    chartTitle: 'NABARD RIDF Allocation — Karnataka (Rs Crore)',
    chartTitleKannada: 'NABARD RIDF ಹಂಚಿಕೆ — ಕರ್ನಾಟಕ',
    chartXKey: 'category',
    chartBars: [
      { key: 'allocation', name: 'Allocation (Rs Cr)', color: '#0D7377' }
    ],
    tableHeaders: ['District', 'Allocation', 'Road Projects', 'Cold Storage'],
    tableHeadersKannada: ['ಜಿಲ್ಲೆ', 'ಹಂಚಿಕೆ', 'ರಸ್ತೆ ಯೋಜನೆಗಳು', 'ಶೀತಲ ಶೇಖರಣೆ'],
    tableRows: [
      ['Hassan', 'Rs 42 Cr', '22', '3'],
      ['Tumkur', 'Rs 38 Cr', '20', '2'],
      ['Belagavi', 'Rs 36 Cr', '18', '2'],
      ['Mysuru', 'Rs 32 Cr', '16', '2'],
      ['Others (14)', 'Rs 302 Cr', '164', '9']
    ],
    tags: ['NABARD', 'Infrastructure', 'Cold Storage', 'Rural Roads'],
    tagsKannada: ['NABARD', 'ಮೂಲಸೌಕರ್ಯ', 'ಶೀತಲ ಶೇಖರಣೆ', 'ಗ್ರಾಮೀಣ ರಸ್ತೆ']
  }
];
