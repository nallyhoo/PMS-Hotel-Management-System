export interface Reservation {
  id: string;
  guestName: string;
  roomType: string;
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'Pending';
  amount: number;
  source: 'Website' | 'Booking.com' | 'Expedia' | 'Direct';
  createdAt: string;
}

export const mockReservations: Reservation[] = [
  {
    id: 'RES-001',
    guestName: 'Julianne Moore',
    roomType: 'Suite',
    roomNumber: '402',
    checkIn: '2026-03-10',
    checkOut: '2026-03-15',
    status: 'Checked In',
    amount: 1250,
    source: 'Website',
    createdAt: '2026-03-01',
  },
  {
    id: 'RES-002',
    guestName: 'Robert De Niro',
    roomType: 'Deluxe',
    roomNumber: '105',
    checkIn: '2026-03-09',
    checkOut: '2026-03-12',
    status: 'Checked In',
    amount: 840,
    source: 'Booking.com',
    createdAt: '2026-03-05',
  },
  {
    id: 'RES-003',
    guestName: 'Meryl Streep',
    roomType: 'Penthouse',
    roomNumber: '01',
    checkIn: '2026-03-10',
    checkOut: '2026-03-20',
    status: 'Confirmed',
    amount: 5500,
    source: 'Direct',
    createdAt: '2026-03-08',
  },
  {
    id: 'RES-004',
    guestName: 'Al Pacino',
    roomType: 'Standard',
    roomNumber: '202',
    checkIn: '2026-03-08',
    checkOut: '2026-03-10',
    status: 'Checked Out',
    amount: 450,
    source: 'Expedia',
    createdAt: '2026-03-02',
  },
  {
    id: 'RES-005',
    guestName: 'Leonardo DiCaprio',
    roomType: 'Suite',
    roomNumber: '405',
    checkIn: '2026-03-12',
    checkOut: '2026-03-18',
    status: 'Confirmed',
    amount: 1800,
    source: 'Website',
    createdAt: '2026-03-07',
  },
  {
    id: 'RES-006',
    guestName: 'Cate Blanchett',
    roomType: 'Deluxe',
    checkIn: '2026-03-15',
    checkOut: '2026-03-20',
    status: 'Pending',
    amount: 1100,
    source: 'Booking.com',
    createdAt: '2026-03-09',
  },
  {
    id: 'RES-007',
    guestName: 'Brad Pitt',
    roomType: 'Standard',
    checkIn: '2026-03-20',
    checkOut: '2026-03-25',
    status: 'Cancelled',
    amount: 750,
    source: 'Direct',
    createdAt: '2026-03-01',
  }
];
