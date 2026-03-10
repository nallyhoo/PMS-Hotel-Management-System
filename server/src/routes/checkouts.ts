import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const checkOuts = db.prepare(`
      SELECT co.*, r.ReservationCode, g.FirstName, g.LastName, g.Phone, rm.RoomNumber
      FROM CheckOuts co
      JOIN Reservations r ON co.ReservationID = r.ReservationID
      JOIN Guests g ON r.GuestID = g.GuestID
      JOIN Rooms rm ON co.RoomID = rm.RoomID
      WHERE DATE(co.CheckOutDate) = ?
    `).all(date || new Date().toISOString().split('T')[0]);
    res.json(checkOuts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch check-outs' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const checkOut = db.prepare(`
      SELECT co.*, r.ReservationCode, g.FirstName, g.LastName, g.Phone, g.Email, rm.RoomNumber
      FROM CheckOuts co
      JOIN Reservations r ON co.ReservationID = r.ReservationID
      JOIN Guests g ON r.GuestID = g.GuestID
      JOIN Rooms rm ON co.RoomID = rm.RoomID
      WHERE co.CheckOutID = ?
    `).get(req.params.id);
    res.json(checkOut);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch check-out' });
  }
});

export default router;
