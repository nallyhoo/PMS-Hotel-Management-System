// ============================================================
// TypeScript Type Definitions for PMS
// Aligned with database schema
// ============================================================

// ============================================================
// 1. HOTEL CORE
// ============================================================

export interface Hotel {
  hotelId: number;
  hotelName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  timezone: string;
  createdDate: string;
  updatedDate: string;
}

export interface HotelBranch {
  branchId: number;
  hotelId: number;
  branchName: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdDate: string;
}

export interface Floor {
  floorId: number;
  branchId: number;
  floorNumber: number;
  floorName: string;
  description: string;
  createdDate: string;
}

// ============================================================
// 2. ROOM MANAGEMENT
// ============================================================

export interface RoomType {
  roomTypeId: number;
  typeName: string;
  description: string;
  capacity: number;
  basePrice: number;
  maxOccupancy: number;
  bedType: string;
  sizeSqFt: number;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface Room {
  roomId: number;
  branchId: number;
  roomNumber: string;
  roomTypeId: number;
  floorId: number;
  status: RoomStatus;
  currentReservationId: number | null;
  cleaningStatus: CleaningStatus;
  notes: string;
  lastCleaned: string | null;
  createdDate: string;
  updatedDate: string;
}

export type RoomStatus = 'Available' | 'Occupied' | 'Dirty' | 'Maintenance' | 'Reserved' | 'Blocked';
export type CleaningStatus = 'Clean' | 'Dirty' | 'Cleaning' | 'Inspected';

export interface RoomAmenity {
  amenityId: number;
  amenityName: string;
  amenityType: string;
  description: string;
  icon: string;
}

export interface RoomTypeAmenity {
  id: number;
  roomTypeId: number;
  amenityId: number;
}

export interface RoomImage {
  imageId: number;
  roomTypeId: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  createdDate: string;
}

export interface RoomStatusHistory {
  statusId: number;
  roomId: number;
  status: RoomStatus;
  previousStatus: RoomStatus | null;
  startTime: string;
  endTime: string | null;
  notes: string;
  changedBy: number;
}

export interface RoomTypePricing {
  pricingId: number;
  roomTypeId: number;
  startDate: string;
  endDate: string;
  price: number;
  dayOfWeek: string;
  isActive: boolean;
  createdDate: string;
}

// ============================================================
// 3. GUEST MANAGEMENT
// ============================================================

export interface Guest {
  guestId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  vipStatus: VIPStatus;
  blacklistReason: string;
  marketingConsent: boolean;
  notes: string;
  createdDate: string;
  updatedDate: string;
}

export type VIPStatus = 'Regular' | 'Silver' | 'Gold' | 'Platinum' | 'Blacklist';

export interface GuestDocument {
  documentId: number;
  guestId: number;
  documentType: DocumentType;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  imageUrl: string;
  createdDate: string;
}

export type DocumentType = 'Passport' | 'ID Card' | 'Driver License' | 'Visa' | 'Other';

export interface GuestPreference {
  preferenceId: number;
  guestId: number;
  preferenceType: string;
  preferenceValue: string;
  notes: string;
}

export interface GuestLoyalty {
  loyaltyId: number;
  guestId: number;
  points: number;
  tierLevel: TierLevel;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  membershipStartDate: string;
  createdDate: string;
  updatedDate: string;
}

export type TierLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

// ============================================================
// 4. RESERVATION SYSTEM
// ============================================================

export interface Reservation {
  reservationId: number;
  guestId: number;
  branchId: number;
  reservationCode: string;
  checkInDate: string;
  checkOutDate: string;
  status: ReservationStatus;
  bookingSource: BookingSource;
  adults: number;
  children: number;
  specialRequests: string;
  totalAmount: number;
  depositAmount: number;
  depositPaid: boolean;
  assignedRoomId: number | null;
  confirmationDate: string;
  cancelledDate: string;
  cancelledBy: number;
  cancellationReason: string;
  createdBy: number;
  createdDate: string;
  updatedDate: string;
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'No Show';
export type BookingSource = 'Website' | 'Booking.com' | 'Expedia' | 'Direct' | 'Phone' | 'Walk-in' | 'Corporate';

export interface ReservationRoom {
  reservationRoomId: number;
  reservationId: number;
  roomId: number;
  roomTypeId: number;
  rate: number;
  adults: number;
  children: number;
  createdDate: string;
}

export interface ReservationGuest {
  id: number;
  reservationId: number;
  guestId: number;
  isPrimary: boolean;
  relationType: string;
}

export interface ReservationNote {
  noteId: number;
  reservationId: number;
  noteText: string;
  noteType: NoteType;
  createdBy: number;
  createdDate: string;
}

export type NoteType = 'General' | 'Special Request' | 'Complaint' | 'Compliment' | 'Internal';

export interface ReservationHistory {
  historyId: number;
  reservationId: number;
  action: string;
  previousStatus: ReservationStatus;
  newStatus: ReservationStatus;
  notes: string;
  actionDate: string;
  performedBy: number;
}

// ============================================================
// 5. CHECK-IN / CHECK-OUT
// ============================================================

export interface CheckIn {
  checkInId: number;
  reservationId: number;
  roomId: number;
  checkInDate: string;
  checkInTime: string;
  assignedRoom: string;
  keyCardNumber: string;
  checkInMethod: string;
  verifiedBy: number;
  notes: string;
  createdDate: string;
}

export interface CheckOut {
  checkOutId: number;
  reservationId: number;
  roomId: number;
  checkOutDate: string;
  checkOutTime: string;
  totalBill: number;
  paymentStatus: PaymentStatus;
  keyCardReturned: boolean;
  roomInspected: boolean;
  inspectionNotes: string;
  checkOutMethod: string;
  verifiedBy: number;
  notes: string;
  createdDate: string;
}

export type PaymentStatus = 'Pending' | 'Partial' | 'Paid' | 'Overdue' | 'Cancelled' | 'Refunded';

// ============================================================
// 6. BILLING & PAYMENTS
// ============================================================

export interface Invoice {
  invoiceId: number;
  reservationId: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  notes: string;
  createdBy: number;
  createdDate: string;
  updatedDate: string;
}

export type InvoiceStatus = 'Pending' | 'Partial' | 'Paid' | 'Overdue' | 'Cancelled' | 'Refunded';

export interface InvoiceItem {
  itemId: number;
  invoiceId: number;
  itemType: ItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
  referenceId: string;
  createdDate: string;
}

export type ItemType = 'Room' | 'Service' | 'Food' | 'Beverage' | 'Tax' | 'Discount' | 'Other';

export interface Payment {
  paymentId: number;
  invoiceId: number;
  reservationId: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  exchangeRate: number;
  referenceNumber: string;
  transactionId: string;
  cardLast4: string;
  cardType: string;
  status: PaymentTransactionStatus;
  notes: string;
  receivedBy: number;
  createdDate: string;
}

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Cheque' | 'Mobile Payment' | 'Gift Card';
export type PaymentTransactionStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded' | 'Partially Refunded';

export interface PaymentMethodSetting {
  methodId: number;
  methodName: string;
  methodType: string;
  isActive: boolean;
  createdDate: string;
}

export interface Refund {
  refundId: number;
  paymentId: number;
  refundAmount: number;
  refundDate: string;
  refundMethod: string;
  reason: string;
  status: RefundStatus;
  processedBy: number;
  notes: string;
  createdDate: string;
}

export type RefundStatus = 'Pending' | 'Approved' | 'Rejected' | 'Processed';

// ============================================================
// 7. SERVICES & POS
// ============================================================

export interface Service {
  serviceId: number;
  serviceName: string;
  categoryId: number;
  description: string;
  price: number;
  priceType: PriceType;
  isAvailable: boolean;
  imageUrl: string;
  createdDate: string;
  updatedDate: string;
}

export type PriceType = 'Fixed' | 'Per Person' | 'Per Hour' | 'Per Unit';

export interface ServiceCategory {
  categoryId: number;
  categoryName: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdDate: string;
}

export interface ServiceOrder {
  orderId: number;
  reservationId: number;
  roomId: number;
  orderType: OrderType;
  orderDate: string;
  status: OrderStatus;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  staffId: number;
  deliveryRoom: string;
  tableNumber: string;
  numberOfGuests: number;
  notes: string;
  createdDate: string;
  updatedDate: string;
}

export type OrderType = 'Restaurant' | 'Room Service' | 'Bar' | 'Spa' | 'Transport';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

export interface ServiceOrderItem {
  orderItemId: number;
  orderId: number;
  serviceId: number;
  quantity: number;
  unitPrice: number;
  amount: number;
  notes: string;
  status: string;
  createdDate: string;
}

// ============================================================
// 8. HOUSEKEEPING
// ============================================================

export interface HousekeepingTask {
  taskId: number;
  roomId: number;
  taskType: TaskType;
  assignedStaffId: number;
  status: TaskStatus;
  priority: Priority;
  scheduledDate: string;
  scheduledTime: string;
  startTime: string;
  endTime: string;
  notes: string;
  createdBy: number;
  createdDate: string;
  updatedDate: string;
}

export type TaskType = 'Standard Clean' | 'Deep Clean' | 'Turnover' | 'Inspection' | 'Special Request';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Verified' | 'Cancelled';
export type Priority = 'Low' | 'Normal' | 'High' | 'Urgent';

export interface HousekeepingStatus {
  statusId: number;
  roomId: number;
  cleaningStatus: CleaningStatus;
  lastCleaned: string;
  nextScheduledClean: string;
  updatedBy: number;
  updatedTime: string;
  notes: string;
}

export interface HousekeepingDashboard {
  pending: { count: number };
  inProgress: { count: number };
  completed: { count: number };
  dirtyRooms: { count: number };
}

export interface RoomStatusBoard {
  typeName: string;
  total: number;
  available: number;
  occupied: number;
  dirty: number;
  maintenance: number;
  reserved: number;
}

export interface CleaningLog {
  logId: number;
  roomId: number;
  staffId: number;
  taskId: number;
  cleaningType: string;
  startTime: string;
  endTime: string;
  status: string;
  suppliesUsed: string;
  notes: string;
  rating: number;
  createdDate: string;
}

// ============================================================
// 9. MAINTENANCE
// ============================================================

export interface MaintenanceRequest {
  requestId: number;
  roomId: number;
  requestType: MaintenanceType;
  priority: Priority;
  description: string;
  reportedBy: number;
  reportedDate: string;
  status: MaintenanceStatus;
  scheduledDate: string;
  estimatedCost: number;
  actualCost: number;
  notes: string;
}

export type MaintenanceType = 'Plumbing' | 'Electrical' | 'Furniture' | 'HVAC' | 'Appliance' | 'Structural' | 'Other';
export type MaintenanceStatus = 'Open' | 'In Progress' | 'Completed' | 'Closed' | 'Cancelled';

export interface MaintenanceTask {
  taskId: number;
  requestId: number;
  assignedStaffId: number;
  status: MaintenanceStatus;
  startDate: string;
  completionDate: string;
  notes: string;
  createdDate: string;
  updatedDate: string;
}

export interface MaintenanceHistory {
  historyId: number;
  requestId: number;
  taskId: number;
  updateDate: string;
  status: MaintenanceStatus;
  notes: string;
  updatedBy: number;
}

// ============================================================
// 10. STAFF & HR
// ============================================================

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUrl: string;
  position: string;
  departmentId: number;
  hireDate: string;
  employmentStatus: EmploymentStatus;
  salary: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  createdDate: string;
  updatedDate: string;
}

export type EmploymentStatus = 'Active' | 'On Leave' | 'Terminated' | 'Resigned';

export interface Department {
  departmentId: number;
  departmentName: string;
  description: string;
  managerId: number;
  isActive: boolean;
  createdDate: string;
}

export interface EmployeeDepartment {
  id: number;
  employeeId: number;
  departmentId: number;
  isPrimary: boolean;
  startDate: string;
  endDate: string;
}

export interface EmployeeSchedule {
  scheduleId: number;
  employeeId: number;
  shiftDate: string;
  shiftType: ShiftType;
  startTime: string;
  endTime: string;
  breakDuration: number;
  status: ScheduleStatus;
  notes: string;
  createdDate: string;
}

export type ShiftType = 'Morning' | 'Afternoon' | 'Night' | 'Split' | 'On-Call';
export type ScheduleStatus = 'Scheduled' | 'Completed' | 'Absent' | 'Cancelled';

export interface Attendance {
  attendanceId: number;
  employeeId: number;
  attendanceDate: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  overtimeHours: number;
  status: AttendanceStatus;
  lateMinutes: number;
  notes: string;
  createdDate: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave' | 'Holiday';

// ============================================================
// 11. INVENTORY MANAGEMENT
// ============================================================

export interface InventoryItem {
  itemId: number;
  itemName: string;
  sku: string;
  categoryId: number;
  description: string;
  unitOfMeasure: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  unitCost: number;
  unitPrice: number;
  location: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface InventoryCategory {
  categoryId: number;
  categoryName: string;
  description: string;
  parentCategoryId: number;
  isActive: boolean;
  createdDate: string;
}

export interface InventoryTransaction {
  transactionId: number;
  itemId: number;
  transactionType: TransactionType;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId: string;
  referenceType: string;
  transactionDate: string;
  notes: string;
  performedBy: number;
}

export type TransactionType = 'Purchase' | 'Sale' | 'Adjustment' | 'Transfer' | 'Return' | 'Damaged' | 'Expired';

export interface Supplier {
  supplierId: number;
  supplierName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxId: string;
  paymentTerms: string;
  notes: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface PurchaseOrder {
  purchaseId: number;
  supplierId: number;
  orderDate: string;
  expectedDeliveryDate: string;
  receivedDate: string;
  status: PurchaseStatus;
  totalAmount: number;
  notes: string;
  createdBy: number;
  createdDate: string;
}

export type PurchaseStatus = 'Pending' | 'Approved' | 'Ordered' | 'Received' | 'Cancelled';

export interface PurchaseOrderItem {
  id: number;
  purchaseId: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
  amount: number;
}

// ============================================================
// 12. REPORTING & ANALYTICS
// ============================================================

export interface DailyReport {
  reportId: number;
  branchId: number;
  reportDate: string;
  totalRevenue: number;
  roomRevenue: number;
  fbRevenue: number;
  otherRevenue: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  checkIns: number;
  checkOuts: number;
  noShows: number;
  createdDate: string;
}

export interface OccupancyReport {
  reportId: number;
  branchId: number;
  reportDate: string;
  occupancyRate: number;
  roomTypeOccupancy: string;
  averageDailyRate: number;
  revPAR: number;
  createdDate: string;
}

export interface RevenueReport {
  reportId: number;
  branchId: number;
  reportDate: string;
  roomRevenue: number;
  serviceRevenue: number;
  fbRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
  totalTax: number;
  totalDiscount: number;
  netRevenue: number;
  createdDate: string;
}

// ============================================================
// 13. SECURITY & SYSTEM
// ============================================================

export interface User {
  userId: number;
  employeeId: number;
  guestId: number;
  username: string;
  passwordHash: string;
  roleId: number;
  isActive: boolean;
  lastLogin: string;
  failedLoginAttempts: number;
  lockedUntil: string;
  mustChangePassword: boolean;
  passwordChangedDate: string;
  createdDate: string;
  updatedDate: string;
}

export interface Role {
  roleId: number;
  roleName: string;
  roleDescription: string;
  isSystemRole: boolean;
  isActive: boolean;
  createdDate: string;
}

export interface Permission {
  permissionId: number;
  permissionName: string;
  permissionCode: string;
  module: string;
  description: string;
  isActive: boolean;
  createdDate: string;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  isGranted: boolean;
  createdDate: string;
}

export interface ActivityLog {
  logId: number;
  userId: number;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  oldValue: string;
  newValue: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// ============================================================
// 14. SETTINGS & CONFIGURATION
// ============================================================

export interface TaxRate {
  taxRateId: number;
  taxName: string;
  taxCode: string;
  rate: number;
  taxType: TaxType;
  country: string;
  isActive: boolean;
  isDefault: boolean;
  createdDate: string;
  updatedDate: string;
}

export type TaxType = 'Percentage' | 'Fixed';

export interface Currency {
  currencyId: number;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface Language {
  languageId: number;
  languageCode: string;
  languageName: string;
  nativeName: string;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  createdDate: string;
}

export interface PaymentGateway {
  gatewayId: number;
  gatewayName: string;
  gatewayType: string;
  configJson: string;
  isActive: boolean;
  isTestMode: boolean;
  createdDate: string;
  updatedDate: string;
}

// ============================================================
// 15. NOTIFICATIONS
// ============================================================

export interface Notification {
  notificationId: number;
  guestId: number;
  reservationId: number;
  type: NotificationType;
  channel: string;
  subject: string;
  body: string;
  status: NotificationStatus;
  sentDate: string;
  scheduledDate: string;
  createdDate: string;
}

export type NotificationType = 'Email' | 'SMS' | 'Push' | 'In-App';
export type NotificationStatus = 'Pending' | 'Sent' | 'Delivered' | 'Failed' | 'Cancelled';

export interface EmailTemplate {
  templateId: number;
  templateName: string;
  templateType: TemplateType;
  subject: string;
  body: string;
  variables: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export type TemplateType = 'Reservation' | 'Confirmation' | 'CheckIn' | 'CheckOut' | 'Invoice' | 'Payment' | 'Marketing' | 'System';

export interface SMSTemplate {
  templateId: number;
  templateName: string;
  templateType: string;
  body: string;
  variables: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

// ============================================================
// 16. BOOKING SOURCES
// ============================================================

export interface BookingSourceData {
  sourceId: number;
  sourceName: string;
  sourceType: SourceType;
  commissionRate: number;
  isActive: boolean;
  contactInfo: string;
  notes: string;
  createdDate: string;
}

export type SourceType = 'Direct' | 'OTA' | 'Corporate' | 'Travel Agent' | 'Wholesale';

// ============================================================
// 17. ADDITIONAL TABLES
// ============================================================

export interface RoomGallery {
  galleryId: number;
  roomTypeId: number;
  imageUrl: string;
  caption: string;
  isPrimary: boolean;
  sortOrder: number;
  createdDate: string;
}

export interface WakeUpCall {
  callId: number;
  reservationId: number;
  roomId: number;
  wakeUpTime: string;
  status: WakeUpStatus;
  notes: string;
  createdDate: string;
}

export type WakeUpStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface GuestRequest {
  requestId: number;
  reservationId: number;
  roomId: number;
  requestType: GuestRequestType;
  description: string;
  priority: Priority;
  status: RequestStatus;
  assignedTo: number;
  responseText: string;
  createdDate: string;
  completedDate: string;
}

export type GuestRequestType = 'Room Service' | 'Housekeeping' | 'Maintenance' | 'Information' | 'Taxi' | 'Wake-up' | 'Other';
export type RequestStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface RatePlan {
  ratePlanId: number;
  ratePlanName: string;
  roomTypeId: number;
  baseRate: number;
  mealPlan: string;
  cancellationPolicy: string;
  payAtProperty: boolean;
  prepaymentRequired: boolean;
  isActive: boolean;
  createdDate: string;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, unknown>;
}

// ============================================================
// Frontend-specific types (for UI state)
// ============================================================

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface TableColumn<T = unknown> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: unknown, record: T) => any;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'datetime' | 'checkbox' | 'radio';
  required?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  validation?: Record<string, unknown>;
}
