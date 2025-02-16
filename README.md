# Breakdance Judge System - Real-time Event Management
## Project Overview
Breakdance Judge System is a real-time judging system for breakdance competitions. It allows judges to vote in real-time, manages matches and rounds, and synchronizes the results across all clients instantly.

The system consists of:

1. API Server (Node.js, Express, MongoDB)
2. Real-time Server (Socket.IO, Node.js)
3. Frontend (React, hosted on AWS S3)

## 🚀 Features
* Real-time Voting – Judges submit scores, and results update instantly.
* Round & Match Management – Tracks rounds and determines winners.
* Socket.IO WebSockets – Ensures smooth real-time updates.
* AWS Deployment – Hosted with EC2, Elastic Beanstalk, and S3.

## 📂 Project Structure
```
📁 breakdance-judge-system
 ├── 📁 api-server           # Express.js API backend
 ├── 📁 realtime-server      # Socket.IO real-time server
 ├── 📁 main-client          # React-based frontend UI
 ├── README.md               # Project documentation
```

## 🔧 Setup & Installation
### 1️⃣ Clone the Repository
```
git clone https://github.com/nivmoti/breakdance-judge-system.git
cd breakdance-judge-system
```
### 2️⃣ Install Dependencies
**API server**
```
cd api-server
npm install
```

**Real-time Server**
```
cd ../realtime-server
npm install
```

**Frontend**
```
cd ../frontend
npm install
```
