export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  joinDate: string;
  faceRegistered: boolean;
  faceSamples: number;
  avatar: string;
  status: 'active' | 'inactive';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'late' | 'absent' | 'half-day';
  confidence: number;
  method: 'face' | 'manual';
}

export interface Department {
  id: string;
  name: string;
  employeeCount: number;
  attendanceRate: number;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
  attendanceRate: number;
  avgConfidence: number;
}

export interface FaceSample {
  id: string;
  timestamp: string;
  quality: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface ScanResult {
  id: string;
  employeeName: string;
  employeeId: string;
  timestamp: string;
  confidence: number;
  status: 'success' | 'failed';
}
