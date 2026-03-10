import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { status, reservationId, page = 1, limit = 20 } = req.query;
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

    const countQuery = query.replace('SELECT i.*, r.ReservationCode, g.FirstName, g.LastName', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as any).total;

    query += ' ORDER BY i.InvoiceDate DESC LIMIT ? OFFSET ?';
    const invoices = db.prepare(query).all(...params, Number(limit), offset);

    res.json({ data: invoices, total, page: Number(page), limit: Number(limit) });
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
    const { invoiceDate, dueDate, subTotal, taxAmount, discountAmount, totalAmount, status, notes } = req.body;
    db.prepare(`
      UPDATE Invoices SET InvoiceDate = ?, DueDate = ?, SubTotal = ?, TaxAmount = ?, DiscountAmount = ?, TotalAmount = ?, Status = ?, Notes = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE InvoiceID = ?
    `).run(invoiceDate, dueDate, subTotal, taxAmount, discountAmount, totalAmount, status, notes, req.params.id);
    res.json({ message: 'Invoice updated' });
  } catch (error) {
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

export default router;
