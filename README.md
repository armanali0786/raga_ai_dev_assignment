# MedCore — B2B Healthcare SaaS Platform

MedCore is a premium, high-fidelity Healthcare SaaS application built to demonstrate advanced frontend architecture, state management, and real-world healthcare module integration.

![Dashboard Preview](https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=MedCore+Healthcare+SaaS+Dashboard)

## 🚀 Key Features

- **Advanced Authentication**: Full Firebase Authentication integration with session persistence and demo access.
- **Unified Dashboard**: Real-time overview of total patients, active cases, critical alerts, and recent clinical activities.
- **Patient Management System**:
  - **Dynamic Views**: High-performance toggle between Grid and List views.
  - **Smart Filtering**: Advanced search by department, status, and patient metadata.
  - **Patient Deep-Dive**: Detailed patient profile including vitals tracking, BMI calculation, and appointment history.
- **Healthcare Analytics**: Specialized data visualization using Recharts (Admissions, Revenue, Departmental load, Satisfaction).
- **Service Worker Notifications**: Integrated browser-level notifications (local and push ready).
- **Modern Design System**: Custom-built premium Light-mode design system with glassmorphism, responsive data grids, and smooth micro-animations.

## 🛠️ Technology Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Styling**: Vanilla CSS (Modern Variables & Design Tokens)
- **Charts**: [Recharts](https://recharts.org/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components (Atomic design)
│   ├── common/          # Layout, Loaders, Modals, Toasts
│   ├── patients/        # Module-specific components
│   └── layout/          # Sidebar, Header, App Shell
├── store/               # Redux Toolkit slices and configuration
├── hooks/               # Custom business logic hooks
├── pages/               # Top-level view components (Lazy loaded)
├── utils/               # Mock data generators and helpers
├── config/              # Firebase and global configurations
└── types/               # Centralized TypeScript definitions
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory (refer to `.env.example` if available):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔒 Demo Access

You can explore the platform using the following demo credentials:
- **Email**: `demo@medcore.health`
- **Password**: `Demo@123`

---

Built with ❤️ by [Arman Ali](https://github.com/armanali0786)
