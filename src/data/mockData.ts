import { Employee, AttendanceRecord, Department, DashboardStats, ScanResult } from '../types';

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Operations'];
const positions = ['Manager', 'Senior Developer', 'Developer', 'Analyst', 'Designer', 'Coordinator', 'Lead', 'Director'];
const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Ashley', 'William', 'Amanda', 'Daniel', 'Stephanie', 'Christopher', 'Nicole', 'Matthew', 'Jennifer', 'Andrew', 'Elizabeth', 'Joshua', 'Lauren'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function generateAvatar(name: string): string {
  const colors = ['3b82f6', '8b5cf6', 'ec4899', 'f59e0b', '10b981', '06b6d4', '6366f1', 'f43f5e'];
  const color = colors[name.length % colors.length];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128&bold=true`;
}

export const employees: Employee[] = Array.from({ length: 48 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  const name = `${firstName} ${lastName}`;
  const dept = departments[i % departments.length];
  const faceRegistered = Math.random() > 0.2;
  return {
    id: `EMP-${String(i + 1).padStart(4, '0')}`,
    name,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    department: dept,
    position: randomFrom(positions),
    phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    faceRegistered,
    faceSamples: faceRegistered ? Math.floor(Math.random() * 8) + 3 : 0,
    avatar: generateAvatar(name),
    status: Math.random() > 0.1 ? 'active' : 'inactive',
  };
});

export const departments_list: Department[] = departments.map((name, i) => ({
  id: `DEPT-${String(i + 1).padStart(3, '0')}`,
  name,
  employeeCount: employees.filter(e => e.department === name).length,
  attendanceRate: Math.floor(Math.random() * 15) + 85,
}));

function generateAttendanceRecord(emp: Employee, date: string): AttendanceRecord {
  const statuses: AttendanceRecord['status'][] = ['present', 'present', 'present', 'present', 'late', 'absent', 'half-day'];
  const status = randomFrom(statuses);
  const hour = status === 'late' ? 9 + Math.floor(Math.random() * 2) : 8 + Math.floor(Math.random() * 1);
  const min = Math.floor(Math.random() * 60);
  const checkIn = status === 'absent' ? null : `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  const outHour = 17 + Math.floor(Math.random() * 2);
  const checkOut = status === 'absent' ? null : `${String(outHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
  
  return {
    id: generateId(),
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    date,
    checkIn,
    checkOut,
    status,
    confidence: status === 'absent' ? 0 : Math.floor(Math.random() * 10) + 90,
    method: 'face',
  };
}

const today = new Date();
export const attendanceRecords: AttendanceRecord[] = [];

for (let d = 0; d < 30; d++) {
  const date = new Date(today);
  date.setDate(date.getDate() - d);
  const dateStr = date.toISOString().split('T')[0];
  
  if (date.getDay() === 0 || date.getDay() === 6) continue;
  
  employees.forEach(emp => {
    if (emp.status === 'active') {
      attendanceRecords.push(generateAttendanceRecord(emp, dateStr));
    }
  });
}

export const dashboardStats: DashboardStats = {
  totalEmployees: employees.filter(e => e.status === 'active').length,
  presentToday: Math.floor(employees.filter(e => e.status === 'active').length * 0.88),
  lateToday: Math.floor(employees.filter(e => e.status === 'active').length * 0.07),
  absentToday: Math.floor(employees.filter(e => e.status === 'active').length * 0.05),
  attendanceRate: 94.2,
  avgConfidence: 96.8,
};

export const recentScans: ScanResult[] = Array.from({ length: 15 }, (_, i) => {
  const emp = randomFrom(employees.filter(e => e.faceRegistered));
  const success = Math.random() > 0.1;
  const time = new Date();
  time.setMinutes(time.getMinutes() - i * 3);
  return {
    id: generateId(),
    employeeName: emp.name,
    employeeId: emp.id,
    timestamp: time.toISOString(),
    confidence: success ? Math.floor(Math.random() * 8) + 92 : 0,
    status: success ? 'success' : 'failed',
  };
});

export const weeklyData = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(today);
  date.setDate(date.getDate() - (6 - i));
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    present: Math.floor(Math.random() * 10) + 38,
    late: Math.floor(Math.random() * 5) + 2,
    absent: Math.floor(Math.random() * 4) + 1,
  };
});

export const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
  rate: Math.floor(Math.random() * 8) + 88,
  confidence: Math.floor(Math.random() * 5) + 93,
}));

export const departmentStats = departments.map(name => ({
  department: name,
  attendance: Math.floor(Math.random() * 12) + 85,
  employees: employees.filter(e => e.department === name).length,
}));
