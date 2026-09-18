import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import FaceRegistration from './pages/FaceRegistration';
import FaceRecognition from './pages/FaceRecognition';
import Employees from './pages/Employees';
import AttendanceRecords from './pages/AttendanceRecords';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/face-registration" element={<Layout><FaceRegistration /></Layout>} />
        <Route path="/face-recognition" element={<Layout><FaceRecognition /></Layout>} />
        <Route path="/employees" element={<Layout><Employees /></Layout>} />
        <Route path="/attendance" element={<Layout><AttendanceRecords /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
