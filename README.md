# 💰 Expense Tracker (Full Stack)

A minimal full-stack expense tracking application built with Node.js, Express, Prisma, SQLite, and React.

---

## 🚀 Features

* Add new expense (amount, category, description, date)
* View list of expenses
* Filter by category
* Sort by date (newest first)
* Total calculation
* Category-wise summary
* Idempotent API (prevents duplicate entries)
* Loading & error handling in UI

---

## 🧠 Key Design Decisions

### 1. Idempotency

* Implemented using `Idempotency-Key` header
* Prevents duplicate expense creation on retries or double-clicks

### 2. Money Handling

* Amount stored as integer (paise)
* Avoids floating-point precision issues

### 3. Simple Architecture

* Express + Prisma backend
* React frontend with minimal state management
* SQLite for simplicity and quick setup

---

## ⚖️ Trade-offs

* Used SQLite instead of PostgreSQL for faster setup
* No authentication implemented
* No pagination (kept dataset small)

---

## 🛠️ Tech Stack

* Backend: Node.js, Express, Prisma, SQLite
* Frontend: React (Vite)
* API Testing: Postman

---

## 📦 Setup Instructions

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
node src/app.js
```

Backend runs on:

```
http://localhost:3000
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🧪 Testing Idempotency

1. Send POST `/expenses` with header:

```
Idempotency-Key: test-123
```

2. Send same request again

✅ Only one expense is created

---

## 🌐 API Endpoints

### POST /expenses

Create expense

### GET /expenses

Query params:

* `category`
* `sort=date_desc`

---

## 📌 Future Improvements

* Authentication
* Edit/Delete expenses
* Pagination
* Charts/analytics dashboard
