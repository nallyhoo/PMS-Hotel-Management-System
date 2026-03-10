import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { invoiceId, reservationId, status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = `
      SELECT p.*, i.InvoiceNumber, r.ReservationCode
      FROM Payments p
      LEFT JOIN Invoices i ON p.InvoiceID = i.InvoiceID
      LEFT JOIN Reservations r ON p.ReservationID = r.ReservationID
      WHERE 1=1
    `;
    const params: any[] = [];

    if (invoiceId) { query += ' AND p.InvoiceID = ?'; params.push(invoiceId); }
    if (reservationId) { query += ' AND p.ReservationID = ?'; params.push(reservationId); }
    if (status) { query += ' AND p.Status = ?'; params.push(status); }

    const countQuery = query.replace('SELECT p.*, i.InvoiceNumber, r.ReservationCode', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as any).total;

    query += ' ORDER BY p.PaymentDate DESC LIMIT ? OFFSET ?';
    const payments = db.prepare(query).all(...params, Number(limit), offset);

    res.json({ data: payments, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const payment = db.prepare(`
      SELECT p.*, i.InvoiceNumber, r.ReservationCode
      FROM Payments p
      LEFT JOIN Invoices i ON p.InvoiceID = i.InvoiceID
      LEFT JOIN Reservations r ON p.ReservationID = r.ReservationID
      WHERE p.PaymentID = ?
    `).get(req.params.id);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { invoiceId, reservationId, paymentMethod, amount, currency, referenceNumber, transactionId, notes } = req.body;
    
    const result = db.prepare(`
      INSERT INTO Payments (InvoiceID, ReservationID, PaymentMethod, Amount, Currency, ReferenceNumber, TransactionID, Status, Notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Completed', ?)
    `).run(invoiceId, reservationId, paymentMethod, amount, currency || 'USD', referenceNumber, transactionId, notes);

    if (invoiceId) {
      const invoice = db.prepare('SELECT TotalAmount, AmountPaid FROM Invoices WHERE InvoiceID = ?').get(invoiceId) as any;
      const newAmountPaid = (invoice?.AmountPaid || 0) + amount;
      const newStatus = newAmountPaid >= invoice?.TotalAmount ? 'Paid' : 'Partial';
      db.prepare('UPDATE Invoices SET AmountPaid = ?, BalanceDue = TotalAmount - ?, Status = ? WHERE InvoiceID = ?')
        .run(newAmountPaid, newAmountPaid, newStatus, invoiceId);
    }

    res.status(201).json({ paymentId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

router.post('/:id/refund', (req: Request, res: Response) => {
  try {
    const { refundAmount, reason } = req.body;
    
    db.prepare(`
      INSERT INTO Refunds (PaymentID, RefundAmount, Reason, Status)
      VALUES (?, ?, ?, 'Pending')
    `).run(req.params.id, refundAmount, reason);

    db.prepare(`UPDATE Payments SET Status = 'Refunded' WHERE PaymentID = ?`).run(req.params.id);

    res.json({ message: 'Refund initiated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

router.get('/methods/list', (req: Request, res: Response) => {
  try {
    const methods = db.prepare('SELECT * FROM PaymentMethods WHERE IsActive = 1').all();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

router.post('/methods', (req: Request, res: Response) => {
  try {
    const { methodName, methodType } = req.body;
    const result = db.prepare('INSERT INTO PaymentMethods (MethodName, MethodType) VALUES (?, ?)').run(methodName, methodType);
    res.status(201).json({ methodId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment method' });
  }
});

router.get('/history', (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const payments = db.prepare(`
      SELECT p.*, i.InvoiceNumber
      FROM Payments p
      LEFT JOIN Invoices i ON p.InvoiceID = i.InvoiceID
      WHERE p.Status = 'Completed' AND p.PaymentDate BETWEEN ? AND ?
      ORDER BY p.PaymentDate DESC
    `).all(startDate, endDate);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

export default router;
