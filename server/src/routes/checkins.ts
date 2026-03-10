import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const checkIns = db.prepare(`
      SELECT ci.*, r.ReservationCode, g.FirstName, g.LastName, g.Phone, rm.RoomNumber
      FROM CheckIns ci
      JOIN Reservations r ON ci.ReservationID = r.ReservationID
      JOIN Guests g ON r.GuestID = g.GuestID
      JOIN Rooms rm ON ci.RoomID = rm.RoomID
      WHERE DATE(ci.CheckInDate) = ?
    `).all(date || new Date().toISOString().split('T')[0]);
    res.json(checkIns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch check-ins' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const checkIn = db.prepare(`
      SELECT ci.*, r.ReservationCode, g.FirstName, g.LastName, g.Phone, g.Email, rm.RoomNumber
      FROM CheckIns ci
      JOIN Reservations r ON ci.ReservationID = r.ReservationID
      JOIN Guests g ON r.GuestID = g.GuestID
      JOIN Rooms rm ON ci.RoomID = rm.RoomID
      WHERE ci.CheckInID = ?
    `).get(req.params.id);
    res.json(checkIn);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch check-in' });
  }
});

export default router;
