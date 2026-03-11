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
  console.log('Database initialized');
}

export function seedDatabase() {
  const guestCount = db.prepare('SELECT COUNT(*) as count FROM Guests').get() as { count: number };
  if (guestCount.count > 0) {
    console.log('Database already seeded');
    return;
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

  console.log('Database seeded with sample data');
}
