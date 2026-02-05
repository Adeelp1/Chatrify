# CHATRIFY

*Connect Instantly, Communicate Seamlessly, Experience Limitless Interaction*

![Last Commit](https://img.shields.io/github/last-commit/Adeelser/Chatrify?style=for-the-badge)
![Repo Size](https://img.shields.io/github/repo-size/Adeelser/Chatrify?style=for-the-badge)
![Top Language](https://img.shields.io/github/languages/top/Adeelser/Chatrify?style=for-the-badge)
![License](https://img.shields.io/github/license/Adeelser/Chatrify?style=for-the-badge)

---

## 🛠️ Tech Stack

### Backend & Realtime
- Node.js
- Express
- Socket.IO
- WebRTC
- Redis

### Microservices & Tools
- Python
- FastAPI
- Go
- Axios

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Project Structure](#project-structure)
- [Future Roadmap](#future-roadmap)
- [License](#license)

---

## 📌 Overview

**Chatrify** is a comprehensive developer toolkit designed to facilitate the creation of real-time communication, matchmaking, and personalized experiences. It seamlessly integrates WebRTC for peer-to-peer video and audio, robust backend services for scalable chat and user management, and intelligent matchmaking with vector similarity search and Redis queues.

This project simplifies the development of interactive, real-time applications. The core features include:

- **🎯 Matchmaking & Recommendations:** Efficiently pair users with personalized suggestions using Redis queues and vector similarity.
- **🔗 WebRTC Signaling:** Manage real-time media streams with WebRTC and Socket.IO for smooth peer-to-peer communication.
- **⚙️ Scalable Backend:** Built with Express, Redis, and modular models to support secure, high-performance chat and user sessions.
- **💬 Frontend Integration:** User-friendly interfaces for registration, login, and media interaction.
- **🔐 Secure & Modular:** Designed for easy extension, ensuring secure, reliable, and maintainable real-time apps.

---

## ✨ Features

- 🎯 **Smart Matchmaking**
- 🔗 **WebRTC Signaling**
- 💬 **Real-Time Chat**
- 🚀 **Scalable Backend**
- 🔒 **Secure & Extensible**

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v18+)
- npm
- Python (3.9+)
- Go
- Redis

---

### 🧰 Installation

```sh
git clone https://github.com/Adeelser/Chatrify.git
cd Chatrify
npm install
pip install -r Backend/RecommenderService/requirements.txt
cd Backend/MatchMakingService && go build
```

---

## ▶️ Usage

```sh
npm start
python Backend/RecommenderService/src/main.py
go run Backend/MatchMakingService/cmd/matchMaking/main.go
```

Ensure Redis is running.

---

## 🗂️ Project Structure

```text
Chatrify/
├── Backend/
├── Frontend/
├── .env.example
├── package.json
└── README.md
```

---

## 🛣️ Future Roadmap

- Authentication (JWT/OAuth)
- AI-powered matchmaking
- Docker & Kubernetes

---

## 📄 License

MIT License
