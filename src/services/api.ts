import { Employee, AttendanceRecord } from '../types';
import { employees as mockEmployees, attendanceRecords as mockAttendance } from '../data/mockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> => {
    await delay(1000);
    if (email === 'admin@company.com' && password === 'admin123') {
      return {
        success: true,
        data: {
          user: {
            id: 'USR-001',
            email,
            name: 'Admin User',
            role: 'admin',
          },
          token: 'mock-jwt-' + Date.now(),
        },
      };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  register: async (name: string, email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> => {
    await delay(1000);
    return {
      success: true,
      data: {
        user: {
          id: 'USR-' + Date.now(),
          email,
          name,
          role: 'employee',
        },
        token: 'mock-jwt-' + Date.now(),
      },
    };
  },
};

// Employees API
export const employeesApi = {
  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    await delay(500);
    return { success: true, data: mockEmployees };
  },

  getById: async (id: string): Promise<ApiResponse<Employee>> => {
    await delay(300);
    const employee = mockEmployees.find(e => e.id === id);
    if (employee) {
      return { success: true, data: employee };
    }
    return { success: false, error: 'Employee not found' };
  },

  create: async (data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    await delay(800);
    const newEmployee: Employee = {
      id: `EMP-${String(mockEmployees.length + 1).padStart(4, '0')}`,
      name: data.name || '',
      email: data.email || '',
      department: data.department || '',
      position: data.position || '',
      phone: data.phone || '',
      joinDate: new Date().toISOString().split('T')[0],
      faceRegistered: false,
      faceSamples: 0,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || '')}&background=3b82f6&color=fff`,
      status: 'active',
    };
    return { success: true, data: newEmployee, message: 'Employee created successfully' };
  },

  update: async (id: string, data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    await delay(600);
    const employee = mockEmployees.find(e => e.id === id);
    if (employee) {
      return { success: true, data: { ...employee, ...data }, message: 'Employee updated successfully' };
    }
    return { success: false, error: 'Employee not found' };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);
    return { success: true, message: 'Employee deleted successfully' };
  },
};

// Attendance API
export const attendanceApi = {
  getAll: async (filters?: { date?: string; department?: string; status?: string }): Promise<ApiResponse<AttendanceRecord[]>> => {
    await delay(500);
    let records = [...mockAttendance];
    
    if (filters?.date) {
      records = records.filter(r => r.date === filters.date);
    }
    if (filters?.department && filters.department !== 'all') {
      records = records.filter(r => r.department === filters.department);
    }
    if (filters?.status && filters.status !== 'all') {
      records = records.filter(r => r.status === filters.status);
    }
    
    return { success: true, data: records };
  },

  markAttendance: async (employeeId: string, type: 'check-in' | 'check-out'): Promise<ApiResponse<AttendanceRecord>> => {
    await delay(800);
    const now = new Date();
    const record: AttendanceRecord = {
      id: 'ATT-' + Date.now(),
      employeeId,
      employeeName: 'Employee Name',
      department: 'Department',
      date: now.toISOString().split('T')[0],
      checkIn: type === 'check-in' ? now.toTimeString().slice(0, 5) : null,
      checkOut: type === 'check-out' ? now.toTimeString().slice(0, 5) : null,
      status: 'present',
      confidence: 96.5,
      method: 'face',
    };
    return { success: true, data: record, message: 'Attendance marked successfully' };
  },

  exportCSV: async (records: AttendanceRecord[]): Promise<Blob> => {
    await delay(500);
    const csv = [
      'Employee ID,Name,Department,Date,Check In,Check Out,Status,Confidence',
      ...records.map(r => `${r.employeeId},${r.employeeName},${r.department},${r.date},${r.checkIn || ''},${r.checkOut || ''},${r.status},${r.confidence}`)
    ].join('\n');
    
    return new Blob([csv], { type: 'text/csv' });
  },

  exportPDF: async (records: AttendanceRecord[]): Promise<Blob> => {
    await delay(500);
    // In real implementation, this would generate a PDF
    // For now, return empty blob
    return new Blob([], { type: 'application/pdf' });
  },
};

// Face Recognition API
export const faceApi = {
  registerFace: async (employeeId: string, imageData: string): Promise<ApiResponse<{ embedding: number[] }>> => {
    await delay(1500);
    // Simulate generating 128-d embedding
    const embedding = Array.from({ length: 128 }, () => Math.random());
    return {
      success: true,
      data: { embedding },
      message: 'Face registered successfully',
    };
  },

  recognizeFace: async (imageData: string): Promise<ApiResponse<{ employeeId: string; confidence: number }>> => {
    await delay(800);
    const success = Math.random() > 0.1;
    if (success) {
      const randomEmployee = mockEmployees[Math.floor(Math.random() * mockEmployees.length)];
      return {
        success: true,
        data: {
          employeeId: randomEmployee.id,
          confidence: Math.random() * 5 + 95,
        },
      };
    }
    return { success: false, error: 'No match found' };
  },

  getFaceSamples: async (employeeId: string): Promise<ApiResponse<{ count: number; quality: number }>> => {
    await delay(400);
    const employee = mockEmployees.find(e => e.id === employeeId);
    if (employee && employee.faceRegistered) {
      return {
        success: true,
        data: {
          count: employee.faceSamples,
          quality: 95.5,
        },
      };
    }
    return { success: false, error: 'No face samples found' };
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<any>> => {
    await delay(400);
    return {
      success: true,
      data: {
        totalEmployees: 48,
        presentToday: 42,
        lateToday: 3,
        absentToday: 3,
        attendanceRate: 94.2,
        avgConfidence: 96.8,
      },
    };
  },

  getRecentActivity: async (): Promise<ApiResponse<any[]>> => {
    await delay(300);
    return {
      success: true,
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i,
        type: 'attendance',
        message: `Employee checked in`,
        timestamp: new Date(Date.now() - i * 300000).toISOString(),
      })),
    };
  },
};

// Reports API
export const reportsApi = {
  getDepartmentStats: async (): Promise<ApiResponse<any[]>> => {
    await delay(500);
    return {
      success: true,
      data: [
        { department: 'Engineering', attendance: 95, employees: 12 },
        { department: 'Marketing', attendance: 92, employees: 8 },
        { department: 'Sales', attendance: 89, employees: 10 },
        { department: 'HR', attendance: 96, employees: 6 },
        { department: 'Finance', attendance: 94, employees: 7 },
        { department: 'Design', attendance: 91, employees: 5 },
      ],
    };
  },

  getMonthlyTrend: async (): Promise<ApiResponse<any[]>> => {
    await delay(400);
    return {
      success: true,
      data: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
        rate: Math.floor(Math.random() * 8) + 88,
        confidence: Math.floor(Math.random() * 5) + 93,
      })),
    };
  },
};
