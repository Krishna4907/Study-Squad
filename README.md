<p align="center">
  <img src="frontend/public/favicon.svg" alt="StudySquad Logo" width="80" height="80" />
</p>

<h1 align="center">🚀 StudySquad</h1>

<p align="center">
  <strong>AI-Powered Study Partner Matching Platform</strong><br/>
  <em>Find compatible study partners based on courses, schedule, and learning style — and boost your academic productivity.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
</p>

---

## 📚 Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [Matching Algorithm](#matching-algorithm)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 About the Project

**StudySquad** is a full-stack web application designed to connect university students with compatible study partners. The platform uses a custom-built **compatibility matching algorithm** that intelligently analyzes each user's academic profile — including enrolled courses, preferred learning style, schedule availability, and study goals — to recommend the most suitable study partners.

Once matched, students can send connection requests to one another, build a personal study network, schedule sessions, and join **private encrypted video study rooms** for real-time collaborative learning.

---

## ✨ Key Features

### 🔐 Authentication
- Secure sign-up and sign-in powered by **Firebase Authentication**
- Persistent sessions with automatic state management
- Seamless toggle between login and registration flows

### 📋 Onboarding & Profile Setup
- Guided multi-step onboarding wizard to build a study profile
- Captures **basic information** (name, year of study, branch)
- Captures **academic preferences** (enrolled courses, learning style)
- Captures **availability & goals** (schedule focus, session length, study goals)

### 🤖 AI-Powered Matching
- Custom **compatibility scoring algorithm** running on the backend
- Matches are ranked by a weighted compatibility percentage based on:
  - **Shared Courses** (40% weight) — highest priority for study relevance
  - **Schedule Alignment** (30% weight) — ensures students can actually meet
  - **Learning Style Compatibility** (30% weight) — complementary or similar styles
- Only students sharing at least one common course are recommended
- Results sorted by highest compatibility first

### 🤝 Study Network & Connections
- **Send connection requests** to matched study partners with custom messages
- **Accept or reject** incoming study requests from other students
- View **pending requests** and your full **study partner network**
- Duplicate request prevention to maintain clean interaction flows

### 🎥 Video Study Rooms
- Upon accepting a connection, a **unique encrypted study room** is generated
- Private video room launches in a new browser tab for secure, distraction-free study sessions
- Designed to bypass browser security restrictions for camera and microphone access

### 📊 Dashboard
- Centralized **profile tracker** displaying branch, enrolled courses, and learning style
- Real-time display of AI-generated study partner matches
- Each match card shows: name, compatibility rating, shared courses, availability info, and learning style alignment
- Connection status and error handling with clear user feedback

---

## 💻 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI framework |
| **Vite 8** | Fast build tool and dev server |
| **React Router DOM 7** | Client-side routing and navigation |
| **Firebase 12** | User authentication (email/password) |
| **Lucide React** | Modern icon library |
| **Vanilla CSS** | Custom styling and layout |

### Backend
| Technology | Purpose |
|---|---|
| **Java 17** | Core language |
| **Spring Boot 3.2** | REST API framework |
| **Spring Data JPA** | ORM and database access layer |
| **PostgreSQL** | Relational database |
| **Lombok** | Boilerplate reduction (getters, setters, constructors) |
| **Maven** | Build and dependency management |

---

## 🏗 Architecture Overview

```text
┌─────────────────────────────┐          ┌──────────────────────────────┐
│         FRONTEND            │          │          BACKEND             │
│     (React + Vite)          │   REST   │     (Spring Boot + JPA)      │
│                             │◄────────►│                              │
│  ┌───────────────────────┐  │  :5173   │  ┌────────────────────────┐  │
│  │  Firebase Auth        │  │ ◄──────► │  │  MatchController       │  │
│  │  (Login / Signup)     │  │  :8080   │  │  ConnectionController  │  │
│  └───────────────────────┘  │          │  └────────────────────────┘  │
│                             │          │             │                │
│  ┌───────────────────────┐  │          │  ┌────────────────────────┐  │
│  │  Components:          │  │          │  │  MatchingService       │  │
│  │  • Auth               │  │          │  │  (Scoring Algorithm)   │  │
│  │  • Onboarding         │  │          │  └────────────────────────┘  │
│  │  • Dashboard          │  │          │             │                │
│  │  • Connections        │  │          │  ┌────────────────────────┐  │
│  │  • StudyRoom          │  │          │  │  PostgreSQL Database   │  │
│  └───────────────────────┘  │          │  │  • user_profiles       │  │
│                             │          │  │  • connection_requests │  │
└─────────────────────────────┘          │  └────────────────────────┘  │
                                         └──────────────────────────────┘
```

---

## 📂 Project Structure

