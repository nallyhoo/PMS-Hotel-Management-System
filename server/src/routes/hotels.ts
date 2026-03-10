import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

// Get all hotels
router.get('/', (req: Request, res: Response) => {
  try {
    const hotels = db.prepare('SELECT * FROM Hotels WHERE 1=1').all();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// Get hotel by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const hotel = db.prepare('SELECT * FROM Hotels WHERE HotelID = ?').get(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
});

// Create hotel
router.post('/', (req: Request, res: Response) => {
  try {
    const { hotelName, address, city, country, phone, email, website, timezone } = req.body;
    const result = db.prepare(`
      INSERT INTO Hotels (HotelName, Address, City, Country, Phone, Email, Website, Timezone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(hotelName, address, city, country, phone, email, website, timezone);
    
    res.status(201).json({ hotelId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create hotel' });
  }
});

// Update hotel
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { hotelName, address, city, country, phone, email, website, timezone } = req.body;
    db.prepare(`
      UPDATE Hotels SET HotelName = ?, Address = ?, City = ?, Country = ?, Phone = ?, Email = ?, Website = ?, Timezone = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE HotelID = ?
    `).run(hotelName, address, city, country, phone, email, website, timezone, req.params.id);
    
    res.json({ message: 'Hotel updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hotel' });
  }
});

// Delete hotel
router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM Hotels WHERE HotelID = ?').run(req.params.id);
    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});

// Branches
router.get('/:hotelId/branches', (req: Request, res: Response) => {
  try {
    const branches = db.prepare('SELECT * FROM HotelBranches WHERE HotelID = ?').all(req.params.hotelId);
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

router.post('/:hotelId/branches', (req: Request, res: Response) => {
  try {
    const { branchName, address, phone } = req.body;
    const result = db.prepare(`
      INSERT INTO HotelBranches (HotelID, BranchName, Address, Phone)
      VALUES (?, ?, ?, ?)
    `).run(req.params.hotelId, branchName, address, phone);
    
    res.status(201).json({ branchId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create branch' });
  }
});

// Floors
router.get('/:hotelId/floors', (req: Request, res: Response) => {
  try {
    const floors = db.prepare('SELECT * FROM Floors WHERE BranchID = ?').all(req.params.hotelId);
    res.json(floors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch floors' });
  }
});

router.post('/:hotelId/floors', (req: Request, res: Response) => {
  try {
    const { floorNumber, floorName, description } = req.body;
    const result = db.prepare(`
      INSERT INTO Floors (BranchID, FloorNumber, FloorName, Description)
      VALUES (?, ?, ?, ?)
    `).run(req.params.hotelId, floorNumber, floorName, description);
    
    res.status(201).json({ floorId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create floor' });
  }
});

export default router;
