# Chatrify

A simple **peer-to-peer video calling application** built with **WebRTC**, **Node.js**, and **Socket.IO**.  
This app allows two users to connect and stream audio/video directly to each other without a central media server.

---

## 🚀 Features
- Real-time **peer-to-peer** video and audio calling
- Uses **WebRTC** for media streaming
- **Socket.IO** for signaling between peers
- Automatically handles ICE candidates exchange
- Works locally and over the internet (with proper TURN/STUN servers)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Adeelp1/Chatrify.git
cd Chatrify
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start the Signaling Server
```bash
cd ./Backend/server/
node server.js
```
By default, the server runs on http://localhost:3000.

---

## 🛠️ How It Works
- WebRTC handles the actual media streaming directly between peers.
- Socket.IO is used only for signaling:
    - Sending offers/answers
    - Sending ICE candidates
- Once the handshake is complete, the video/audio flows directly peer-to-peer.

---

## 📜 License
This project is licensed under the **MIT License**.