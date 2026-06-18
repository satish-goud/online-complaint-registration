# 📌 Online Complaint System (MERN Stack)

A full-stack web application for managing and tracking complaints. Built using the MERN stack (MongoDB, Express, React, Node.js) with secure authentication and role-based access control.

---

## 🚀 Features

### 👤 User Features
- User registration and login (JWT authentication)
- Submit complaints with details
- View complaint status (Pending / In Progress / Resolved)
- User dashboard to track submitted complaints

### 🛠️ Admin Features
- Secure admin login access
- View all user complaints
- Update complaint status
- Admin dashboard with analytics:
  - Total complaints
  - Pending / In Progress / Resolved counts
  - Category-wise complaint breakdown
  - Recent complaints list

---

## 🔐 Authentication & Security
- JWT-based authentication system
- Role-based access control (User / Admin)
- Protected routes for admin dashboard
- Secure password hashing using bcrypt

---

## 🧑‍💻 Tech Stack

Frontend:
- React.js (Vite)
- React Router
- Axios
- CSS / Bootstrap

Backend:
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js

---

## 📊 Admin Dashboard
- Real-time complaint statistics
- Status tracking system
- Category-wise analytics
- Recent complaint monitoring

---

## ⚙️ Installation & Setup

1. Clone repository:
git clone https://github.com/your-username/your-repo-name.git

2. Backend setup:
cd backend
npm install
npm run dev

Create .env file:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

3. Frontend setup:
cd frontend
npm install
npm run dev

---

## 🌐 Run Project
Frontend: http://localhost:5173  
Backend: http://localhost:5000  

---

## 📁 Project Structure
project-root/
├── frontend/
├── backend/
├── README.md

---

## 🧠 Future Improvements
- Email notifications for complaints
- File upload support
- Advanced charts (Chart.js / Recharts)
- Deployment (Vercel + Render)
- Mobile responsive UI



