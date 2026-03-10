import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

// Get all rooms with optional filters
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, floorId, roomTypeId, branchId } = req.query;
    
    let query = `
      SELECT r.*, rt.TypeName as RoomTypeName, f.FloorNumber
      FROM Rooms r
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      LEFT JOIN Floors f ON r.FloorID = f.FloorID
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND r.Status = ?';
      params.push(status);
    }
    if (floorId) {
      query += ' AND r.FloorID = ?';
      params.push(floorId);
    }
    if (roomTypeId) {
      query += ' AND r.RoomTypeID = ?';
      params.push(roomTypeId);
    }
    if (branchId) {
      query += ' AND r.BranchID = ?';
      params.push(branchId);
    }

    query += ' ORDER BY r.RoomNumber';
    
    const rooms = db.prepare(query).all(...params);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const room = db.prepare(`
      SELECT r.*, rt.TypeName as RoomTypeName, f.FloorNumber
      FROM Rooms r
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      LEFT JOIN Floors f ON r.FloorID = f.FloorID
      WHERE r.RoomID = ?
    `).get(req.params.id);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Create room
router.post('/', (req: Request, res: Response) => {
  try {
    const { branchId, roomNumber, roomTypeId, floorId, status, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO Rooms (BranchID, RoomNumber, RoomTypeID, FloorID, Status, Notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(branchId, roomNumber, roomTypeId, floorId, status || 'Available', notes);
    
    res.status(201).json({ roomId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Update room
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { roomNumber, roomTypeId, floorId, status, cleaningStatus, notes } = req.body;
    db.prepare(`
      UPDATE Rooms SET RoomNumber = ?, RoomTypeID = ?, FloorID = ?, Status = ?, CleaningStatus = ?, Notes = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE RoomID = ?
    `).run(roomNumber, roomTypeId, floorId, status, cleaningStatus, notes, req.params.id);
    
    res.json({ message: 'Room updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// Delete room
router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM Rooms WHERE RoomID = ?').run(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

// Check room availability
router.get('/availability/check', (req: Request, res: Response) => {
  try {
    const { checkIn, checkOut, roomTypeId, guests } = req.query;

    const availableRooms = db.prepare(`
      SELECT r.*, rt.TypeName, rt.BasePrice, rt.Capacity
      FROM Rooms r
      JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      WHERE r.Status = 'Available'
      ${roomTypeId ? 'AND r.RoomTypeID = ?' : ''}
      AND r.RoomID NOT IN (
        SELECT RoomID FROM Reservations
        WHERE Status IN ('Confirmed', 'Checked In')
        AND CheckInDate < ?
        AND CheckOutDate > ?
      )
      ORDER BY r.RoomNumber
    `).all(checkOut, checkIn, roomTypeId || null);

    res.json(availableRooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Room Types
router.get('/types/list', (req: Request, res: Response) => {
  try {
    const roomTypes = db.prepare('SELECT * FROM RoomTypes WHERE IsActive = 1').all();
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room types' });
  }
});

router.get('/types/:id', (req: Request, res: Response) => {
  try {
    const roomType = db.prepare('SELECT * FROM RoomTypes WHERE RoomTypeID = ?').get(req.params.id);
    if (!roomType) {
      return res.status(404).json({ error: 'Room type not found' });
    }
    res.json(roomType);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room type' });
  }
});

router.post('/types', (req: Request, res: Response) => {
  try {
    const { typeName, description, capacity, basePrice, maxOccupancy, bedType, sizeSqFt } = req.body;
    const result = db.prepare(`
      INSERT INTO RoomTypes (TypeName, Description, Capacity, BasePrice, MaxOccupancy, BedType, SizeSqFt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(typeName, description, capacity, basePrice, maxOccupancy, bedType, sizeSqFt);
    
    res.status(201).json({ roomTypeId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room type' });
  }
});

router.put('/types/:id', (req: Request, res: Response) => {
  try {
    const { typeName, description, capacity, basePrice, maxOccupancy, bedType, sizeSqFt, isActive } = req.body;
    db.prepare(`
      UPDATE RoomTypes SET TypeName = ?, Description = ?, Capacity = ?, BasePrice = ?, MaxOccupancy = ?, BedType = ?, SizeSqFt = ?, IsActive = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE RoomTypeID = ?
    `).run(typeName, description, capacity, basePrice, maxOccupancy, bedType, sizeSqFt, isActive, req.params.id);
    
    res.json({ message: 'Room type updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update room type' });
  }
});

router.delete('/types/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE RoomTypes SET IsActive = 0 WHERE RoomTypeID = ?').run(req.params.id);
    res.json({ message: 'Room type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room type' });
  }
});

// Room Amenities
router.get('/amenities', (req: Request, res: Response) => {
  try {
    const amenities = db.prepare('SELECT * FROM RoomAmenities').all();
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

router.post('/amenities', (req: Request, res: Response) => {
  try {
    const { amenityName, amenityType, description, icon } = req.body;
    const result = db.prepare(`
      INSERT INTO RoomAmenities (AmenityName, AmenityType, Description, Icon)
      VALUES (?, ?, ?, ?)
    `).run(amenityName, amenityType, description, icon);
    
    res.status(201).json({ amenityId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create amenity' });
  }
});

// Room Status Board
router.get('/status-board', (req: Request, res: Response) => {
  try {
    const statusBoard = db.prepare(`
      SELECT 
        rt.TypeName,
        COUNT(r.RoomID) as Total,
        SUM(CASE WHEN r.Status = 'Available' THEN 1 ELSE 0 END) as Available,
        SUM(CASE WHEN r.Status = 'Occupied' THEN 1 ELSE 0 END) as Occupied,
        SUM(CASE WHEN r.Status = 'Dirty' THEN 1 ELSE 0 END) as Dirty,
        SUM(CASE WHEN r.Status = 'Maintenance' THEN 1 ELSE 0 END) as Maintenance,
        SUM(CASE WHEN r.Status = 'Reserved' THEN 1 ELSE 0 END) as Reserved
      FROM Rooms r
      JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      GROUP BY rt.RoomTypeID
    `).all();
    
    res.json(statusBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status board' });
  }
});

export default router;
