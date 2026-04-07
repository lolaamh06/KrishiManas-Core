# KrishiManas 2.0 - Agri-Resilience & AI Protocol

KrishiManas is a high-fidelity digital defense system designed to monitor farmer distress, provide real-time AI-driven diagnostics, and enable rapid volunteer (Mitra) interventions across Karnataka.

---

## 🌟 Key Features

- **Professional 14-Day Diagnostic Protocol**: A strict evaluation window that recalculates the Distress Performance Index (DPI) every two weeks, ensuring high-frequency monitoring.
- **Socio-Economic Resilience Audit**: Government-style multi-dimensional assessment covering Financial, Social, and Psychological risk factors.
- **Gemini-Powered AI Chatbot**: A context-aware assistant helping farmers navigate schemes and distress management using Google's 1.5 Flash model.
- **Bilingual Core**: Full native support for **Kannada** and **English**, including pre-scripted Audio Guides for offline-first accessibility.
- **Strategic Command Center**: Projector-friendly dark-theme analytics for district administrators.

---

## 🏗️ Project Architecture

The repository is modularized into two primary ecosystems:
- **`frontend/`**: React + Vite application powering the Portals (Farmer, Mitra, Admin, and QR Hub).
- **`backend/`**: Node.js environment handling background operations and mock telemetry.

---

## 🚀 Installation & Run Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- `npm` (comes with Node.js)
- **Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

---

## ⚙️ Environment Variables (.env)
*⚠️ Note: `.env` files are strictly ignored by Git. You must create them manually.*

**`frontend/.env` Configuration:**
```env
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_GEMINI_API_KEY=your_actual_gemini_key_here
```

---

## 🌐 Regional Portals
- **Landing Page**: `http://localhost:5173/`
- **Farmer Console**: `http://localhost:5173/farmer/dashboard`
- **Volunteer Gateway**: `http://localhost:5173/mitra`
- **Admin Engine**: `http://localhost:5173/admin`
- **QR Asset Hub**: `http://localhost:5173/qr`

---

## ⚖️ Open Data Initiative
KrishiManas maintains an open research dataset for agrarian resilience studies. You can download the latest mock-dataset for simulation purposes directly from the landing page.

---
© 2026 KrishiManas Engine // PS-05 Open Innovation Initiative
