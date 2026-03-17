# Jenkins Resource Reservation System

A full-stack web application to manage and reserve Jenkins agents efficiently, preventing resource conflicts during critical builds.

## 🚀 Features

* View available Jenkins agents
* Reserve agents with custom time slots
* Prevent double booking using conflict detection logic
* Real-time agent status (Available / In Use)
* Clean and minimal UI

## 🛠 Tech Stack

* Frontend: React, Tailwind CSS
* Backend: Flask (Python)
* Database: In-memory storage

## ⚙️ Core Logic

The system prevents overlapping reservations using interval comparison:

newStart < existingEnd AND newEnd > existingStart

If this condition is true, the reservation is rejected.

## ▶️ Run Locally

### Backend

cd backend
pip install -r requirements.txt
python server.py

### Frontend

cd frontend
npm install
npm start

## 👩‍💻 Author

Aastha Kapoor

---

⭐ If you found this project useful, feel free to star the repo!
