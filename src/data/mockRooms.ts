export interface Room {
  id: string;
  roomNumber: string;
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Penthouse';
  floor: string;
  status: 'Available' | 'Occupied' | 'Dirty' | 'Maintenance' | 'Reserved';
  amenities: string[];
  price: number;
  lastCleaned: string;
}

export const mockRooms: Room[] = [
  {
    id: 'R-101',
    roomNumber: '101',
    type: 'Standard',
    floor: '1st Floor',
    status: 'Available',
    amenities: ['Wi-Fi', 'TV', 'Mini Bar'],
    price: 150,
    lastCleaned: '2026-03-09T10:00:00Z',
  },
  {
    id: 'R-102',
    roomNumber: '102',
    type: 'Standard',
    floor: '1st Floor',
    status: 'Occupied',
    amenities: ['Wi-Fi', 'TV', 'Mini Bar'],
    price: 150,
    lastCleaned: '2026-03-08T09:00:00Z',
  },
  {
    id: 'R-105',
    roomNumber: '105',
    type: 'Deluxe',
    floor: '1st Floor',
    status: 'Occupied',
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Ocean View'],
    price: 280,
    lastCleaned: '2026-03-08T11:00:00Z',
  },
  {
    id: 'R-202',
    roomNumber: '202',
    type: 'Standard',
    floor: '2nd Floor',
    status: 'Dirty',
    amenities: ['Wi-Fi', 'TV', 'Mini Bar'],
    price: 150,
    lastCleaned: '2026-03-07T14:00:00Z',
  },
  {
    id: 'R-302',
    roomNumber: '302',
    type: 'Suite',
    floor: '3rd Floor',
    status: 'Maintenance',
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Kitchenette', 'Living Area'],
    price: 450,
    lastCleaned: '2026-03-05T10:00:00Z',
  },
  {
    id: 'R-402',
    roomNumber: '402',
    type: 'Suite',
    floor: '4th Floor',
    status: 'Occupied',
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Kitchenette', 'Living Area', 'Balcony'],
    price: 550,
    lastCleaned: '2026-03-09T08:00:00Z',
  },
  {
    id: 'R-405',
    roomNumber: '405',
    type: 'Suite',
    floor: '4th Floor',
    status: 'Reserved',
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Kitchenette', 'Living Area', 'Balcony'],
    price: 550,
    lastCleaned: '2026-03-09T12:00:00Z',
  },
  {
    id: 'R-P01',
    roomNumber: 'P01',
    type: 'Penthouse',
    floor: 'Penthouse',
    status: 'Available',
    amenities: ['Private Pool', 'Butler Service', 'Panoramic View', 'Full Kitchen'],
    price: 1200,
    lastCleaned: '2026-03-09T15:00:00Z',
  },
];
