# KrishiManas: Beyond Growth, Prioritizing Survival 🌾🛡️

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-teal?style=for-the-badge&logo=vercel)](https://krishi-manas-core.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**KrishiManas** is a next-generation agricultural resilience platform designed for the Indian farming ecosystem. While most agri-tech solutions focus on maximizing yield, KrishiManas focuses on the **human behind the plow**. 

By tracking emotional and financial distress indices (DPI), the platform enables pre-emptive intervention to prevent agricultural crises and farmer suicides before they escalate.

---

## 📸 Visual Core

### 🛰️ The Command Center (Landing)
A cinematic entrance with glassmorphism and real-time news propagation, designed to bridge the gap between traditional farming and high-tech resilience.
![Landing Hero](docs/screenshots/landing_hero.png)

### 📊 Farmer Command Console
Real-time **Distress Performance Index (DPI)** tracking. Farmers follow a strict 14-day professional diagnostic protocol to monitor their agricultural and financial health.
![Farmer Dashboard](docs/screenshots/farmer_dashboard.png)

### 🧠 KrishiManas Assistant (AI)
Powered by **Google Gemini 1.5 Flash**, the assistant provides contextual, bilingual (English/Kannada) support for schemes, weather, and crisis management.
![Chatbot Interaction](docs/screenshots/chatbot.png)

### 🗺️ Tactical Sector Mapping (Admin)
The administrative hub offers a regional "God-mode" view, mapping distress hotspots and enabling 0-delay emergency broadcast protocols (AIR Broadcast System).
![Admin Dashboard](docs/screenshots/admin_dashboard.png)

---

## 🛠️ The Tech Engine

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Auth)
- **Intelligence**: [Google Gemini 1.5 Flash API](https://deepmind.google/technologies/gemini/)
- **Icons & UI**: [Lucide React](https://lucide.dev/) + [Framer Motion](https://www.framer.com/motion/)

---

## 🛡️ Core Innovations

### 1. The 14-Day Diagnostic Protocol
An immutable diagnostic window that prevents "data fatigue." Farmers can only perform deep-checks every 14 days, ensuring high-quality, reflective data acquisition.

### 2. Dual-Layer AI Response
- **Local Layer**: Fast, rule-based responses for common greetings and platform navigation.
- **Gemini AI Layer**: Sophisticated, context-aware agricultural advice and scheme matching based on the farmer's specific DPI status.

### 3. Tactical Sector Alerts
Admin-controlled "AIR Broadcast System" that can dispatch encrypted emergency protocols to specific distress sectors with sub-60ms internal latency.

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- Firebase Project
- Gemini API Key

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/lolaamh06/KrishiManas-Core.git
   cd KrishiManas-Core
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create a .env file with your VITE_FIREBASE_* and VITE_GEMINI_API_KEY
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd ../backend
   npm install
   # Create a .env file with FIREBASE_ADMIN_SDK details
   node index.js
   ```

---

## 🌍 Open Data Initiative
KrishiManas includes a public **Research Dataset** (anonymized) to help university students and policymakers study socio-economic trends in Hassan district and beyond.

---

*Made with ❤️ for the Indian Farmer.*