```text
Study-Squad/
├── backend/
│   ├── pom.xml                                          # Maven config & dependencies
│   └── src/main/
│       ├── java/com/studysquad/
│       │   ├── ApiApplication.java                      # Spring Boot entry point + CORS config
│       │   ├── controller/
│       │   │   ├── MatchController.java                 # Profile save & match retrieval endpoints
│       │   │   └── ConnectionController.java            # Connection request lifecycle endpoints
│       │   ├── model/
│       │   │   ├── UserProfile.java                     # JPA entity: student profiles
│       │   │   ├── ConnectionRequest.java               # JPA entity: study partner requests
│       │   │   └── MatchResult.java                     # DTO: match compatibility result
│       │   ├── repository/
│       │   │   ├── UserProfileRepository.java           # JPA repository for user profiles
│       │   │   └── ConnectionRequestRepository.java     # JPA repository for connection requests
│       │   └── service/
│       │       └── MatchingService.java                 # Core matching / compatibility algorithm
│       └── resources/
│           └── application.properties                   # Database & server config
│
├── frontend/
│   ├── package.json                                     # Node dependencies & scripts
│   ├── vite.config.js                                   # Vite build configuration
│   ├── index.html                                       # HTML entry point
│   ├── public/
│   │   ├── favicon.svg                                  # Application favicon
│   │   └── icons.svg                                    # SVG icon sprites
│   └── src/
│       ├── main.jsx                                     # React DOM render entry
│       ├── App.jsx                                      # Root component with routing
│       ├── App.css                                      # App-level styles
│       ├── index.css                                    # Global styles
│       ├── firebase.js                                  # Firebase Auth initialization
│       ├── assets/
│       │   └── hero.png                                 # Landing page hero image
│       └── components/
│           ├── Auth.jsx                                 # Login / Signup component
│           ├── Onboarding.jsx                           # Multi-step profile builder
│           ├── Dashboard.jsx                            # Match results & profile tracker
│           ├── Connections.jsx                          # Network & request management
│           └── StudyRoom.jsx                            # Video study room launcher
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

| Tool | Version | Download |
|---|---|---|
| **Java JDK** | 17+ | [adoptium.net](https://adoptium.net/) |
| **Maven** | 3.8+ | [maven.apache.org](https://maven.apache.org/download.cgi) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **PostgreSQL** | 14+ | [postgresql.org](https://www.postgresql.org/download/) |

---

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Krishna4907/Study-Squad.git
   cd Study-Squad/backend
   ```

2. **Create the PostgreSQL database:**

   ```sql
   CREATE DATABASE studysquad;
   ```

3. **Configure database credentials:**

   Open `src/main/resources/application.properties` and update the database connection settings to match your local PostgreSQL instance:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/studysquad
   spring.datasource.username=your_postgres_username
   spring.datasource.password=your_postgres_password
   ```

4. **Build and run the backend:**

   ```bash
   mvn spring-boot:run
   ```

   The API server will start at **`http://localhost:8080`**. JPA/Hibernate will auto-generate the required database tables on first run.

---

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd Study-Squad/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at **`http://localhost:5173`**.

> **Note:** The frontend expects the backend API to be running at `http://localhost:8080`. Ensure the backend is started before using the application.

---

## 🔌 API Reference

### Profile Management

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/profile` | Create or update a user study profile |
| `POST` | `/api/matches` | Get AI-ranked study partner matches for a user |

### Connection Management

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/connections/send` | Send a study partner connection request |
| `GET` | `/api/connections/pending/{firebaseUid}` | Get all pending incoming requests for a user |
| `POST` | `/api/connections/respond` | Accept or reject a connection request |
| `GET` | `/api/connections/network/{firebaseUid}` | Get all accepted study partners (network) |

### Request / Response Examples

<details>
<summary><strong>POST /api/profile</strong> — Save a user profile</summary>

**Request Body:**
```json
{
  "firebaseUid": "abc123xyz",
  "name": "John Doe",
  "yearOfStudy": "3rd Year",
  "branch": "Computer Science",
  "courses": ["Data Structures", "Operating Systems", "DBMS"],
  "learningStyle": "Visual",
  "scheduleFocus": "Evening",
  "sessionLength": "2 hours",
  "availability": "Weekdays",
  "goals": "Exam preparation"
}
```

**Response:** `200 OK` — `"Profile saved successfully to Database!"`

</details>

<details>
<summary><strong>POST /api/connections/send</strong> — Send a connection request</summary>

**Request Body:**
```json
{
  "senderFirebaseUid": "abc123xyz",
  "receiverId": "42",
  "message": "Hey! Let's study Data Structures together."
}
```

**Response:** `200 OK` — `"Request sent successfully"`

</details>

---

## 🧠 Matching Algorithm

The **MatchingService** implements a weighted scoring system to calculate compatibility between students. The algorithm evaluates three key dimensions:

| Factor | Weight | Criteria |
|---|---|---|
| **Shared Courses** | 40 pts | At least one common course (mandatory for any match) |
| **Schedule Alignment** | 30 pts | Same availability = full score; same focus period = half score |
| **Learning Style** | 30 pts | Identical style = full score; complementary styles = partial score |

**Total Score: 0–100** (displayed as a compatibility percentage)

### Algorithm Flow

```text
For each registered user (excluding self):
  1. Calculate shared courses          → +40 if overlap exists
  2. Compare availability/schedule     → +30 (exact) or +15 (partial)
  3. Compare learning style            → +30 (same) or +10 (complementary)
  4. Filter: must share ≥ 1 course
  5. Sort results by descending score
  → Return ranked MatchResult list
```

---


---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m "Add your feature"`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. **Open** a Pull Request

Please ensure your code follows the existing code style and includes relevant documentation.

---

## 📄 License

This project is open source and available for educational purposes.
