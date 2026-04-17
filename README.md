# 🪙 FinDash: Enterprise Finance Dashboard

Building B2B financial tools doesn't mean they have to be clunky or confusing. **FinDash** is a full-stack, highly secure finance analytics dashboard designed specifically with Indian SMEs (Small and Medium Enterprises) in mind. 

I built this project to demonstrate how to balance complex backend data aggregation with a beautiful, snappy, and intuitive React frontend.

---

## ✨ What Makes This Special?

* **🇮🇳 Localized for the Indian Market:** Built from the ground up for India. Features INR (₹) formatting, custom-integrated Rupee metric icons, and realistic Indian business data (GST, localized vendors) for a truly authentic feel.
* **🎨 Premium UI Polish:** Features a custom Gold Rupee browser favicon, clean document routing, persistent Light/Dark mode, fully responsive layouts, and smooth, interactive charts.
* **🔐 Strict Role-Based Access Control (RBAC):** Not everyone should see the company's payroll. The system strictly isolates users into `ADMIN`, `ANALYST`, and `VIEWER` tiers.
* **📈 Predictive Forecasting:** Instead of just showing past data, the backend calculates a 3-Month Simple Moving Average (SMA) to project next month's income and expenses.

---

## 🛠️ The Technology Stack

I chose a modern, type-safe stack to ensure the application is robust and maintainable.

**The Frontend (Client)**
* **React (Vite) & TypeScript:** For a fast, type-safe development environment.
* **Tailwind CSS & Lucide React:** For utility-first, highly customizable styling and crisp iconography.
* **Zustand:** For lightweight, painless global state management (handling Auth and Theme).
* **Recharts:** For rendering complex, layered SVG data visualizations.

**The Backend (Server)**
* **Node.js & Express:** A RESTful API built with a clean, layered architecture (Routes → Controllers → Services).
* **Prisma ORM & SQLite:** For type-safe database queries and easy local setup without needing a separate database server.
* **Security:** `bcrypt` for password hashing, and `jsonwebtoken` for secure, stateless API authentication.

---

## 🚀 How to Run It Locally

You will need Node.js installed on your machine. You'll need two separate terminal windows to run the frontend and backend concurrently.

### 1. Fire up the Backend
Open your first terminal and navigate to the server folder:
`bash`
cd server
npm install
npx prisma db push --force-reset
npx tsx prisma/seed.ts
npm run dev
`
*(This sets up your SQLite database, seeds it with dummy data, and starts the API on port 5000).*

### 2. Fire up the Frontend
Open your second terminal and navigate to the client folder:
`bash`
cd client
npm install
npm run dev
`
*(This starts the Vite development server. Open the localhost link it provides in your browser).*

---

## 🔑 Demo Credentials

To test the RBAC features, I've pre-seeded the database with three tiered user accounts. Feel free to log in as any of them to see how the UI and data access change.

| Role | Email | Password | What they can do |
| :--- | :--- | :--- | :--- |
| **Admin** | `vikram.admin@zorvyn.in` | `Admin123!` | Full CRUD, manages users, views all financial data. |
| **Analyst** | `neha.analyst@zorvyn.in` | `Admin123!` | Read-Only, but can view all company financial data. |
| **Viewer** | `rahul.viewer@zorvyn.in` | `Admin123!` | Read/Write, but can **only** view their own transaction data. |

---

## 🧠 Developer Notes & Architecture Thoughts

A few technical decisions I made while building this:

* **No Public Registration:** You might notice there is no "Sign Up" page. This was a deliberate security choice. In a real enterprise FinTech environment, public sign-ups are a massive vulnerability. Users are exclusively provisioned by Admins.
* **Database-Level Math:** To prevent the Node.js server from crashing under heavy memory loads, all data aggregation (like summing totals and grouping by categories) is done entirely at the database level using Prisma's `aggregate` and `groupBy` functions.
* **Secure CSV Exports:** To allow users to securely download CSV reports behind our JWT auth wall, the frontend fetches the file as a raw Blob via Axios, rather than just linking to a URL that could be bypassed.
