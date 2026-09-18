# 🧠 FaceTrack AI - Intelligent Attendance System

A production-ready AI-powered attendance management system using real face recognition technology, built with React, FastAPI, PostgreSQL with pgvector, and Docker.

![FaceTrack AI](https://img.shields.io/badge/FaceTrack-AI-blue)
![React](https://img.shields.io/badge/React-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+pgvector-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 🌟 Features

### Core Features
- 🎯 **AI Face Recognition** - Real-time face detection with 96%+ accuracy using 128-d embeddings
- ⚡ **Instant Attendance** - Automatic check-in/out with sub-100ms recognition speed
- 🔐 **Enterprise Security** - JWT authentication, bcrypt hashing, encrypted embeddings
- 📊 **Smart Analytics** - Real-time dashboards, department insights, trend analysis
- 👥 **Team Management** - Employee directory, department management, registration workflows
- 📱 **Responsive Design** - Mobile-first approach with adaptive layouts
- 🌙 **Dark Mode** - Full dark mode support across all pages
- 📤 **Data Export** - CSV and JSON export for attendance records

### Technical Features
- Code splitting with lazy loading
- Form validation with Zod schemas
- Toast notifications for user feedback
- Error boundaries for graceful error handling
- Loading skeletons for better UX
- Real camera integration via WebRTC
- Zustand for state management
- Recharts for data visualization
- Framer Motion for animations

## 📸 Screenshots

### Landing Page
Modern landing page with animated hero section, feature showcase, and statistics display.

### Dashboard
Real-time attendance stats with interactive charts (bar, pie, area, line), recent activity feed, and system status indicators.

### Face Registration
4-step wizard: Select Employee → Capture Face → Process Embeddings → Complete

### Face Recognition
Live camera feed with real-time face detection, match confidence display, and scan history.

### Employee Management
Full CRUD operations with search, filter, and department management.

### Attendance Records
Daily attendance view with filters, confidence scores, and CSV/JSON export.

### Reports
Comprehensive analytics with department comparison, monthly trends, top performers, and key insights.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.10+ (for backend)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/facetrack-ai.git
cd facetrack-ai

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:8080
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Default Credentials
- **Email**: admin@company.com
- **Password**: admin123

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                    │
│                    (Port 80/443)                          │
└────────────────────┬────────────────────┬───────────────┘
                     │                    │
        ┌────────────▼──────┐  ┌─────────▼──────────┐
        │    Frontend       │  │     Backend API     │
        │   React + Vite    │  │    FastAPI + Uvicorn │
        │   (Port 8080)     │  │    (Port 8000)      │
        └───────────────────┘  └─────────┬──────────┘
                                          │
                    ┌─────────────────────┼───────────────┐
                    │                     │               │
           ┌────────▼──────┐   ┌─────────▼──────┐  ┌────▼─────┐
           │  PostgreSQL   │   │     Redis      │  │  Face    │
           │  + pgvector   │   │    Cache       │  │ Storage  │
           │  (Port 5432)  │   │  (Port 6379)   │  │          │
           └───────────────┘   └────────────────┘  └──────────┘
```

## 📁 Project Structure

```
facetrack-ai/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Layout.tsx    # App layout with sidebar
│   │   │   ├── Skeleton.tsx  # Loading skeletons
│   │   │   └── ErrorBoundary.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── FaceRegistration.tsx
│   │   │   ├── FaceRecognition.tsx
│   │   │   ├── Employees.tsx
│   │   │   ├── AttendanceRecords.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── store/            # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── themeStore.ts
│   │   ├── services/         # API service layer
│   │   │   └── api.ts
│   │   ├── hooks/            # Custom hooks
│   │   │   └── useCamera.ts
│   │   ├── data/             # Mock data
│   │   │   └── mockData.ts
│   │   ├── utils/            # Utility functions
│   │   │   └── helpers.ts
│   │   ├── types.ts          # TypeScript types
│   │   ├── App.tsx           # Main app component
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── config.py         # Configuration
│   │   ├── database.py       # DB connection
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routers/          # API endpoints
│   │   ├── services/         # Business logic
│   │   │   ├── face_service.py
│   │   │   ├── auth_service.py
│   │   │   └── attendance_service.py
│   │   └── middleware/       # Auth, rate limiting
│   ├── tests/                # Test suite
│   ├── init.sql              # Database initialization
│   ├── requirements.txt
│   └── Dockerfile
│
├── nginx/
│   └── nginx.conf            # Reverse proxy config
│
├── docs/
│   └── BACKEND_ARCHITECTURE.md
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login with credentials |
| POST | /api/auth/register | Register new user |
| POST | /api/auth/refresh | Refresh JWT token |
| POST | /api/auth/logout | Logout user |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | List all employees |
| GET | /api/employees/{id} | Get employee by ID |
| POST | /api/employees | Create employee |
| PUT | /api/employees/{id} | Update employee |
| DELETE | /api/employees/{id} | Delete employee |

### Face Recognition
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/faces/register | Register face embedding |
| POST | /api/faces/recognize | Recognize face from image |
| GET | /api/faces/samples/{id} | Get face samples |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/attendance | Get attendance records |
| POST | /api/attendance/check-in | Mark check-in |
| POST | /api/attendance/check-out | Mark check-out |
| GET | /api/attendance/export | Export data |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/dashboard | Dashboard statistics |
| GET | /api/reports/department | Department stats |
| GET | /api/reports/monthly | Monthly trends |

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm run test
```

## 📊 Performance Metrics

| Operation | Time | Notes |
|-----------|------|-------|
| Face Detection | ~50ms | HOG model |
| Face Encoding | ~100ms | ResNet-34 |
| Vector Search (1K) | ~5ms | pgvector index |
| Vector Search (100K) | ~50ms | GPU-accelerated |
| API Response | <100ms | FastAPI async |
| Page Load | <2s | Code-split bundles |

## 🔒 Security

- JWT authentication with 24h expiry
- bcrypt password hashing
- Rate limiting (100 req/min)
- CORS configuration
- Input validation (Pydantic/Zod)
- SQL injection prevention
- XSS protection headers
- HTTPS-ready configuration

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Environment Variables

See `.env.example` for all available configuration options.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [face_recognition](https://github.com/ageitgey/face_recognition) - Face recognition library
- [pgvector](https://github.com/pgvector/pgvector) - PostgreSQL vector extension
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

For support, email support@facetrack.ai or join our Slack channel.

---

Built with ❤️ by the FaceTrack AI Team
