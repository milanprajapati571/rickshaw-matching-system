# 👥 Team Contributions & Project Roles

This document outlines the core responsibilities and specific module ownership for the Rickshaw Matching System project. Our collaboration followed a modular approach, ensuring seamless integration between the real-time backend and the responsive frontend.

---

### 👑 Milan Prajapati (Team Lead & Backend Architect)
**Primary Focus:** System Logic, Real-Time Networking, and Administrative Tools.
- **Core Engine:** Engineered the central `Socket.io` server logic, managing the complex state synchronization between passengers and drivers.
- **Matching Algorithm:** Developed the broadcast and acceptance handshake protocols that allow for real-time ride requests and status updates.
- **Admin Infrastructure:** Built the restricted Admin Dashboard, implementing server-side stat tracking and memory-scoped monitoring for active sessions.
- **Documentation:** Authored the technical architecture overview and system requirements.

### 🎨 Sri Lakshmi (Frontend Specialist)
**Primary Focus:** UI/UX Architecture and Aesthetic Framework.
- **Environment Setup:** Scaled the initial Vite + React development environment and configured the Tailwind CSS design system.
- **Routing & Navigation:** Implemented the `react-router-dom` architecture to handle seamless transitions between the Home, Passenger, and Driver views.
- **Aesthetic Refinement:** Directed the visual identity of the project, including the slate-blue color palette, dark mode responsiveness, and Lucide-React icon integration.

### 🔌 Soumith (Frontend Logic & State Management)
**Primary Focus:** Client-Side Socket Integration and Persistence.
- **Interface Development:** Built the interactive UI components for both the Passenger and Driver portals, ensuring a user-centric experience.
- **Socket Connectivity:** Developed the frontend socket abstraction layer, bridging the gap between the React components and the backend server.
- **Session Persistence:** Solved critical state-loss issues by implementing browser session storage logic to maintain socket IDs during accidental page reloads.

### 🗄️ Sujith (Data Management & Infrastructure)
**Primary Focus:** Server Foundations and Data Persistence.
- **Server Initialization:** Configured the Node.js/Express environment and handled the TypeScript configuration for the backend.
- **Storage Logic:** Integrated Firebase skeletons and managed the globally-scoped memory arrays that track active users and ride history.
- **Data Integrity:** Assisted in structuring the data models for "Active Rides" to ensure that the server accurately tracks the lifecycle of every transaction.

---

*This project was developed collaboratively using an incremental Git workflow to simulate a real-world agile production environment.*
