import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { invoiceId, reservationId, status, page = 1, limit = 20, startDate, endDate } = req.query;
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
    if (startDate) { query += ' AND DATE(p.PaymentDate) >= ?'; params.push(startDate); }
    if (endDate) { query += ' AND DATE(p.PaymentDate) <= ?'; params.push(endDate); }

    const countQuery = query.replace('SELECT p.*, i.InvoiceNumber, r.ReservationCode', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as any).total;
    const totalPages = Math.ceil(total / Number(limit));

    query += ' ORDER BY p.PaymentDate DESC LIMIT ? OFFSET ?';
    const payments = db.prepare(query).all(...params, Number(limit), offset);

    res.json({ data: payments, total, page: Number(page), limit: Number(limit), totalPages });
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
    
    const payment = db.prepare('SELECT Amount, Status FROM Payments WHERE PaymentID = ?').get(req.params.id) as any;
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    if (payment.Status === 'Refunded') {
      return res.status(400).json({ error: 'Payment already refunded' });
    }
    
    if (refundAmount > payment.Amount) {
      return res.status(400).json({ error: 'Refund amount exceeds payment amount' });
    }

    const result = db.prepare(`
      INSERT INTO Refunds (PaymentID, RefundAmount, Reason, Status)
      VALUES (?, ?, ?, 'Pending')
    `).run(req.params.id, refundAmount, reason);

    const newStatus = refundAmount >= payment.Amount ? 'Refunded' : 'Partially Refunded';
    db.prepare(`UPDATE Payments SET Status = ? WHERE PaymentID = ?`).run(newStatus, req.params.id);

    res.json({ refundId: result.lastInsertRowid, message: 'Refund initiated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

router.get('/refunds', (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = `
      SELECT r.*, p.PaymentMethod, p.Amount as PaymentAmount, p.Currency, 
             i.InvoiceNumber, p.TransactionID
      FROM Refunds r
      LEFT JOIN Payments p ON r.PaymentID = p.PaymentID
      LEFT JOIN Invoices i ON p.InvoiceID = i.InvoiceID
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND r.Status = ?';
      params.push(status);
    }

    const countQuery = query.replace('SELECT r.*, p.PaymentMethod, p.Amount as PaymentAmount, p.Currency, i.InvoiceNumber, p.TransactionID', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as any).total;

    query += ' ORDER BY r.CreatedDate DESC LIMIT ? OFFSET ?';
    const refunds = db.prepare(query).all(...params, Number(limit), offset);

    res.json({ data: refunds, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch refunds' });
  }
});

router.get('/refunds/:id', (req: Request, res: Response) => {
  try {
    const refund = db.prepare(`
      SELECT r.*, p.PaymentMethod, p.Amount as PaymentAmount, p.Currency, 
             p.ReferenceNumber, p.TransactionID, i.InvoiceNumber
      FROM Refunds r
      LEFT JOIN Payments p ON r.PaymentID = p.PaymentID
      LEFT JOIN Invoices i ON p.InvoiceID = i.InvoiceID
      WHERE r.RefundID = ?
    `).get(req.params.id);
    res.json(refund);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch refund' });
  }
});

router.put('/refunds/:id/approve', (req: Request, res: Response) => {
  try {
    const { approvedBy, notes } = req.body;
    
    const refund = db.prepare('SELECT * FROM Refunds WHERE RefundID = ?').get(req.params.id) as any;
    
    if (!refund) {
      return res.status(404).json({ error: 'Refund not found' });
    }
    
    if (refund.Status !== 'Pending') {
      return res.status(400).json({ error: 'Refund already processed' });
    }

    db.prepare(`
      UPDATE Refunds SET Status = 'Approved', ProcessedBy = ?, Notes = ?, RefundDate = CURRENT_TIMESTAMP
      WHERE RefundID = ?
    `).run(approvedBy, notes, req.params.id);

    const payment = db.prepare('SELECT * FROM Payments WHERE PaymentID = ?').get(refund.PaymentID) as any;
    if (payment && payment.InvoiceID) {
      const invoice = db.prepare('SELECT * FROM Invoices WHERE InvoiceID = ?').get(payment.InvoiceID) as any;
      if (invoice) {
        const newAmountPaid = (invoice.AmountPaid || 0) - refund.RefundAmount;
        const newBalanceDue = (invoice.BalanceDue || 0) + refund.RefundAmount;
        const newStatus = newAmountPaid <= 0 ? 'Pending' : (newAmountPaid >= invoice.TotalAmount ? 'Paid' : 'Partial');
        db.prepare('UPDATE Invoices SET AmountPaid = ?, BalanceDue = ?, Status = ? WHERE InvoiceID = ?')
          .run(newAmountPaid, newBalanceDue, newStatus, payment.InvoiceID);
      }
    }

    res.json({ message: 'Refund approved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve refund' });
  }
});

router.put('/refunds/:id/reject', (req: Request, res: Response) => {
  try {
    const { rejectedBy, reason } = req.body;
    
    const refund = db.prepare('SELECT * FROM Refunds WHERE RefundID = ?').get(req.params.id) as any;
    
    if (!refund) {
      return res.status(404).json({ error: 'Refund not found' });
    }
    
    if (refund.Status !== 'Pending') {
      return res.status(400).json({ error: 'Refund already processed' });
    }

    db.prepare(`
      UPDATE Refunds SET Status = 'Rejected', ProcessedBy = ?, Notes = ?
      WHERE RefundID = ?
    `).run(rejectedBy, reason, req.params.id);

    const payment = db.prepare('SELECT * FROM Payments WHERE PaymentID = ?').get(refund.PaymentID) as any;
    if (payment) {
      const refundCheck = db.prepare('SELECT SUM(RefundAmount) as total FROM Refunds WHERE PaymentID = ? AND Status = ?').get(refund.PaymentID, 'Approved') as any;
      const totalRefunded = refundCheck?.total || 0;
      
      if (totalRefunded >= payment.Amount) {
        db.prepare(`UPDATE Payments SET Status = 'Refunded' WHERE PaymentID = ?`).run(refund.PaymentID);
      } else {
        db.prepare(`UPDATE Payments SET Status = 'Completed' WHERE PaymentID = ?`).run(refund.PaymentID);
      }
    }

    res.json({ message: 'Refund rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject refund' });
  }
});

router.put('/refunds/:id/process', (req: Request, res: Response) => {
  try {
    const { processedBy, refundMethod, notes } = req.body;
    
    const refund = db.prepare('SELECT * FROM Refunds WHERE RefundID = ?').get(req.params.id) as any;
    
    if (!refund) {
      return res.status(404).json({ error: 'Refund not found' });
    }
    
    if (refund.Status !== 'Approved') {
      return res.status(400).json({ error: 'Refund must be approved before processing' });
    }

    db.prepare(`
      UPDATE Refunds SET Status = 'Processed', ProcessedBy = ?, RefundMethod = ?, Notes = ?, RefundDate = CURRENT_TIMESTAMP
      WHERE RefundID = ?
    `).run(processedBy, refundMethod || 'Original Payment Method', notes, req.params.id);

    res.json({ message: 'Refund processed successfully' });
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
