export interface RoomType {
  id: string;
  name: string;
  code: string;
  basePrice: number;
  capacity: {
    adults: number;
    children: number;
  };
  totalRooms: number;
  amenities: string[];
  description: string;
  images: string[];
}

export const mockRoomTypes: RoomType[] = [
  {
    id: 'RT-STD',
    name: 'Standard Room',
    code: 'STD',
    basePrice: 150,
    capacity: { adults: 2, children: 1 },
    totalRooms: 45,
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Air Conditioning'],
    description: 'Comfortable and efficient, our Standard Rooms offer everything you need for a pleasant stay.',
    images: ['https://picsum.photos/seed/std1/800/600', 'https://picsum.photos/seed/std2/800/600'],
  },
  {
    id: 'RT-DLX',
    name: 'Deluxe Room',
    code: 'DLX',
    basePrice: 280,
    capacity: { adults: 2, children: 2 },
    totalRooms: 30,
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Air Conditioning', 'Ocean View', 'Coffee Maker'],
    description: 'Spacious rooms with premium finishes and stunning views of the surrounding landscape.',
    images: ['https://picsum.photos/seed/dlx1/800/600', 'https://picsum.photos/seed/dlx2/800/600'],
  },
  {
    id: 'RT-SUI',
    name: 'Executive Suite',
    code: 'SUI',
    basePrice: 450,
    capacity: { adults: 3, children: 2 },
    totalRooms: 15,
    amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Air Conditioning', 'Living Area', 'Kitchenette', 'Balcony'],
    description: 'Our Executive Suites provide a separate living area and upgraded amenities for the discerning traveler.',
    images: ['https://picsum.photos/seed/sui1/800/600', 'https://picsum.photos/seed/sui2/800/600'],
  },
  {
    id: 'RT-PNT',
    name: 'Presidential Penthouse',
    code: 'PNT',
    basePrice: 1200,
    capacity: { adults: 4, children: 2 },
    totalRooms: 2,
    amenities: ['Private Pool', 'Butler Service', 'Panoramic View', 'Full Kitchen', 'Home Theater'],
    description: 'The pinnacle of luxury. Our Penthouse offers unparalleled space, privacy, and bespoke service.',
    images: ['https://picsum.photos/seed/pnt1/800/600', 'https://picsum.photos/seed/pnt2/800/600'],
  },
];
