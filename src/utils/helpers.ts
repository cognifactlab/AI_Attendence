import { AttendanceRecord } from '../types';

export function exportToCSV(records: AttendanceRecord[], filename: string = 'attendance_export') {
  const headers = ['Employee ID', 'Name', 'Department', 'Date', 'Check In', 'Check Out', 'Status', 'Confidence'];
  const rows = records.map(r => [
    r.employeeId,
    r.employeeName,
    r.department,
    r.date,
    r.checkIn || '',
    r.checkOut || '',
    r.status,
    r.confidence.toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportToJSON(records: AttendanceRecord[], filename: string = 'attendance_export') {
  const jsonContent = JSON.stringify(records, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  downloadBlob(blob, `${filename}_${new Date().toISOString().split('T')[0]}.json`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function captureImageFromVideo(videoElement: HTMLVideoElement): string | null {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(videoElement, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.8);
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 95) return 'text-accent-600';
  if (confidence >= 85) return 'text-amber-600';
  return 'text-red-600';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'present': return 'bg-accent-50 text-accent-700';
    case 'late': return 'bg-amber-50 text-amber-700';
    case 'absent': return 'bg-red-50 text-red-700';
    case 'half-day': return 'bg-blue-50 text-blue-700';
    default: return 'bg-surface-50 text-surface-700';
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeString: string): string {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
