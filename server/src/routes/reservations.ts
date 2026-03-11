import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

// Get all reservations with filters
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, checkIn, checkOut, source, guestId, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = `
      SELECT r.*, g.FirstName, g.LastName, g.Email, g.Phone, rt.TypeName as RoomTypeName
      FROM Reservations r
      LEFT JOIN Guests g ON r.GuestID = g.GuestID
      LEFT JOIN RoomTypes rt ON r.AssignedRoomID = rt.RoomTypeID
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND r.Status = ?';
      params.push(status);
    }
    if (checkIn) {
      query += ' AND r.CheckInDate >= ?';
      params.push(checkIn);
    }
    if (checkOut) {
      query += ' AND r.CheckOutDate <= ?';
      params.push(checkOut);
    }
    if (source) {
      query += ' AND r.BookingSource = ?';
      params.push(source);
    }
    if (guestId) {
      query += ' AND r.GuestID = ?';
      params.push(guestId);
    }

    const countQuery = query.replace('SELECT r.*, g.FirstName, g.LastName, g.Email, g.Phone, rt.TypeName as RoomTypeName', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as any).total;

    query += ' ORDER BY r.CheckInDate DESC LIMIT ? OFFSET ?';
    const reservations = db.prepare(query).all(...params, Number(limit), offset);

    const transformedReservations = reservations.map((res: any) => ({
      reservationId: res.ReservationID,
      guestId: res.GuestID,
      branchId: res.BranchID,
      reservationCode: res.ReservationCode,
      checkInDate: res.CheckInDate,
      checkOutDate: res.CheckOutDate,
      status: res.Status,
      bookingSource: res.BookingSource,
      adults: res.Adults,
      children: res.Children,
      specialRequests: res.SpecialRequests,
      totalAmount: res.TotalAmount,
      depositAmount: res.DepositAmount,
      depositPaid: res.DepositPaid === 1,
      assignedRoomId: res.AssignedRoomID,
      confirmationDate: res.ConfirmationDate,
      createdDate: res.CreatedDate,
      firstName: res.FirstName,
      lastName: res.LastName,
      email: res.Email,
      phone: res.Phone,
      roomTypeName: res.RoomTypeName
    }));

    res.json({
      data: transformedReservations,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Get reservation by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const reservation = db.prepare(`
      SELECT r.*, g.FirstName, g.LastName, g.Email, g.Phone, g.Nationality
      FROM Reservations r
      LEFT JOIN Guests g ON r.GuestID = g.GuestID
      WHERE r.ReservationID = ?
    `).get(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const rooms = db.prepare(`
      SELECT rr.*, r.RoomNumber, rt.TypeName
      FROM ReservationRooms rr
      LEFT JOIN Rooms r ON rr.RoomID = r.RoomID
      LEFT JOIN RoomTypes rt ON rr.RoomTypeID = rt.RoomTypeID
      WHERE rr.ReservationID = ?
    `).all(req.params.id);

    const notes = db.prepare('SELECT * FROM ReservationNotes WHERE ReservationID = ?').all(req.params.id);
    const history = db.prepare('SELECT * FROM ReservationHistory WHERE ReservationID = ? ORDER BY ActionDate DESC').all(req.params.id);

    res.json({ ...reservation, rooms, notes, history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
});

// Create reservation
router.post('/', (req: Request, res: Response) => {
  try {
    const { guestId, branchId, checkInDate, checkOutDate, bookingSource, adults, children, specialRequests, totalAmount, depositAmount, depositPaid } = req.body;
    
    const reservationCode = `RES-${Date.now()}`;
    
    const result = db.prepare(`
      INSERT INTO Reservations (GuestID, BranchID, ReservationCode, CheckInDate, CheckOutDate, BookingSource, Adults, Children, SpecialRequests, TotalAmount, DepositAmount, DepositPaid, Status, ConfirmationDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', CURRENT_TIMESTAMP)
    `).run(guestId, branchId, reservationCode, checkInDate, checkOutDate, bookingSource, adults || 1, children || 0, specialRequests, totalAmount, depositAmount || 0, depositPaid ? 1 : 0);

    db.prepare(`
      INSERT INTO ReservationHistory (ReservationID, Action, NewStatus, Notes)
      VALUES (?, 'Created', 'Confirmed', 'Reservation created')
    `).run(result.lastInsertRowid);

    res.status(201).json({ reservationId: result.lastInsertRowid, reservationCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// Update reservation
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { checkInDate, checkOutDate, adults, children, specialRequests, totalAmount, status } = req.body;
    const current = db.prepare('SELECT Status FROM Reservations WHERE ReservationID = ?').get(req.params.id) as any;

    db.prepare(`
      UPDATE Reservations SET CheckInDate = ?, CheckOutDate = ?, Adults = ?, Children = ?, SpecialRequests = ?, TotalAmount = ?, Status = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE ReservationID = ?
    `).run(checkInDate, checkOutDate, adults, children, specialRequests, totalAmount, status, req.params.id);

    if (current && current.Status !== status) {
      db.prepare(`
        INSERT INTO ReservationHistory (ReservationID, Action, PreviousStatus, NewStatus, Notes)
        VALUES (?, 'Status Changed', ?, ?, 'Status updated')
      `).run(req.params.id, current.Status, status);
    }

    res.json({ message: 'Reservation updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

// Cancel reservation
router.post('/:id/cancel', (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const current = db.prepare('SELECT Status FROM Reservations WHERE ReservationID = ?').get(req.params.id) as any;

    db.prepare(`
      UPDATE Reservations SET Status = 'Cancelled', CancelledDate = CURRENT_TIMESTAMP, CancellationReason = ?
      WHERE ReservationID = ?
    `).run(reason, req.params.id);

    db.prepare(`
      INSERT INTO ReservationHistory (ReservationID, Action, PreviousStatus, NewStatus, Notes)
      VALUES (?, 'Cancelled', ?, 'Cancelled', ?)
    `).run(req.params.id, current?.Status, reason);

    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

// Confirm reservation
router.post('/:id/confirm', (req: Request, res: Response) => {
  try {
    const current = db.prepare('SELECT Status FROM Reservations WHERE ReservationID = ?').get(req.params.id) as any;

    db.prepare(`UPDATE Reservations SET Status = 'Confirmed', ConfirmationDate = CURRENT_TIMESTAMP WHERE ReservationID = ?`).run(req.params.id);

    db.prepare(`
      INSERT INTO ReservationHistory (ReservationID, Action, PreviousStatus, NewStatus, Notes)
      VALUES (?, 'Confirmed', ?, 'Confirmed', 'Reservation confirmed')
    `).run(req.params.id, current?.Status);

    res.json({ message: 'Reservation confirmed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to confirm reservation' });
  }
});

// Check-in guest
router.post('/:id/checkin', (req: Request, res: Response) => {
  try {
    const { roomId, keyCardNumber, notes } = req.body;

    db.prepare(`
      INSERT INTO CheckIns (ReservationID, RoomID, CheckInDate, KeyCardNumber, AssignedRoom, Notes)
      VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
    `).run(req.params.id, roomId, keyCardNumber, `Room ${roomId}`, notes);

    db.prepare(`UPDATE Reservations SET Status = 'Checked In', AssignedRoomID = ? WHERE ReservationID = ?`).run(roomId, req.params.id);
    db.prepare(`UPDATE Rooms SET Status = 'Occupied' WHERE RoomID = ?`).run(roomId);

    db.prepare(`
      INSERT INTO ReservationHistory (ReservationID, Action, NewStatus, Notes)
      VALUES (?, 'Checked In', 'Checked In', 'Guest checked in')
    `).run(req.params.id);

    res.json({ message: 'Check-in successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check in' });
  }
});

// Check-out guest
router.post('/:id/checkout', (req: Request, res: Response) => {
  try {
    const { totalBill, paymentStatus, roomInspected, inspectionNotes, notes } = req.body;

    db.prepare(`
      INSERT INTO CheckOuts (ReservationID, RoomID, CheckOutDate, TotalBill, PaymentStatus, RoomInspected, InspectionNotes, Notes)
      SELECT ?, RoomID, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?
      FROM Reservations WHERE ReservationID = ?
    `).run(req.params.id, totalBill, paymentStatus, roomInspected ? 1 : 0, inspectionNotes, notes, req.params.id);

    db.prepare(`UPDATE Reservations SET Status = 'Checked Out' WHERE ReservationID = ?`).run(req.params.id);

    const roomId = (db.prepare('SELECT RoomID FROM Reservations WHERE ReservationID = ?').get(req.params.id) as any)?.RoomID;
    if (roomId) {
      db.prepare(`UPDATE Rooms SET Status = 'Dirty', CleaningStatus = 'Dirty' WHERE RoomID = ?`).run(roomId);
    }

    db.prepare(`
      INSERT INTO ReservationHistory (ReservationID, Action, NewStatus, Notes)
      VALUES (?, 'Checked Out', 'Checked Out', 'Guest checked out')
    `).run(req.params.id);

    res.json({ message: 'Check-out successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check out' });
  }
});

// Reservation Notes
router.get('/:id/notes', (req: Request, res: Response) => {
  try {
    const notes = db.prepare('SELECT * FROM ReservationNotes WHERE ReservationID = ? ORDER BY CreatedDate DESC').all(req.params.id);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.post('/:id/notes', (req: Request, res: Response) => {
  try {
    const { noteText, noteType } = req.body;
    const result = db.prepare(`
      INSERT INTO ReservationNotes (ReservationID, NoteText, NoteType)
      VALUES (?, ?, ?)
    `).run(req.params.id, noteText, noteType || 'General');
    
    res.status(201).json({ noteId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// Calendar View
router.get('/calendar', (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const reservations = db.prepare(`
      SELECT r.ReservationID, r.ReservationCode, r.CheckInDate, r.CheckOutDate, r.Status,
             g.FirstName, g.LastName, r.TotalAmount
      FROM Reservations r
      LEFT JOIN Guests g ON r.GuestID = g.GuestID
      WHERE r.CheckInDate <= ? AND r.CheckOutDate >= ?
      ORDER BY r.CheckInDate
    `).all(endDate, startDate);
    
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

export default router;
