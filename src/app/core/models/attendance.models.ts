export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave' | 'Holiday' | 'Weekend';

export interface AttendanceRecord {
  id?: string;
  employeeId?: string;
  date: string;
  in: string | null;
  out: string | null;
  status: AttendanceStatus;
  notes?: string | null;
  workHours?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRequest {
  employeeId: string;
  date: string;
  in?: string | null;
  out?: string | null;
  status: AttendanceStatus;
  notes?: string | null;
}

export interface CalendarDay {
  dayNumber: number | null;
  dateString: string | null;
  record: AttendanceRecord | null;
  isToday: boolean;
}
