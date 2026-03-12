import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

// Get all key cards
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, roomId } = req.query;
    let query = `
      SELECT kc.*, rm.RoomNumber, rt.TypeName as RoomTypeName
      FROM KeyCards kc
      JOIN Rooms rm ON kc.RoomID = rm.RoomID
      LEFT JOIN RoomTypes rt ON rm.RoomTypeID = rt.RoomTypeID
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND kc.Status = ?';
      params.push(status);
    }
    if (roomId) {
      query += ' AND kc.RoomID = ?';
      params.push(roomId);
    }

    query += ' ORDER BY kc.IssueDate DESC';

    const keyCards = db.prepare(query).all(...params);
    res.json(keyCards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch key cards' });
  }
});

// Get active key cards
router.get('/active', (req: Request, res: Response) => {
  try {
    const keyCards = db.prepare(`
      SELECT kc.*, rm.RoomNumber, rt.TypeName as RoomTypeName
      FROM KeyCards kc
      JOIN Rooms rm ON kc.RoomID = rm.RoomID
      LEFT JOIN RoomTypes rt ON rm.RoomTypeID = rt.RoomTypeID
      WHERE kc.Status = 'Active'
      ORDER BY kc.IssueDate DESC
    `).all();
    res.json(keyCards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active key cards' });
  }
});

// Get key card by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const keyCard = db.prepare(`
      SELECT kc.*, rm.RoomNumber, rt.TypeName as RoomTypeName
      FROM KeyCards kc
      JOIN Rooms rm ON kc.RoomID = rm.RoomID
      LEFT JOIN RoomTypes rt ON rm.RoomTypeID = rt.RoomTypeID
      WHERE kc.KeyCardID = ?
    `).get(req.params.id);
    
    if (!keyCard) {
      res.status(404).json({ error: 'Key card not found' });
      return;
    }
    res.json(keyCard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch key card' });
  }
});

// Create new key card
router.post('/', (req: Request, res: Response) => {
  try {
    const { cardNumber, roomId, guestName, reservationId, expiryDate, notes } = req.body;

    if (!cardNumber || !roomId) {
      res.status(400).json({ error: 'Card number and room are required' });
      return;
    }

    // Check if card number already exists
    const existing = db.prepare('SELECT KeyCardID FROM KeyCards WHERE CardNumber = ?').get(cardNumber);
    if (existing) {
      res.status(400).json({ error: 'Card number already exists' });
      return;
    }

    const result = db.prepare(`
      INSERT INTO KeyCards (CardNumber, RoomID, GuestName, ReservationID, ExpiryDate, Status, Notes)
      VALUES (?, ?, ?, ?, ?, 'Active', ?)
    `).run(cardNumber, roomId, guestName || null, reservationId || null, expiryDate || null, notes || null);

    res.status(201).json({ keyCardId: result.lastInsertRowid });
  } catch (error: any) {
    console.error('Error creating key card:', error);
    res.status(500).json({ error: 'Failed to create key card' });
  }
});

// Update key card
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { cardNumber, roomId, guestName, reservationId, status, expiryDate, notes } = req.body;

    db.prepare(`
      UPDATE KeyCards 
      SET CardNumber = ?, RoomID = ?, GuestName = ?, ReservationID = ?, Status = ?, ExpiryDate = ?, Notes = ?
      WHERE KeyCardID = ?
    `).run(cardNumber, roomId, guestName, reservationId, status, expiryDate, notes, req.params.id);

    res.json({ message: 'Key card updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update key card' });
  }
});

// Return key card
router.post('/:id/return', (req: Request, res: Response) => {
  try {
    db.prepare(`
      UPDATE KeyCards 
      SET Status = 'Returned', ReturnDate = CURRENT_TIMESTAMP
      WHERE KeyCardID = ?
    `).run(req.params.id);

    res.json({ message: 'Key card returned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to return key card' });
  }
});

// Mark key card as lost
router.post('/:id/lost', (req: Request, res: Response) => {
  try {
    db.prepare(`
      UPDATE KeyCards 
      SET Status = 'Lost'
      WHERE KeyCardID = ?
    `).run(req.params.id);

    res.json({ message: 'Key card marked as lost' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark key card as lost' });
  }
});

// Deactivate key card
router.post('/:id/deactivate', (req: Request, res: Response) => {
  try {
    db.prepare(`
      UPDATE KeyCards 
      SET Status = 'Inactive'
      WHERE KeyCardID = ?
    `).run(req.params.id);

    res.json({ message: 'Key card deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate key card' });
  }
});

// Delete key card
router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM KeyCards WHERE KeyCardID = ?').run(req.params.id);
    res.json({ message: 'Key card deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete key card' });
  }
});

// Get key cards by room
router.get('/room/:roomId', (req: Request, res: Response) => {
  try {
    const keyCards = db.prepare(`
      SELECT * FROM KeyCards 
      WHERE RoomID = ? 
      ORDER BY IssueDate DESC
    `).all(req.params.roomId);
    res.json(keyCards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch key cards for room' });
  }
});

export default router;
