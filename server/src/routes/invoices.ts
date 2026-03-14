import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

// Seed invoices (development)
router.post('/seed', (req: Request, res: Response) => {
  try {
    const invoiceCheck = db.prepare('SELECT COUNT(*) as count FROM Invoices').get() as any;
    if (invoiceCheck?.count > 0) {
      return res.json({ message: 'Invoices already exist', count: invoiceCheck.count });
    }
    
    const reservations = db.prepare('SELECT ReservationID, GuestID FROM Reservations LIMIT 5').all() as any[];
    
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
    
    if (reservations.length === 0) {
      return res.status(400).json({ error: 'No reservations found' });
    }
    
    const invoices = [
      [reservations[0]?.ReservationID, 'INV-2024-001', yesterday, yesterday, 850.00, 85.00, 0, 935.00, 'Paid', 935.00, 0],
      [reservations[1]?.ReservationID, 'INV-2024-002', yesterday, todayPlus3, 1250.00, 125.00, 0, 1375.00, 'Pending', 0, 1375.00],
      [reservations[0]?.ReservationID, 'INV-2024-003', todayMinus5, todayMinus1, 450.00, 45.00, 50, 445.00, 'Paid', 445.00, 0],
      [reservations[2]?.ReservationID, 'INV-2024-004', todayMinus10, todayMinus5, 2100.00, 210.00, 0, 2310.00, 'Pending', 0, 2310.00],
      [reservations[1]?.ReservationID, 'INV-2024-005', todayMinus3, todayStr, 3200.00, 320.00, 0, 3520.00, 'Partial', 1000.00, 2520.00],
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

    res.json({ message: 'Invoices and payments seeded', invoices: invoiceIds.length });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed data' });
  }
});

// Dashboard stats
router.get('/dashboard', (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
      totalRevenue: 0,
      outstanding: 0,
      overdue: 0,
      paidToday: 0,
    };
    
    try {
      const totalResult = db.prepare('SELECT SUM(TotalAmount) as total FROM Invoices').get() as any;
      stats.totalRevenue = totalResult?.total || 0;
    } catch (e) { console.error('totalRevenue error:', e); }
    
    try {
      const outstandingResult = db.prepare("SELECT SUM(BalanceDue) as total FROM Invoices WHERE Status IN ('Pending', 'Partial')").get() as any;
      stats.outstanding = outstandingResult?.total || 0;
    } catch (e) { console.error('outstanding error:', e); }
    
    try {
      const todayStart = `${today} 00:00:00`;
      const todayEnd = `${today} 23:59:59`;
      const paidTodayResult = db.prepare("SELECT SUM(TotalAmount) as total FROM Invoices WHERE Status = 'Paid' AND InvoiceDate BETWEEN ? AND ?").get(todayStart, todayEnd) as any;
      stats.paidToday = paidTodayResult?.total || 0;
    } catch (e) { console.error('paidToday error:', e); }
    
    try {
      const overdueResult = db.prepare("SELECT SUM(BalanceDue) as total FROM Invoices WHERE Status NOT IN ('Paid', 'Draft', 'Cancelled') AND DueDate < ?").get(today) as any;
      stats.overdue = overdueResult?.total || 0;
    } catch (e) { console.error('overdue error:', e); }
    
    res.json(stats);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

router.get('/', (req: Request, res: Response) => {
  try {
    const { status, reservationId, page = 1, limit = 20, startDate, endDate } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = `
      SELECT i.*, r.ReservationCode, g.FirstName, g.LastName
      FROM Invoices i
      LEFT JOIN Reservations r ON i.ReservationID = r.ReservationID
      LEFT JOIN Guests g ON r.GuestID = g.GuestID
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND i.Status = ?';
      params.push(status);
    }
    if (reservationId) {
      query += ' AND i.ReservationID = ?';
      params.push(reservationId);
    }
    if (startDate) {
      query += ' AND i.InvoiceDate >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND i.InvoiceDate <= ?';
      params.push(endDate);
    }

    const countQuery = query.replace('SELECT i.*, r.ReservationCode, g.FirstName, g.LastName', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as any).total;
    const totalPages = Math.ceil(total / Number(limit));

    query += ' ORDER BY i.InvoiceDate DESC LIMIT ? OFFSET ?';
    const invoices = db.prepare(query).all(...params, Number(limit), offset);

    res.json({ data: invoices, total, page: Number(page), limit: Number(limit), totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const invoice = db.prepare(`
      SELECT i.*, r.ReservationCode, g.FirstName, g.LastName, g.Email
      FROM Invoices i
      LEFT JOIN Reservations r ON i.ReservationID = r.ReservationID
      LEFT JOIN Guests g ON r.GuestID = g.GuestID
      WHERE i.InvoiceID = ?
    `).get(req.params.id);

    const items = db.prepare('SELECT * FROM InvoiceItems WHERE InvoiceID = ?').all(req.params.id);
    res.json({ ...invoice, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { reservationId, invoiceDate, dueDate, subTotal, taxAmount, discountAmount, totalAmount, notes, items } = req.body;
    const invoiceNumber = `INV-${Date.now()}`;

    const result = db.prepare(`
      INSERT INTO Invoices (ReservationID, InvoiceNumber, InvoiceDate, DueDate, SubTotal, TaxAmount, DiscountAmount, TotalAmount, Status, Notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
    `).run(reservationId, invoiceNumber, invoiceDate, dueDate, subTotal, taxAmount || 0, discountAmount || 0, totalAmount, notes);

    if (items && items.length > 0) {
      const insertItem = db.prepare(`
        INSERT INTO InvoiceItems (InvoiceID, ItemType, Description, Quantity, UnitPrice, Amount, TaxRate)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      items.forEach((item: any) => {
        insertItem.run(result.lastInsertRowid, item.itemType, item.description, item.quantity, item.unitPrice, item.amount, item.taxRate || 0);
      });
    }

    res.status(201).json({ invoiceId: result.lastInsertRowid, invoiceNumber });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { invoiceDate, dueDate, subTotal, taxAmount, discountAmount, totalAmount, status, notes, items } = req.body;
    
    // Update invoice
    db.prepare(`
      UPDATE Invoices SET InvoiceDate = ?, DueDate = ?, SubTotal = ?, TaxAmount = ?, DiscountAmount = ?, TotalAmount = ?, Status = ?, Notes = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE InvoiceID = ?
    `).run(invoiceDate, dueDate, subTotal, taxAmount, discountAmount, totalAmount, status, notes, req.params.id);

    // Update invoice items if provided
    if (items && Array.isArray(items)) {
      // Delete existing items
      db.prepare('DELETE FROM InvoiceItems WHERE InvoiceID = ?').run(req.params.id);
      
      // Insert new items
      const insertItem = db.prepare(`
        INSERT INTO InvoiceItems (InvoiceID, ItemType, Description, Quantity, UnitPrice, Amount, TaxRate)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      for (const item of items) {
        insertItem.run(
          req.params.id,
          item.itemType || 'Other',
          item.description,
          item.quantity || 1,
          item.unitPrice || 0,
          item.amount || 0,
          item.taxRate || 0
        );
      }
    }

    res.json({ message: 'Invoice updated' });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE Invoices SET Status = ? WHERE InvoiceID = ?').run('Cancelled', req.params.id);
    res.json({ message: 'Invoice cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel invoice' });
  }
});

router.post('/:id/items', (req: Request, res: Response) => {
  try {
    const { itemType, description, quantity, unitPrice, amount, taxRate } = req.body;
    const result = db.prepare(`
      INSERT INTO InvoiceItems (InvoiceID, ItemType, Description, Quantity, UnitPrice, Amount, TaxRate)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.params.id, itemType, description, quantity, unitPrice, amount, taxRate || 0);

    const subtotal = db.prepare('SELECT SUM(Amount) as subtotal FROM InvoiceItems WHERE InvoiceID = ?').get(req.params.id) as any;
    db.prepare('UPDATE Invoices SET SubTotal = ?, TotalAmount = ? - TaxAmount + DiscountAmount WHERE InvoiceID = ?')
      .run(subtotal.subtotal, subtotal.subtotal, req.params.id);

    res.status(201).json({ itemId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

router.get('/:id/print', (req: Request, res: Response) => {
  try {
    const invoice = db.get(`
      SELECT i.*, r.ReservationCode, g.FirstName, g.LastName, g.Email, g.Phone, g.Address
      FROM Invoices i
      LEFT JOIN Reservations r ON i.ReservationID = r.ReservationID
      LEFT JOIN Guests g ON r.GuestID = g.GuestID
      WHERE i.InvoiceID = ?
    `);
    const items = db.all('SELECT * FROM InvoiceItems WHERE InvoiceID = ?');
    res.json({ ...invoice, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice for print' });
  }
});

// Compare invoices with checked-out reservations
router.get('/compare/reservations', (req: Request, res: Response) => {
  try {
    // Get all checked-out reservations
    const checkedOutReservations = db.prepare(`
      SELECT 
        r.ReservationID,
        r.ReservationCode,
        r.TotalAmount as ReservationTotal,
        r.CheckInDate,
        r.CheckOutDate,
        g.FirstName || ' ' || g.LastName as GuestName,
        rm.RoomNumber
      FROM Reservations r
      LEFT JOIN Guests g ON r.GuestID = g.GuestID
      LEFT JOIN Rooms rm ON r.AssignedRoomID = rm.RoomID
      WHERE r.Status = 'Checked Out'
    `).all() as any[];

    // Get all invoices with reservation link
    const invoices = db.prepare(`
      SELECT 
        InvoiceID,
        ReservationID,
        InvoiceNumber,
        TotalAmount,
        Status
      FROM Invoices 
      WHERE ReservationID IS NOT NULL
    `).all() as any[];

    // Create a map of reservationID -> invoice
    const invoiceMap = new Map();
    for (const inv of invoices) {
      invoiceMap.set(inv.ReservationID, inv);
    }

    // Compare and categorize
    const results = {
      matched: [] as any[],      // Has invoice, amount matches
      unmatched: [] as any[],    // Has invoice, amount differs
      missingInvoice: [] as any[], // Checked out, no invoice
      standalone: [] as any[]    // Invoices without reservation
    };

    // Checked-out reservations
    for (const res of checkedOutReservations) {
      const invoice = invoiceMap.get(res.ReservationID);
      
      if (invoice) {
        if (Math.abs(invoice.TotalAmount - res.ReservationTotal) < 0.01) {
          results.matched.push({
            reservation: res,
            invoice: invoice,
            match: true,
            difference: 0
          });
        } else {
          results.unmatched.push({
            reservation: res,
            invoice: invoice,
            match: false,
            difference: invoice.TotalAmount - res.ReservationTotal
          });
        }
      } else {
        results.missingInvoice.push({
          reservation: res,
          invoice: null
        });
      }
    }

    // Standalone invoices (not linked to reservation)
    const linkedReservationIds = new Set(checkedOutReservations.map(r => r.ReservationID));
    for (const inv of invoices) {
      if (!linkedReservationIds.has(inv.ReservationID)) {
        results.standalone.push({
          invoice: inv
        });
      }
    }

    // Summary
    const summary = {
      totalCheckedOut: checkedOutReservations.length,
      totalInvoices: invoices.length,
      matchedCount: results.matched.length,
      unmatchedCount: results.unmatched.length,
      missingInvoiceCount: results.missingInvoice.length,
      standaloneCount: results.standalone.length,
      matchRate: checkedOutReservations.length > 0 
        ? ((results.matched.length / checkedOutReservations.length) * 100).toFixed(1) + '%'
        : '0%'
    };

    res.json({ ...results, summary });
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({ error: 'Failed to compare invoices with reservations' });
  }
});

// Generate invoices for missing reservations
router.post('/fix/generate-missing', (req: Request, res: Response) => {
  try {
    const taxConfig = db.prepare('SELECT Value FROM Settings WHERE Key = ?').get('default_tax_rate') as any;
    const taxRate = taxConfig ? parseFloat(taxConfig.Value) || 10 : 10;

    // Get checked-out reservations without invoices
    const missingReservations = db.prepare(`
      SELECT 
        r.*, 
        rt.TypeName as RoomTypeName, 
        rm.RoomNumber
      FROM Reservations r
      LEFT JOIN Rooms rm ON r.AssignedRoomID = rm.RoomID
      LEFT JOIN RoomTypes rt ON rm.RoomTypeID = rt.RoomTypeID
      WHERE r.Status = 'Checked Out'
      AND r.ReservationID NOT IN (SELECT ReservationID FROM Invoices WHERE ReservationID IS NOT NULL)
    `).all() as any[];

    const generated: any[] = [];
    const errors: any[] = [];

    for (const reservation of missingReservations) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const invoiceNumber = `INV-${Date.now()}-${reservation.ReservationID}`;
        
        const checkInDate = new Date(reservation.CheckInDate);
        const checkOutDate = new Date(reservation.CheckOutDate);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
        
        const subTotal = reservation.TotalAmount || 0;
        const taxAmount = subTotal * (taxRate / 100);
        const totalAmount = subTotal + taxAmount;

        const invoiceResult = db.prepare(`
          INSERT INTO Invoices (ReservationID, InvoiceNumber, InvoiceDate, DueDate, SubTotal, TaxAmount, DiscountAmount, TotalAmount, Status, AmountPaid, BalanceDue)
          VALUES (?, ?, ?, ?, ?, ?, 0, ?, 'Pending', 0, ?)
        `).run(reservation.ReservationID, invoiceNumber, today, today, subTotal, taxAmount, totalAmount, totalAmount);

        const invoiceId = invoiceResult.lastInsertRowid;

        // Add room charge item
        db.prepare(`
          INSERT INTO InvoiceItems (InvoiceID, ItemType, Description, Quantity, UnitPrice, Amount, TaxRate)
          VALUES (?, 'Room', ?, ?, ?, ?, ?)
        `).run(invoiceId, `${reservation.RoomTypeName || 'Room'} (${reservation.RoomNumber || 'N/A'}) - ${nights} night${nights > 1 ? 's' : ''}`, nights, reservation.TotalAmount / nights, reservation.TotalAmount, taxRate);

        generated.push({
          reservationId: reservation.ReservationID,
          reservationCode: reservation.ReservationCode,
          invoiceId,
          invoiceNumber,
          totalAmount
        });
      } catch (err: any) {
        errors.push({
          reservationId: reservation.ReservationID,
          error: err.message
        });
      }
    }

    res.json({
      message: `Generated ${generated.length} invoices`,
      generated,
      errors,
      summary: {
        totalFound: missingReservations.length,
        generatedCount: generated.length,
        errorCount: errors.length
      }
    });
  } catch (error) {
    console.error('Generate missing error:', error);
    res.status(500).json({ error: 'Failed to generate missing invoices' });
  }
});

// Fix mismatched invoice amounts
router.post('/fix/mismatch', (req: Request, res: Response) => {
  try {
    const { reservationId, useReservationTotal } = req.body;
    
    const taxConfig = db.prepare('SELECT Value FROM Settings WHERE Key = ?').get('default_tax_rate') as any;
    const taxRate = taxConfig ? parseFloat(taxConfig.Value) || 10 : 10;

    let fixed: any[] = [];

    if (reservationId) {
      // Fix specific reservation
      const reservation = db.prepare('SELECT * FROM Reservations WHERE ReservationID = ?').get(reservationId) as any;
      const invoice = db.prepare('SELECT * FROM Invoices WHERE ReservationID = ?').get(reservationId) as any;
      
      if (!reservation || !invoice) {
        return res.status(404).json({ error: 'Reservation or invoice not found' });
      }

      const subTotal = useReservationTotal ? reservation.TotalAmount : invoice.TotalAmount;
      const taxAmount = subTotal * (taxRate / 100);
      const totalAmount = subTotal + taxAmount;

      db.prepare(`
        UPDATE Invoices SET SubTotal = ?, TaxAmount = ?, TotalAmount = ?, BalanceDue = TotalAmount - AmountPaid
        WHERE InvoiceID = ?
      `).run(subTotal, taxAmount, totalAmount, invoice.InvoiceID);

      // Update room charge item
      const checkInDate = new Date(reservation.CheckInDate);
      const checkOutDate = new Date(reservation.CheckOutDate);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

      db.prepare(`
        UPDATE InvoiceItems SET Quantity = ?, UnitPrice = ?, Amount = ?
        WHERE InvoiceID = ? AND ItemType = 'Room'
      `).run(nights, subTotal / nights, subTotal, invoice.InvoiceID);

      fixed.push({
        reservationId,
        invoiceId: invoice.InvoiceID,
        invoiceNumber: invoice.InvoiceNumber,
        oldTotal: invoice.TotalAmount,
        newTotal: totalAmount
      });
    } else {
      // Fix all mismatched
      const allInvoices = db.prepare(`
        SELECT i.*, r.TotalAmount as ReservationTotal
        FROM Invoices i
        JOIN Reservations r ON i.ReservationID = r.ReservationID
        WHERE r.Status = 'Checked Out'
        AND ABS(i.TotalAmount - r.TotalAmount) > 0.01
      `).all() as any[];

      for (const inv of allInvoices) {
        const reservation = db.prepare('SELECT * FROM Reservations WHERE ReservationID = ?').get(inv.ReservationID) as any;
        
        const subTotal = reservation.TotalAmount;
        const taxAmount = subTotal * (taxRate / 100);
        const totalAmount = subTotal + taxAmount;

        db.prepare(`
          UPDATE Invoices SET SubTotal = ?, TaxAmount = ?, TotalAmount = ?, BalanceDue = TotalAmount - AmountPaid
          WHERE InvoiceID = ?
        `).run(subTotal, taxAmount, totalAmount, inv.InvoiceID);

        // Update room charge item
        const checkInDate = new Date(reservation.CheckInDate);
        const checkOutDate = new Date(reservation.CheckOutDate);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

        db.prepare(`
          UPDATE InvoiceItems SET Quantity = ?, UnitPrice = ?, Amount = ?
          WHERE InvoiceID = ? AND ItemType = 'Room'
        `).run(nights, subTotal / nights, subTotal, inv.InvoiceID);

        fixed.push({
          reservationId: inv.ReservationID,
          invoiceId: inv.InvoiceID,
          invoiceNumber: inv.InvoiceNumber,
          oldTotal: inv.TotalAmount,
          newTotal: totalAmount
        });
      }
    }

    res.json({
      message: `Fixed ${fixed.length} invoices`,
      fixed,
      summary: {
        fixedCount: fixed.length
      }
    });
  } catch (error) {
    console.error('Fix mismatch error:', error);
    res.status(500).json({ error: 'Failed to fix mismatched invoices' });
  }
});

export default router;
