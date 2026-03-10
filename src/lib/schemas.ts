import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const reservationSchema = z.object({
  guestId: z.number().min(1, 'Guest is required'),
  roomTypeId: z.number().min(1, 'Room type is required'),
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  adults: z.number().min(1, 'At least 1 adult is required').max(10),
  children: z.number().min(0).max(10),
  bookingSource: z.string().min(1, 'Booking source is required'),
  specialRequests: z.string().optional(),
  totalAmount: z.number().min(0, 'Total amount must be positive'),
  depositAmount: z.number().min(0).optional(),
  depositPaid: z.boolean().optional(),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

export const guestSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone number is required').max(20),
  nationality: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  vipStatus: z.string().optional(),
  notes: z.string().optional(),
});

export type GuestFormData = z.infer<typeof guestSchema>;

export const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required').max(10),
  roomTypeId: z.number().min(1, 'Room type is required'),
  floorId: z.number().min(1, 'Floor is required'),
  status: z.enum(['Available', 'Occupied', 'Dirty', 'Maintenance', 'Reserved', 'Blocked']),
  notes: z.string().optional(),
});

export type RoomFormData = z.infer<typeof roomSchema>;

export const staffSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone number is required').max(20),
  position: z.string().min(1, 'Position is required'),
  departmentId: z.number().min(1, 'Department is required'),
  hireDate: z.string().min(1, 'Hire date is required'),
  salary: z.number().min(0).optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;

export const serviceSchema = z.object({
  serviceName: z.string().min(1, 'Service name is required').max(100),
  categoryId: z.number().min(1, 'Category is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  priceType: z.enum(['Fixed', 'Per Person', 'Per Hour', 'Per Unit']),
  isAvailable: z.boolean().optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const inventoryItemSchema = z.object({
  itemName: z.string().min(1, 'Item name is required').max(100),
  categoryId: z.number().min(1, 'Category is required'),
  unitId: z.number().min(1, 'Unit is required'),
  sku: z.string().optional(),
  reorderLevel: z.number().min(0).optional(),
  currentStock: z.number().min(0),
  unitCost: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
