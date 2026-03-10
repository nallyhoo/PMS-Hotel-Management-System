export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'on-leave' | 'inactive';
  joinDate: string;
  avatar?: string;
}

export const mockStaff: Staff[] = [
  {
    id: 'STF-001',
    name: 'Alexander Wright',
    email: 'alexander.w@grandview.com',
    phone: '+1 (555) 111-2222',
    role: 'General Manager',
    department: 'Management',
    status: 'active',
    joinDate: '2020-01-15',
  },
  {
    id: 'STF-002',
    name: 'Elena Rodriguez',
    email: 'elena.r@grandview.com',
    phone: '+1 (555) 222-3333',
    role: 'Front Office Manager',
    department: 'Front Office',
    status: 'active',
    joinDate: '2021-03-10',
  },
  {
    id: 'STF-003',
    name: 'Marcus Chen',
    email: 'marcus.c@grandview.com',
    phone: '+1 (555) 333-4444',
    role: 'Executive Housekeeper',
    department: 'Housekeeping',
    status: 'active',
    joinDate: '2021-06-22',
  },
  {
    id: 'STF-004',
    name: 'Sarah Jenkins',
    email: 'sarah.j@grandview.com',
    phone: '+1 (555) 444-5555',
    role: 'Maintenance Supervisor',
    department: 'Maintenance',
    status: 'on-leave',
    joinDate: '2022-02-01',
  },
  {
    id: 'STF-005',
    name: 'David Miller',
    email: 'david.m@grandview.com',
    phone: '+1 (555) 555-6666',
    role: 'Receptionist',
    department: 'Front Office',
    status: 'active',
    joinDate: '2023-08-15',
  },
];

export interface StaffSchedule {
  id: string;
  staffId: string;
  day: string;
  shift: string;
  startTime: string;
  endTime: string;
}

export const mockSchedules: StaffSchedule[] = [
  { id: 'SCH-001', staffId: 'STF-005', day: 'Monday', shift: 'Morning', startTime: '07:00', endTime: '15:00' },
  { id: 'SCH-002', staffId: 'STF-005', day: 'Tuesday', shift: 'Morning', startTime: '07:00', endTime: '15:00' },
  { id: 'SCH-003', staffId: 'STF-002', day: 'Monday', shift: 'Day', startTime: '09:00', endTime: '17:00' },
];

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'late' | 'absent';
}

export const mockAttendance: AttendanceRecord[] = [
  { id: 'ATT-001', staffId: 'STF-005', date: '2024-03-09', checkIn: '06:55', checkOut: '15:05', status: 'present' },
  { id: 'ATT-002', staffId: 'STF-002', date: '2024-03-09', checkIn: '09:15', checkOut: '17:00', status: 'late' },
];
