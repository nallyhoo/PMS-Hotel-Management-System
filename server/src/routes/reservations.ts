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

// Calendar View
router.get('/calendar', (req: Request, res: Response) => {
  try {
    const { startDate, endDate, page = 1, limit = 100 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const reservations = db.prepare(`
      SELECT r.ReservationID, r.ReservationCode, r.CheckInDate, r.CheckOutDate, r.Status,
             r.AssignedRoomID, r.BookingSource, r.TotalAmount, r.Adults, r.Children,
             g.FirstName, g.LastName, rt.TypeName as RoomTypeName,
             rm.RoomNumber
      FROM Reservations r
      LEFT JOIN Guests g ON r.GuestID = g.GuestID
      LEFT JOIN Rooms rm ON r.AssignedRoomID = rm.RoomID
      LEFT JOIN RoomTypes rt ON rm.RoomTypeID = rt.RoomTypeID
      WHERE r.CheckInDate <= ? AND r.CheckOutDate >= ?
      ORDER BY r.CheckInDate
      LIMIT ? OFFSET ?
    `).all(endDate, startDate, Number(limit), offset);
    
    const countResult = db.prepare(`
      SELECT COUNT(*) as total FROM Reservations
      WHERE CheckInDate <= ? AND CheckOutDate >= ?
    `).get(endDate, startDate) as any;
    
    const transformedReservations = reservations.map((res: any) => ({
      reservationId: res.ReservationID,
      reservationCode: res.ReservationCode,
      checkInDate: res.CheckInDate,
      checkOutDate: res.CheckOutDate,
      status: res.Status,
      assignedRoomId: res.AssignedRoomID,
      bookingSource: res.BookingSource,
      totalAmount: res.TotalAmount,
      adults: res.Adults,
      children: res.Children,
      guestName: res.FirstName && res.LastName ? `${res.FirstName} ${res.LastName}` : 'Guest',
      roomTypeName: res.RoomTypeName,
      roomNumber: res.RoomNumber
    }));
    
    res.json({
      data: transformedReservations,
      total: countResult.total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(countResult.total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendar' });
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

    const transformedReservation = {
      reservationId: reservation.ReservationID,
      guestId: reservation.GuestID,
      branchId: reservation.BranchID,
      reservationCode: reservation.ReservationCode,
      checkInDate: reservation.CheckInDate,
      checkOutDate: reservation.CheckOutDate,
      status: reservation.Status,
      bookingSource: reservation.BookingSource,
      adults: reservation.Adults,
      children: reservation.Children,
      specialRequests: reservation.SpecialRequests,
      totalAmount: reservation.TotalAmount,
      depositAmount: reservation.DepositAmount,
      depositPaid: reservation.DepositPaid === 1,
      assignedRoomId: reservation.AssignedRoomID,
      confirmationDate: reservation.ConfirmationDate,
      cancelledDate: reservation.CancelledDate,
      cancelledBy: reservation.CancelledBy,
      cancellationReason: reservation.CancellationReason,
      createdBy: reservation.CreatedBy,
      createdDate: reservation.CreatedDate,
      updatedDate: reservation.UpdatedDate,
      firstName: reservation.FirstName,
      lastName: reservation.LastName,
      email: reservation.Email,
      phone: reservation.Phone,
      nationality: reservation.Nationality,
    };

    res.json({ ...transformedReservation, rooms, notes, history });
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

    const room = db.prepare('SELECT Status, CleaningStatus FROM Rooms WHERE RoomID = ?').get(roomId) as any;
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.CleaningStatus !== 'Clean' && room.CleaningStatus !== 'Inspected') {
      return res.status(400).json({ 
        error: 'Room not ready for check-in',
        roomStatus: room.Status,
        cleaningStatus: room.CleaningStatus,
        message: `Room is currently ${room.CleaningStatus || 'dirty'}. Please complete cleaning before check-in.`
      });
    }

    if (room.Status === 'Maintenance' || room.Status === 'Blocked') {
      return res.status(400).json({ 
        error: 'Room is not available',
        roomStatus: room.Status,
        message: `Room is currently under maintenance or blocked.`
      });
    }

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
    const { totalBill, paymentStatus, roomInspected, inspectionNotes, notes, skipAutoClean, generateInvoice } = req.body;
    const reservationId = req.params.id;

    // Default to auto-generate invoice if not specified
    const shouldGenerateInvoice = generateInvoice !== false;

    const reservation = db.prepare(`
      SELECT r.*, rt.TypeName as RoomTypeName, rm.RoomNumber
      FROM Reservations r
      LEFT JOIN Rooms rm ON r.AssignedRoomID = rm.RoomID
      LEFT JOIN RoomTypes rt ON rm.RoomTypeID = rt.RoomTypeID
      WHERE r.ReservationID = ?
    `).get(reservationId) as any;
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    let autoCleanCreated = false;
    let invoiceId = null;
    let invoiceNumber = null;

    // Auto-generate invoice (default: true)
    if (shouldGenerateInvoice) {
      const existingInvoice = db.prepare('SELECT InvoiceID, InvoiceNumber FROM Invoices WHERE ReservationID = ?').get(reservationId) as any;
      
      if (existingInvoice) {
        invoiceId = existingInvoice.InvoiceID;
        invoiceNumber = existingInvoice.InvoiceNumber;
      } else {
        const today = new Date().toISOString().split('T')[0];
        invoiceNumber = `INV-${Date.now()}`;
        
        const taxConfig = db.prepare('SELECT Value FROM Settings WHERE Key = ?').get('default_tax_rate') as any;
        const taxRate = taxConfig ? parseFloat(taxConfig.Value) || 10 : 10;
        
        const subTotal = reservation.TotalAmount || 0;
        const taxAmount = subTotal * (taxRate / 100);
        const totalAmount = subTotal + taxAmount;

        const invoiceResult = db.prepare(`
          INSERT INTO Invoices (ReservationID, InvoiceNumber, InvoiceDate, DueDate, SubTotal, TaxAmount, DiscountAmount, TotalAmount, Status, AmountPaid, BalanceDue)
          VALUES (?, ?, ?, ?, ?, ?, 0, ?, 'Pending', 0, ?)
        `).run(reservationId, invoiceNumber, today, today, subTotal, taxAmount, totalAmount, totalAmount);

        invoiceId = invoiceResult.lastInsertRowid;

        const checkInDate = new Date(reservation.CheckInDate);
        const checkOutDate = new Date(reservation.CheckOutDate);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

        db.prepare(`
          INSERT INTO InvoiceItems (InvoiceID, ItemType, Description, Quantity, UnitPrice, Amount, TaxRate)
          VALUES (?, 'Room', ?, ?, ?, ?, ?)
        `).run(invoiceId, `${reservation.RoomTypeName || 'Room'} (${reservation.RoomNumber || 'N/A'}) - ${nights} night${nights > 1 ? 's' : ''}`, nights, reservation.TotalAmount / nights, reservation.TotalAmount, taxRate);
      }
    }

    if (reservation.AssignedRoomID) {
      db.prepare(`
        INSERT INTO CheckOuts (ReservationID, RoomID, CheckOutDate, TotalBill, PaymentStatus, RoomInspected, InspectionNotes, Notes)
        VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)
      `).run(reservationId, reservation.AssignedRoomID, totalBill, paymentStatus, roomInspected ? 1 : 0, inspectionNotes, notes);

      db.prepare(`UPDATE Rooms SET Status = 'Dirty', CleaningStatus = 'Dirty' WHERE RoomID = ?`).run(reservation.AssignedRoomID);
      
      db.prepare(`
        INSERT OR REPLACE INTO HousekeepingStatus (RoomID, CleaningStatus, LastCleaned, UpdatedTime, Notes)
        VALUES (?, 'Dirty', NULL, CURRENT_TIMESTAMP, ?)
      `).run(reservation.AssignedRoomID, `Guest checkout - room marked dirty`);

      const enabledConfig = db.prepare('SELECT Value FROM Settings WHERE Key = ?').get('auto_cleanup_enabled') as any;
      const autoCleanupEnabled = enabledConfig ? enabledConfig.Value === 'true' : true;

      if (!skipAutoClean && autoCleanupEnabled) {
        const delayConfig = db.prepare('SELECT Value FROM Settings WHERE Key = ?').get('auto_cleanup_delay') as any;
        const delayMinutes = delayConfig ? parseInt(delayConfig.Value) || 30 : 30;

        const priorityConfig = db.prepare('SELECT Value FROM Settings WHERE Key = ?').get('auto_cleanup_priority') as any;
        const priority = priorityConfig ? priorityConfig.Value : 'High';

        const taskTypeConfig = db.prepare('SELECT Value FROM Settings WHERE Key = ?').get('auto_cleanup_task_type') as any;
        const taskType = taskTypeConfig ? taskTypeConfig.Value : 'Turnover';
        
        const scheduledDate = new Date();
        scheduledDate.setMinutes(scheduledDate.getMinutes() + delayMinutes);
        const scheduledDateStr = scheduledDate.toISOString().split('T')[0];
        const scheduledTime = scheduledDate.toTimeString().slice(0, 5);

        db.prepare(`
          INSERT INTO HousekeepingTasks (RoomID, TaskType, Priority, ScheduledDate, ScheduledTime, Notes)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(reservation.AssignedRoomID, taskType, priority, scheduledDateStr, scheduledTime, `Auto-created after guest checkout (Reservation #${reservationId})`);

        autoCleanCreated = true;
      }
    }

    db.prepare(`UPDATE Reservations SET Status = 'Checked Out' WHERE ReservationID = ?`).run(reservationId);

    db.prepare(`
      INSERT INTO ReservationHistory (ReservationID, Action, NewStatus, Notes)
      VALUES (?, 'Checked Out', 'Checked Out', 'Guest checked out')
    `).run(reservationId);

    res.json({ message: 'Check-out successful', autoCleanCreated, invoiceId, invoiceNumber });
  } catch (error) {
    console.error('Checkout error:', error);
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

export default router;
