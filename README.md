<div align="center">
  <h1>🛡️ CodeGuardian AI</h1>
  <p><strong>AI-Powered Security Scanner for GitHub Repositories</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version"/>
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome"/>
    <img src="https://img.shields.io/badge/status-stable-success" alt="Status"/>
  </p> 
</div>

---

## 📌 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Environment Variables](#-environment-variables)
- [📡 API Endpoints](#-api-endpoints)
- [🧪 Test Repositories](#-test-repositories)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [👨‍💻 Contact](#-contact)

---

## 🌟 Overview

**CodeGuardian AI** is a comprehensive security scanning platform that uses Artificial Intelligence to detect vulnerabilities in GitHub repositories. It provides real-time vulnerability detection, team collaboration, and an intelligent AI assistant to help developers write secure code.

### 🎯 Problem It Solves

| Problem | Solution |
|---------|----------|
| ❌ Manual code reviews are time-consuming | ✅ AI scans 500+ files in seconds |
| ❌ Security vulnerabilities go unnoticed | ✅ Real-time vulnerability detection |
| ❌ Teams lack collaboration tools | ✅ Built-in team management |
| ❌ Junior devs struggle with security | ✅ AI explains issues in plain English |

---

## ✨ Features

### 🔐 Authentication
- JWT-based authentication with refresh tokens
- GitHub OAuth 2.0 integration
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Session management

### 📊 Repository Scanner
- Scan any public GitHub repository
- AI-powered vulnerability detection using Groq LLM
- Severity classification (Critical, High, Medium, Low)
- Code quality and performance analysis
- Automatic fix suggestions
- Real-time scan progress updates

### 👥 Team Management
- Create and manage multiple teams
- Invite members via email
- View team members list
- Delete teams (owner only)
- Member role management

### 🤖 AI Features
- **AI Security Assistant**: Ask security-related questions
- **AI Code Fixer**: Paste code and get instant fixes
- **Security Recommendations**: Best practices tailored to your code
- **Vulnerability Explanation**: Plain English explanations

### 📄 Reports & Analytics
- Detailed vulnerability reports per file
- Scan history tracking
- Interactive analytics dashboard
- Severity breakdown visualization
- Security score calculation (0-100)
- PDF report generation

### 🎨 User Interface
- Modern dark theme design
- Fully responsive (Mobile, Tablet, Desktop)
- Real-time progress indicators
- Toast notifications
- Smooth animations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library with hooks |
| React Router DOM | 6.20.0 | Client-side routing |
| Tailwind CSS | 3.3.5 | Utility-first styling |
| Socket.io-client | 4.5.4 | Real-time communication |
| Axios | 1.6.0 | HTTP requests |
| Recharts | 2.9.0 | Interactive charts |
| React Hot Toast | 2.4.1 | Toast notifications |
| React Icons | 4.12.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.18.2 | Web framework |
| MongoDB | 6.0+ | NoSQL database |
| Mongoose | 8.0.0 | ODM for MongoDB |
| Socket.io | 4.7.2 | WebSocket server |
| JWT | 9.0.2 | Authentication |
| bcryptjs | 2.4.3 | Password hashing |
| Passport.js | 0.7.0 | GitHub OAuth |

### APIs & Services
| Service | Purpose |
|---------|---------|
| GitHub API | Repository access |
| Groq API | AI/LLM for code analysis |

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────────────┐
│ Client Browser │
│ (React + Tailwind CSS) │
└─────────────────────────┬───────────────────────────────────┘
│ HTTPS/WSS
┌─────────────────────────▼───────────────────────────────────┐
│ Frontend (Vercel) │
│ React + Socket.io Client │
└─────────────────────────┬───────────────────────────────────┘
│ API Calls
┌─────────────────────────▼───────────────────────────────────┐
│ Backend (Render) │
│ Node.js + Express + Socket.io │
└─────────────────────────┬───────────────────────────────────┘
│
┌─────────────────────────▼───────────────────────────────────┐
│ MongoDB Atlas │
│ (Users, Teams, ScanHistory) │
└─────────────────────────────────────────────────────────────┘

text

### Data Flow

1. **User Authentication**: JWT tokens stored in localStorage
2. **Repository Scan**: Backend fetches from GitHub API → AI analysis → Store in MongoDB
3. **Team Management**: CRUD operations with member management
4. **AI Assistant**: Groq LLM integration for intelligent responses

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- GitHub OAuth App credentials
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/sorathiyalaksh37-lang/CODEGUARDIAN-AI.git
cd CODEGUARDIAN-AI
2. Backend Setup

bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
3. Frontend Setup

bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
4. Open your browser

text
http://localhost:5173
Test Credentials

text
Email: demo@codeguardian.com
Password: demo123456
📁 Project Structure

text
CODEGUARDIAN-AI/
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── teamController.js
│   │   ├── githubController.js
│   │   ├── aiController.js
│   │   └── aiFixController.js
│   ├── models/               # Database models
│   │   ├── User.js
│   │   ├── Team.js
│   │   └── ScanHistory.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── githubRoutes.js
│   │   ├── aiRoutes.js
│   │   └── aiFixRoutes.js
│   ├── middleware/           # Custom middleware
│   │   └── authMiddleware.js
│   ├── config/               # Configuration files
│   │   ├── db.js
│   │   └── passport.js
│   ├── utils/                # Helper functions
│   │   └── generateToken.js
│   ├── server.js             # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── ScanReport.jsx
│   │   │   ├── Teams.jsx
│   │   │   ├── AiAssistant.jsx
│   │   │   ├── CodeFixer.jsx
│   │   │   └── AnalyticsPage.jsx
│   │   ├── components/       # Reusable components
│   │   │   ├── Analytics.jsx
│   │   │   └── Navbar.jsx
│   │   ├── layouts/          # Layout components
│   │   │   └── MainLayout.jsx
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   ├── socket.js         # Socket.io client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── LICENSE
└── README.md
🔧 Environment Variables

Backend (.env)

env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/codeguardian

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Session
SESSION_SECRET=your_session_secret_key
Frontend (.env)

env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
📡 API Endpoints

Authentication

Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/auth/github	GitHub OAuth
GitHub Scanner

Method	Endpoint	Description
POST	/api/github/scan	Scan repository
GET	/api/github/history	Get scan history
GET	/api/github/scan/:id	Get single scan
Teams

Method	Endpoint	Description
POST	/api/teams/create	Create team
GET	/api/teams/my-teams	Get user teams
POST	/api/teams/add-member	Invite member
POST	/api/teams/remove-member	Remove member
DELETE	/api/teams/delete/:id	Delete team
AI Features

Method	Endpoint	Description
POST	/api/ai/chat	AI assistant chat
POST	/api/aifix/fix	Fix code vulnerabilities
🧪 Test Repositories

Use these URLs to test the scanner:

bash
# Fast scans (small repos)
https://github.com/axios/axios
https://github.com/lodash/lodash

# Medium scans
https://github.com/expressjs/express
https://github.com/vercel/next.js

# Vulnerability detection testing
https://github.com/OWASP/NodeGoat
https://github.com/we45/Vulnerable-Node-App
Expected Results

Repository	Security Score	Risk Level
axios/axios	85-95	Low
lodash/lodash	80-90	Low
express/express	65-75	Medium
NodeGoat	35-50	High
🚢 Deployment

Deploy Backend to Render

Push code to GitHub
Create new Web Service on Render
Connect repository
Build command: npm install
Start command: npm start
Add environment variables
Deploy
Deploy Frontend to Vercel

Push code to GitHub
Import project on Vercel
Framework preset: Vite
Add environment variables
Deploy
🤝 Contributing

Contributions are welcome!

Fork the repository
Create feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add some AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open a Pull Request
Development Guidelines

Follow ESLint configuration
Write meaningful commit messages
Update documentation for new features
Add tests where applicable
📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Contact
Laksh Sorathiya
GitHub: @sorathiyalaksh37-lang
Email: lakshsorathiya37@gmail.com
🙏 Acknowledgments

GitHub API for repository access
Groq for AI capabilities
MongoDB for database services
Socket.io for real-time features
Open Source Community for amazing tools
