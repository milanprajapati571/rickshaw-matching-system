# 🛺 CampusRide: Rickshaw Matching System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

**CampusRide** is a sleek, real-time localized rickshaw matching service specifically designed for closed or open college campuses. 

## 💡 The Concept & Why It's Needed
Standard ride-sharing applications (like Uber or Ola) rely heavily on precise digital cartography (GIS street navigation APIs). That is incredibly inefficient for college campuses where local rickshaws travel strictly across internal "unmapped" checkpoints (like "Library" &rarr; "Boys Hostel"). 

**CampusRide solves this by dropping the map entirely.** It acts as an instant local broadcast hub. Passengers simply select their starting hotspot and destination hotspot from a verified drop-down. Nearby un-booked rickshaw drivers can see the broadcast ring in instantly, accept the ticket, and coordinate via their auto number.

---

## ⚙️ How It Works

### For Passengers 🙍‍♂️
1. Navigate to **Passenger Mode**.
2. **Authenticate:** Provide your registered name and College Email.
3. **Book:** Choose your Pickup and Drop-off locations (e.g. from Canteen to Library).
4. **Broadcast:** Send an active broadcast locally to all available drivers.
5. **Match:** When a driver accepts the ride, the portal updates with the Driver's Name and exact **Vehicle Auto Number**, alongside an estimated arrival mechanism.

### For Drivers 🛺
1. Navigate to **Driver Mode**.
2. **Authenticate:** Provide your name and authorized **Vehicle Auto Number**.
3. **Ride Portal:** Enters the secure "Driver Portal" that actively reads the area's WebSocket frequencies to catch passenger requests.
4. **Accept & Track:** Watch local "Pings" drop. Accept rides seamlessly (it auto-manages maximum seat constraints up to 4 passengers).

---

## 🚦 Internal Routes Architecture

| Application Route | Description / Purpose |
|-------------------|---------------------------------------------------------------|
| `/`               | **Homepage Dashboard**. Includes navigation cards and instruction sets. |
| `/passenger`      | **Passenger Booking Portal**. Handles origin/destination dispatching. |
| `/driver`         | **Driver Match Portal**. Handles ride acceptance and seat limitations. |
| `/admin`          | 🛡️ **Hidden Management GUI**. Restricted access mapping all database logic. |

### 🛡️ The `/admin` Portal
Rather than viewing unstructured JSON logs on the backend, the Admin Route allows the ecosystem creator to moderate their software visually. 
> **Note to user:** The portal is deliberately hidden off-grid. It requires exact string authentication logic (`username/password`) mapped internally to securely block un-authorized access.

Inside the Admin Dashboard, the portal can:
* **Track Ride Ledgers:** See exactly who booked a ride, who picked them up, and the success status alongside timestamps.
* **Inspect Connected Users:** See the identities and Auto Vehicle Numbers of connected agents.
* **CRUD Target Hotspots:** Admins can actively **Add, Edit, and Delete** campus hotspots without needing to edit raw code. This immediately populates to the Passenger selections upon app refresh.

---

## 🏗️ The Technology Stack

**Frontend Framework:** 
- React with TypeScript (via Vite setup)
- Tailwind CSS v4 featuring native sophisticated Dark/Light mode thematic scaling (using `Slate` and `Blue` rich aesthetics).
- Headless, minimal component structures heavily utilizing hooks (`useState`, `useEffect`).

**Backend API:**
- Express JS REST Architecture.
- Native Node.js Server Environment.
- Temporary In-Memory State Logic (Data stores tracking active requests mapped into a global object).

**The Bloodline:**
- **Socket.io (WebSockets):** Completely nullifies the need to long-poll APIs. Both drivers and passengers execute HTTP connections securely bound by WebSockets. Emitting broadcasts triggers direct state mutation flawlessly across endpoints.

---
*&copy; 2026 CampusRide. Made by student from student with ❤️ and hardwork.*
