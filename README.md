# Broken Authentication & Session Hijacking Lab  
A Practical Demonstration of Predictable Session Tokens and Weak Authentication

## 📌 Introduction  to the project 
This project is a hands-on cybersecurity lab that demonstrates **Broken Authentication** vulnerabilities caused by predictable session identifiers, insecure password storage, and weak session management. It simulates a real-world scenario where an attacker can hijack a user’s session without ever knowing the password.


---

## 🎯 Objective  
To teach how predictable session IDs can lead to:  
- Session Hijacking  
- Authentication Bypass  
- Full Account Takeover  

This lab shows exactly how attackers enumerate session tokens and compromise accounts.

---

## 🧩 What This Lab Demonstrates  
- **Plain-text password storage**  
- **Predictable session tokens** (`session-1`, `session-2`, etc.)  
- **Lack of secure cookie flags**  
- **No session expiration**  
- **Authentication bypass via session hijacking**  
- **Automated brute‑force attack** using a Python script  

---

## 🏗️ System Architecture  



The system consists of three main components running inside Docker:

### 1️⃣ Vulnerable Web App  
- Built using **Node.js + Express**  
- Manages registration, login, and session handling  

### 2️⃣ MySQL Database  
Stores:  
- `users` table (plain-text passwords 😱)  
- `sessions` table (predictable tokens)

### 3️⃣ Python Attacker Script  
Enumerates session tokens until a valid one is found.

---

## 📂 Folder Structure  
```
cyber-broken-auth-lab/
├── vulnerable-app/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── views/
│       ├── index.html
│       ├── login.html
│       └── dashboard.html
├── attacker/
│   ├── brute.py
│   └── config.env
├── db/
│   └── init-db.sql
└── docker-compose.yml
```

---

## 🧠 How Authentication Works  

### 6.1 Registration  
User registers → password stored in plain text.

### 6.2 Login  
A session is created:  
```
session-1  
session-2  
session-3  
```
Predictable = exploitable.

### 6.3 Dashboard  
Accessed via cookie only:  
```
Cookie: session=session-5
```
No other authentication check is performed.

---

## 🦹 Attacker Workflow  



The attacker script sends tokens such as:  
```
session-1  
session-2  
session-3  
...
session-200
```

When a valid one returns **200 OK**, the attacker gains full access.

---

## ▶️ Running the Lab  

### Step 1 — Start Docker
```
docker compose up --build
```

### Step 2 — Open App  
http://localhost:5000  

### Step 3 — Register User  
Any username + any password.

### Step 4 — Login  
Generates predictable session token.

### Step 5 — Attacker Output  
Example:
```
[+] Valid session token found: session-5
```

---

## 🧪 API Testing (Thunder Client)  

### Registration  
```
POST /register
Body: username=test, password=1234
```

### Login  
```
POST /login
```

### Dashboard  
```
GET /dashboard  
Cookie: session=session-5
```

---

## 🗄️ MySQL Queries  
```
USE broken_auth;
SELECT * FROM users;
SELECT * FROM sessions;
```

---

## 🛑 Key Vulnerabilities  
- Predictable session tokens  
- Plain-text password storage  
- No cookie security flags  
- No session expiration  

---

## 🛡️ How to Fix It (Mitigation)  
- Hash passwords with **bcrypt**  
- Use **random session tokens** (UUID, crypto)  
- Enable cookie flags:  
  - `HttpOnly`  
  - `Secure`  
  - `SameSite=strict`  
- Add session expiration  
- Validate user agent, IP, timestamps  
- Use standard authentication frameworks  

---

## 🎓 Learning Outcomes  
Learners gain understanding of:  
- Secure session generation  
- Token enumeration attacks  
- Authentication bypass  
- Proper session management  

---


---

## 📜 License  
Open-source for educational use.

---

## 👨‍💻 Contributors  
Palchhi Jain
