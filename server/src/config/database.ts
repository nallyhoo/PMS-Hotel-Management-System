import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../../database/pms.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;

export function initDatabase() {
  const schemaPath = path.join(__dirname, '../../../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  const statements = schema.split(';').filter(s => s.trim());
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        db.exec(statement);
      } catch (e: any) {
        if (!e.message.includes('already exists')) {
          console.error('Schema error:', e.message);
        }
      }
    }
  }

  createIndexes();
  console.log('Database initialized');
}

function createIndexes() {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON MaintenanceRequests(Status)',
    'CREATE INDEX IF NOT EXISTS idx_maintenance_requests_priority ON MaintenanceRequests(Priority)',
    'CREATE INDEX IF NOT EXISTS idx_maintenance_requests_room ON MaintenanceRequests(RoomID)',
    'CREATE INDEX IF NOT EXISTS idx_maintenance_requests_date ON MaintenanceRequests(ReportedDate)',
    'CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_request ON MaintenanceTasks(RequestID)',
    'CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_staff ON MaintenanceTasks(AssignedStaffID)',
    'CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_status ON MaintenanceTasks(Status)',
    'CREATE INDEX IF NOT EXISTS idx_maintenance_history_request ON MaintenanceHistory(RequestID)',
    'CREATE INDEX IF NOT EXISTS idx_maintenance_history_date ON MaintenanceHistory(UpdateDate)',
  ];

  for (const index of indexes) {
    try {
      db.exec(index);
    } catch (e: any) {
      if (!e.message.includes('already exists')) {
        console.error('Index error:', e.message);
      }
    }
  }
  console.log('Database indexes created');
}

