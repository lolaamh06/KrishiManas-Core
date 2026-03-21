# KrishiManas 2.0 - Agri-Resilience Protocol

KrishiManas is a comprehensive digital defense system designed to monitor farmer distress, provide real-time AI-driven scheme matching, and enable rapid volunteer (Mitra) interventions.

---

## 🏗️ Project Architecture

The repository is modularized into two primary ecosystems:
- **`frontend/`**: A React + Vite application powering the distinct Portals (Farmer Console, Mitra Response, Admin Command Center, and the Master QR Hub).
- **`backend/`**: A Node.js configured environment (if applicable) handling background API operations, Mock Twilio integration, and data management.

---

## 🚀 Installation & Run Instructions

### Prerequisites
Before running the application locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- `npm` (comes with Node.js)

### 1. Frontend Setup (UI & Portals)
The frontend contains the interactive React application.

Open your terminal and navigate to the frontend folder:
```bash
cd frontend
```

Install the required dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The terminal will provide a local URL (usually `http://localhost:5173`). Open this link in your browser to view the Landing Page.*

### 2. Backend Setup (APIs & Services)
If a corresponding backend server needs to run alongside the UI:

Open a new terminal window and navigate to the backend folder:
```bash
cd backend
```

Install the backend dependencies:
```bash
npm install
```

Start the backend server:
```bash
npm start
```
*(Alternatively, use `npm run dev` if `nodemon` is configured for development).*

---

## ⚙️ Environment Variables (.env)
*⚠️ Note: `.env` files contain sensitive API keys and are strictly ignored by Git.*

To fully configure real-time features like Firebase or SMS integration, you must create an environment file.

1. **Inside the `frontend/` directory**, create a file named `.env`.
2. Add your variable keys. Example:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

*(Currently, the app defaults to a robust "Mock Mode" for testing without requiring active Firebase Authentication configuration).*

---

## 🌐 Accessing the Regional Portals
Once the frontend server is active, access the sub-systems via the Landing Page routes:

- **Landing Page**: `http://localhost:5173/`
- **Farmer Console**: `http://localhost:5173/farmer/dashboard`
- **Volunteer (Mitra) Gateway**: `http://localhost:5173/mitra`
- **District Admin Engine**: `http://localhost:5173/admin`
- **QR Asset Distribution**: `http://localhost:5173/qr`
