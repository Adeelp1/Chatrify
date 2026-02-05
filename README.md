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

**Chatrify** is a real-time communication and matchmaking platform inspired by instant video chat applications.

It is designed as a **developer-friendly, scalable toolkit** that combines:

- Peer-to-peer video & audio using **WebRTC**
- Real-time messaging using **Socket.IO**
- Intelligent matchmaking using **Redis queues & vector similarity**
- Modular microservices architecture for scalability

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