export function seedDatabase() {
  // Check if already seeded (only count active room types)
  const roomTypeCount = db.prepare('SELECT COUNT(*) as count FROM RoomTypes WHERE IsActive = 1').get() as { count: number };
  if (roomTypeCount.count > 0) {
    console.log('Database already seeded');
    return;
  }

  // Insert floors first
  const insertFloor = db.prepare(`
    INSERT INTO Floors (BranchID, FloorNumber, FloorName, Description)
    VALUES (?, ?, ?, ?)
  `);

  const floors = [
    [1, 1, 'Ground Floor', 'Ground floor rooms'],
    [1, 2, 'Second Floor', 'Second floor rooms'],
    [1, 3, 'Third Floor', 'Third floor rooms'],
    [1, 4, 'Fourth Floor', 'Fourth floor rooms'],
  ];

  for (const f of floors) {
    insertFloor.run(...f);
  }

  const insertRoomType = db.prepare(`
    INSERT INTO RoomTypes (TypeName, Description, Capacity, BasePrice, MaxOccupancy, BedType, SizeSqFt, IsActive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const roomTypes = [
    ['Standard', 'Comfortable room with essential amenities', 2, 99, 2, 'Queen', 300, 1],
    ['Superior', 'Upgraded room with enhanced comfort', 2, 149, 2, 'King', 350, 1],
    ['Deluxe', 'Spacious room with premium amenities', 2, 199, 3, 'King', 400, 1],
    ['Executive', 'Premium room for business travelers', 2, 249, 3, 'King', 450, 1],
    ['Club', 'Exclusive room with club lounge access', 2, 299, 3, 'King', 500, 1],
    ['Junior Suite', 'Open-plan suite with living area', 3, 349, 4, 'King', 550, 1],
    ['Business Suite', 'Spacious suite with workspace', 3, 449, 4, 'King', 650, 1],
    ['Family Suite', 'Large suite for families', 4, 549, 6, 'King+Queen', 800, 1],
    ['Presidential Suite', 'Ultimate luxury suite', 4, 999, 6, 'King', 1500, 1],
    ['Accessible Room', 'Room with accessibility features', 2, 129, 2, 'Queen', 350, 1],
  ];

  for (const rt of roomTypes) {
    insertRoomType.run(...rt);
  }

  const insertGuest = db.prepare(`
    INSERT INTO Guests (FirstName, LastName, Email, Phone, Address, City, Country, Nationality, DateOfBirth, CreatedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const guests = [
    ['John', 'Smith', 'john.smith@email.com', '+1-555-0101', '123 Main St', 'New York', 'USA', 'American', '1985-03-15', '2026-01-15 10:00:00'],
    ['Maria', 'Garcia', 'maria.garcia@email.com', '+1-555-0102', '456 Oak Ave', 'Los Angeles', 'Spain', 'Spanish', '1990-07-22', '2026-01-20 11:30:00'],
    ['David', 'Chen', 'david.chen@email.com', '+1-555-0103', '789 Pine Rd', 'San Francisco', 'Canada', 'Canadian', '1988-11-08', '2026-02-01 09:15:00'],
    ['Emma', 'Wilson', 'emma.wilson@email.com', '+1-555-0104', '321 Elm St', 'Chicago', 'UK', 'British', '1992-01-30', '2026-02-05 14:45:00'],
    ['Michael', 'Brown', 'michael.brown@email.com', '+1-555-0105', '654 Maple Dr', 'Miami', 'Australia', 'Australian', '1987-06-12', '2026-02-10 16:20:00'],
  ];

  for (const guest of guests) {
    insertGuest.run(...guest);
  }

  const insertReservation = db.prepare(`
    INSERT INTO Reservations (GuestID, BranchID, ReservationCode, CheckInDate, CheckOutDate, Status, BookingSource, Adults, Children, SpecialRequests, TotalAmount, DepositAmount, DepositPaid, AssignedRoomID, ConfirmationDate, CreatedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const reservations = [
    [1, 1, 'RES-001', formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)), formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)), 'Confirmed', 'Website', 2, 0, 'Early check-in preferred', 450.00, 100.00, 1, 1, '2026-03-01 10:00:00', '2026-03-01 10:00:00'],
    [2, 1, 'RES-002', formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)), formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)), 'Pending', 'Booking.com', 2, 1, 'Extra pillows needed', 675.00, 0, 0, null, null, '2026-03-05 14:30:00'],
    [3, 1, 'RES-003', formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)), formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)), 'Checked In', 'Direct', 1, 0, null, 285.00, 50.00, 1, 2, '2026-03-01 09:00:00', '2026-02-28 09:00:00'],
    [4, 1, 'RES-004', formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)), formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)), 'Checked Out', 'Expedia', 3, 1, 'Late checkout requested', 920.00, 200.00, 1, 5, '2026-02-20 11:00:00', '2026-02-15 11:00:00'],
    [5, 1, 'RES-005', formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)), formatDate(new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)), 'Confirmed', 'Phone', 2, 0, 'Anniversary celebration', 1200.00, 300.00, 1, 10, '2026-03-08 16:00:00', '2026-03-08 16:00:00'],
    [1, 1, 'RES-006', formatDate(new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)), formatDate(new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000)), 'Pending', 'Website', 2, 0, null, 450.00, 0, 0, null, null, '2026-03-10 12:00:00'],
    [3, 1, 'RES-007', formatDate(new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000)), formatDate(new Date(today.getTime() + 24 * 24 * 60 * 60 * 1000)), 'Confirmed', 'Direct', 1, 0, 'Airport pickup needed', 380.00, 75.00, 1, 6, '2026-03-09 10:30:00', '2026-03-09 10:30:00'],
  ];

  for (const res of reservations) {
    insertReservation.run(...res);
  }

  // Get room type IDs dynamically
  const roomTypeRows = db.prepare('SELECT RoomTypeID, TypeName FROM RoomTypes').all() as any[];
  const roomTypeMap = new Map(roomTypeRows.map(rt => [rt.TypeName, rt.RoomTypeID]));
  
  // Get floor IDs dynamically
  const floorRows = db.prepare('SELECT FloorID, FloorNumber FROM Floors').all() as any[];
  const floorMap = new Map(floorRows.map(f => [f.FloorNumber, f.FloorID]));

  // Insert rooms using dynamic IDs
  const insertRoom = db.prepare(`
    INSERT INTO Rooms (BranchID, RoomNumber, RoomTypeID, FloorID, Status, CleaningStatus, Notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const rooms = [
    [1, '101', roomTypeMap.get('Standard'), floorMap.get(1), 'Available', 'Clean', null],
    [1, '102', roomTypeMap.get('Standard'), floorMap.get(1), 'Occupied', 'Clean', null],
    [1, '103', roomTypeMap.get('Superior'), floorMap.get(1), 'Available', 'Clean', null],
    [1, '104', roomTypeMap.get('Superior'), floorMap.get(1), 'Reserved', 'Clean', null],
    [1, '105', roomTypeMap.get('Deluxe'), floorMap.get(1), 'Dirty', 'Dirty', null],
    [1, '201', roomTypeMap.get('Deluxe'), floorMap.get(2), 'Available', 'Clean', null],
    [1, '202', roomTypeMap.get('Executive'), floorMap.get(2), 'Occupied', 'Clean', null],
    [1, '203', roomTypeMap.get('Executive'), floorMap.get(2), 'Maintenance', 'Inspected', 'HVAC repair'],
    [1, '204', roomTypeMap.get('Club'), floorMap.get(2), 'Available', 'Clean', null],
    [1, '205', roomTypeMap.get('Club'), floorMap.get(2), 'Occupied', 'Clean', null],
    [1, '301', roomTypeMap.get('Junior Suite'), floorMap.get(3), 'Available', 'Clean', null],
    [1, '302', roomTypeMap.get('Junior Suite'), floorMap.get(3), 'Reserved', 'Clean', null],
    [1, '303', roomTypeMap.get('Business Suite'), floorMap.get(3), 'Available', 'Clean', null],
    [1, '304', roomTypeMap.get('Business Suite'), floorMap.get(3), 'Occupied', 'Clean', null],
    [1, '305', roomTypeMap.get('Family Suite'), floorMap.get(3), 'Available', 'Clean', null],
    [1, '401', roomTypeMap.get('Presidential Suite'), floorMap.get(4), 'Available', 'Clean', null],
    [1, '402', roomTypeMap.get('Accessible Room'), floorMap.get(4), 'Available', 'Clean', 'Wheelchair accessible'],
  ];

  for (const room of rooms) {
    insertRoom.run(...room);
  }

  // Seed Housekeeping data
  // First, ensure departments exist
  const deptCheck = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Housekeeping') as any;
  let hkDeptId = deptCheck?.DepartmentID;
  
  if (!hkDeptId) {
    // Check if any departments exist
    const existingDepts = db.prepare('SELECT COUNT(*) as count FROM Departments').get() as any;
    if (!existingDepts || existingDepts.count === 0) {
      // Seed default departments
      const defaultDepts = [
        ['Front Office', 'Guest Services and Reception'],
        ['Housekeeping', 'Housekeeping and Cleaning Department'],
        ['Food & Beverage', 'Restaurant and Kitchen'],
        ['Maintenance', 'Property Maintenance'],
        ['Finance', 'Accounting and Billing'],
      ];
      const insertDept = db.prepare('INSERT INTO Departments (DepartmentName, Description) VALUES (?, ?)');
      for (const d of defaultDepts) {
        insertDept.run(d[0], d[1]);
      }
    }
    hkDeptId = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Housekeeping') as any;
  }

  // If still no Housekeeping department, create it
  if (!hkDeptId) {
    const insertDept = db.prepare('INSERT INTO Departments (DepartmentName, Description) VALUES (?, ?)');
    insertDept.run('Housekeeping', 'Housekeeping and Cleaning Department');
    hkDeptId = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Housekeeping') as any;
  }

  // Insert housekeeping staff
  const hkStaff = [
    ['Maria', 'Garcia', 'Housekeeper', 'Female', '2024-01-15', 'Active', '555-0101', 'maria@hotel.com'],
    ['John', 'Doe', 'Housekeeper', 'Male', '2024-02-01', 'Active', '555-0102', 'john@hotel.com'],
    ['Elena', 'Rodriguez', 'Housekeeper', 'Female', '2024-01-20', 'Active', '555-0103', 'elena@hotel.com'],
    ['Marcus', 'Chen', 'Senior Housekeeper', 'Male', '2023-11-01', 'Active', '555-0104', 'marcus@hotel.com'],
    ['Sarah', 'Johnson', 'Supervisor', 'Female', '2023-08-15', 'Active', '555-0105', 'sarah@hotel.com'],
  ];

  const insertStaff = db.prepare(`
    INSERT INTO Employees (BranchID, DepartmentID, FirstName, LastName, Position, Gender, HireDate, EmploymentStatus, Phone, Email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const staffIds: number[] = [];
  for (const s of hkStaff) {
    insertStaff.run(1, hkDeptId, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7]);
    const lastId = db.prepare('SELECT last_insert_rowid() as id').get() as any;
    staffIds.push(lastId.id);
  }

  // Insert housekeeping tasks
  const hkToday = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const hkTasks = [
    [1, 'Turnover', 'High', yesterday, '09:00', yesterday, '11:30', staffIds[0], 'Completed'],
    [2, 'Standard Clean', 'Normal', yesterday, '10:00', yesterday, '11:00', staffIds[1], 'Completed'],
    [3, 'Deep Clean', 'High', yesterday, '14:00', yesterday, '16:30', staffIds[2], 'Completed'],
    [4, 'Turnover', 'High', hkToday, '08:00', hkToday, null, staffIds[0], 'In Progress'],
    [5, 'Standard Clean', 'Normal', hkToday, '09:00', null, null, staffIds[1], 'Pending'],
    [6, 'Standard Clean', 'Normal', hkToday, '10:00', null, null, staffIds[2], 'Pending'],
    [7, 'Turnover', 'Urgent', hkToday, '11:00', null, null, staffIds[3], 'Pending'],
    [8, 'Standard Clean', 'Low', hkToday, '14:00', null, null, staffIds[0], 'Pending'],
    [9, 'Inspection', 'Normal', hkToday, null, null, null, null, 'Pending'],
    [10, 'Turnover', 'High', tomorrow, '08:00', null, null, staffIds[1], 'Pending'],
    [5, 'Standard Clean', 'Normal', tomorrow, '09:00', null, null, staffIds[2], 'Pending'],
  ];

  const insertTask = db.prepare(`
    INSERT INTO HousekeepingTasks (RoomID, TaskType, Priority, ScheduledDate, ScheduledTime, StartTime, EndTime, AssignedStaffID, Status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const t of hkTasks) {
    insertTask.run(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
  }

  // Insert housekeeping supplies
  const supplies = [
    ['Towels', 'SUP-001', 'Linens', 'piece', 50, 100, 2.50, 'HotelSupply Co'],
    ['Bed Sheets', 'SUP-002', 'Linens', 'set', 30, 80, 5.00, 'HotelSupply Co'],
    ['Pillowcases', 'SUP-003', 'Linens', 'piece', 40, 100, 1.50, 'HotelSupply Co'],
    ['Bath Mats', 'SUP-004', 'Linens', 'piece', 25, 50, 3.00, 'HotelSupply Co'],
    ['Shampoo', 'SUP-005', 'Amenities', 'bottle', 20, 60, 4.00, 'BeautyPro'],
    ['Soap', 'SUP-006', 'Amenities', 'bar', 30, 80, 1.00, 'BeautyPro'],
    ['Toilet Paper', 'SUP-007', 'Paper Products', 'roll', 50, 200, 0.50, 'PaperWorld'],
    ['Tissue Box', 'SUP-008', 'Paper Products', 'box', 20, 50, 2.00, 'PaperWorld'],
    ['Glass Cleaner', 'SUP-009', 'Cleaning Agents', 'bottle', 10, 30, 8.00, 'CleanMax'],
    ['Floor Cleaner', 'SUP-010', 'Cleaning Agents', 'bottle', 15, 25, 12.00, 'CleanMax'],
    ['Mop', 'SUP-011', 'Equipment', 'piece', 5, 15, 25.00, 'EquipPro'],
    ['Vacuum Cleaner Bags', 'SUP-012', 'Equipment', 'bag', 10, 20, 15.00, 'EquipPro'],
  ];

  const insertSupply = db.prepare(`
    INSERT INTO HousekeepingSupplies (ItemName, ItemCode, Category, Unit, MinStockLevel, CurrentStock, CostPerUnit, Supplier)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of supplies) {
    insertSupply.run(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7]);
  }

  // Insert HousekeepingStatus for some rooms
  const insertStatus = db.prepare(`
    INSERT OR REPLACE INTO HousekeepingStatus (RoomID, CleaningStatus, LastCleaned, UpdatedTime, Notes)
    VALUES (?, ?, ?, datetime('now'), ?)
  `);
  
  insertStatus.run(1, 'Clean', yesterday, 'Quick touch-up done');
  insertStatus.run(2, 'Clean', hkToday, 'Daily clean');
  insertStatus.run(3, 'Clean', yesterday, null);
  insertStatus.run(5, 'Dirty', yesterday, 'Guest checkout - needs full clean');
  insertStatus.run(9, 'Dirty', yesterday, 'Guest checkout - needs full clean');

  // Seed Maintenance data
  const maintenanceDeptCheck = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Maintenance') as any;
  let maintenanceDeptId = maintenanceDeptCheck?.DepartmentID;
  
  if (!maintenanceDeptId) {
    const insertDept = db.prepare('INSERT INTO Departments (DepartmentName, Description) VALUES (?, ?)');
    insertDept.run('Maintenance', 'Property Maintenance');
    maintenanceDeptId = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Maintenance') as any;
  }

  // Insert maintenance staff
  const mntStaff = [
    ['Bob', 'Wilson', 'Maintenance Technician', 'Male', '2023-06-01', 'Active', '555-0201', 'bob@hotel.com'],
    ['Carlos', 'Martinez', 'Electrician', 'Male', '2023-08-15', 'Active', '555-0202', 'carlos@hotel.com'],
    ['Diana', 'Lee', 'Plumber', 'Female', '2023-04-20', 'Active', '555-0203', 'diana@hotel.com'],
  ];

  const mntStaffIds: number[] = [];
  for (const s of mntStaff) {
    insertStaff.run(1, maintenanceDeptId, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7]);
    const lastId = db.prepare('SELECT last_insert_rowid() as id').get() as any;
    mntStaffIds.push(lastId.id);
  }

  // Insert maintenance requests
  const mntRequests = [
    [1, 'Plumbing', 'High', 'Leaking faucet in bathroom sink', 1, yesterday, 'Open', null, 50.00, null, 'Faucet needs replacement'],
    [2, 'Electrical', 'Emergency', 'Power outlet not working', 2, yesterday, 'In Progress', today, 75.00, null, 'Checking wiring'],
    [3, 'HVAC', 'Normal', 'AC not cooling properly', 1, yesterday, 'Open', null, 150.00, null, 'Filter might need replacement'],
    [5, 'Furniture', 'Low', 'Broken chair leg', 3, hkToday, 'Open', null, 25.00, null, 'Chair in room 105'],
    [3, 'Appliance', 'High', 'Microwave not heating', 1, hkToday, 'Completed', yesterday, 80.00, 80.00, 'Replaced magnetron'],
    [1, 'Plumbing', 'Normal', 'Toilet running constantly', 2, yesterday, 'Open', null, 60.00, null, 'Flapper needs replacement'],
    [4, 'Electrical', 'Normal', 'Light flickering in bedroom', 1, hkToday, 'In Progress', today, 45.00, null, 'Loose connection'],
    [2, 'HVAC', 'High', 'Heater not working', 3, yesterday, 'Open', null, 200.00, null, 'Thermostat issue'],
  ];

  const insertMntRequest = db.prepare(`
    INSERT INTO MaintenanceRequests (RoomID, RequestType, Priority, Description, ReportedBy, ReportedDate, Status, ScheduledDate, EstimatedCost, ActualCost, Notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const r of mntRequests) {
    insertMntRequest.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10]);
  }

  // Insert some maintenance tasks
  const insertMntTask = db.prepare(`
    INSERT INTO MaintenanceTasks (RequestID, AssignedStaffID, Status, StartDate, CompletionDate, Notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Task for request 2 (In Progress)
  insertMntTask.run(2, mntStaffIds[1], 'In Progress', today, null, 'Checking electrical wiring');
  
  // Task for request 5 (Completed)
  insertMntTask.run(5, mntStaffIds[2], 'Completed', yesterday, yesterday, 'Replaced magnetron tube');

  // Task for request 7 (In Progress)
  insertMntTask.run(7, mntStaffIds[0], 'In Progress', today, null, 'Investigating loose wire');

  // Insert maintenance history
  const insertMntHistory = db.prepare(`
    INSERT INTO MaintenanceHistory (RequestID, Status, Notes, UpdatedBy)
    VALUES (?, ?, ?, ?)
  `);

  insertMntHistory.run(2, 'In Progress', 'Task assigned to electrician', 1);
  insertMntHistory.run(5, 'Completed', 'Microwave repaired', 1);
  insertMntHistory.run(7, 'In Progress', 'Task assigned to maintenance technician', 1);

  console.log('Maintenance data seeded successfully');

  // Seed Invoices and Payments
  const invoiceCheck = db.prepare('SELECT COUNT(*) as count FROM Invoices').get() as any;
  if (invoiceCheck?.count === 0) {
    // Get some reservations
    const reservations = db.prepare('SELECT ReservationID, GuestID FROM Reservations LIMIT 5').all() as any[];
    
    // Calculate dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayDate = new Date(today);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];
    const todayPlus3Date = new Date(today);
    todayPlus3Date.setDate(todayPlus3Date.getDate() + 3);
    const todayPlus3 = todayPlus3Date.toISOString().split('T')[0];
    const todayMinus3Date = new Date(today);
    todayMinus3Date.setDate(todayMinus3Date.getDate() - 3);
    const todayMinus3 = todayMinus3Date.toISOString().split('T')[0];
    const todayMinus1Date = new Date(today);
    todayMinus1Date.setDate(todayMinus1Date.getDate() - 1);
    const todayMinus1 = todayMinus1Date.toISOString().split('T')[0];
    const todayMinus5Date = new Date(today);
    todayMinus5Date.setDate(todayMinus5Date.getDate() - 5);
    const todayMinus5 = todayMinus5Date.toISOString().split('T')[0];
    const todayMinus10Date = new Date(today);
    todayMinus10Date.setDate(todayMinus10Date.getDate() - 10);
    const todayMinus10 = todayMinus10Date.toISOString().split('T')[0];
    
    if (reservations.length > 0) {
      const invoices = [
        [reservations[0]?.ReservationID, 'INV-2024-001', yesterday, yesterday, 850.00, 85.00, 0, 935.00, 'Paid', 935.00, 0],
        [reservations[1]?.ReservationID, 'INV-2024-002', yesterday, todayPlus3, 1250.00, 125.00, 0, 1375.00, 'Pending', 0, 1375.00],
        [reservations[0]?.ReservationID, 'INV-2024-003', todayMinus5, todayMinus1, 450.00, 45.00, 50, 445.00, 'Paid', 445.00, 0],
        [reservations[2]?.ReservationID, 'INV-2024-004', todayMinus10, todayMinus5, 2100.00, 210.00, 0, 2310.00, 'Pending', 0, 2310.00],
        [reservations[1]?.ReservationID, 'INV-2024-005', todayMinus3, today, 3200.00, 320.00, 0, 3520.00, 'Partial', 1000.00, 2520.00],
      ];

      const insertInvoice = db.prepare(`
        INSERT INTO Invoices (ReservationID, InvoiceNumber, InvoiceDate, DueDate, SubTotal, TaxAmount, DiscountAmount, TotalAmount, Status, AmountPaid, BalanceDue)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const invoiceIds: number[] = [];
      for (const inv of invoices) {
        insertInvoice.run(inv[0], inv[1], inv[2], inv[3], inv[4], inv[5], inv[6], inv[7], inv[8], inv[9], inv[10]);
        const lastId = db.prepare('SELECT last_insert_rowid() as id').get() as any;
        invoiceIds.push(lastId.id);
      }

      // Insert invoice items
      const invoiceItems = [
        [invoiceIds[0], 'Room', 'Deluxe Room - 2 nights', 2, 350.00, 700.00, 10],
        [invoiceIds[0], 'Service', 'Room Service', 1, 150.00, 150.00, 10],
        [invoiceIds[1], 'Room', 'Suite - 3 nights', 3, 350.00, 1050.00, 10],
        [invoiceIds[1], 'Service', 'Spa Treatment', 1, 200.00, 200.00, 10],
        [invoiceIds[2], 'Room', 'Standard Room - 1 night', 1, 300.00, 300.00, 10],
        [invoiceIds[2], 'Service', 'Mini Bar', 1, 150.00, 150.00, 10],
        [invoiceIds[3], 'Room', 'Suite - 4 nights', 4, 450.00, 1800.00, 10],
        [invoiceIds[3], 'Service', 'Restaurant Bill', 1, 300.00, 300.00, 10],
        [invoiceIds[4], 'Room', 'Presidential Suite - 2 nights', 2, 1400.00, 2800.00, 10],
        [invoiceIds[4], 'Service', 'Airport Transfer', 1, 200.00, 200.00, 10],
      ];

      const insertItem = db.prepare(`
        INSERT INTO InvoiceItems (InvoiceID, ItemType, Description, Quantity, UnitPrice, Amount, TaxRate)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of invoiceItems) {
        insertItem.run(item[0], item[1], item[2], item[3], item[4], item[5], item[6]);
      }

      // Insert payments
      const payments = [
        [invoiceIds[0], reservations[0]?.ReservationID, 'Credit Card', 935.00, 'USD', 'TXN-001', 'Completed', yesterday],
        [invoiceIds[2], reservations[0]?.ReservationID, 'Cash', 445.00, 'USD', 'TXN-002', 'Completed', todayMinus3],
        [invoiceIds[4], reservations[1]?.ReservationID, 'Credit Card', 1000.00, 'USD', 'TXN-003', 'Completed', todayMinus1],
      ];

      const insertPayment = db.prepare(`
        INSERT INTO Payments (InvoiceID, ReservationID, PaymentMethod, Amount, Currency, ReferenceNumber, Status, PaymentDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const p of payments) {
        insertPayment.run(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
      }

      console.log('Invoices and Payments seeded successfully');
    }
  }
}
