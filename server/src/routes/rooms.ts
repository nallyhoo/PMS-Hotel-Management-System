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
    const transformedRooms = rooms.map((room: any) => ({
      roomId: room.RoomID,
      branchId: room.BranchID,
      roomNumber: room.RoomNumber,
      roomTypeId: room.RoomTypeID,
      floorId: room.FloorID,
      status: room.Status,
      currentReservationId: room.CurrentReservationID,
      cleaningStatus: room.CleaningStatus,
      notes: room.Notes,
      lastCleaned: room.LastCleaned,
      createdDate: room.CreatedDate,
      updatedDate: room.UpdatedDate,
      roomTypeName: room.RoomTypeName,
      floorNumber: room.FloorNumber
    }));
    res.json(transformedRooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const room: any = db.prepare(`
      SELECT r.*, rt.TypeName as RoomTypeName, f.FloorNumber
      FROM Rooms r
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      LEFT JOIN Floors f ON r.FloorID = f.FloorID
      WHERE r.RoomID = ?
    `).get(req.params.id);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const transformed = {
      roomId: room.RoomID,
      branchId: room.BranchID,
      roomNumber: room.RoomNumber,
      roomTypeId: room.RoomTypeID,
      floorId: room.FloorID,
      status: room.Status,
      currentReservationId: room.CurrentReservationID,
      cleaningStatus: room.CleaningStatus,
      notes: room.Notes,
      lastCleaned: room.LastCleaned,
      createdDate: room.CreatedDate,
      updatedDate: room.UpdatedDate,
      roomTypeName: room.RoomTypeName,
      floorNumber: room.FloorNumber,
    };
    res.json(transformed);
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

    let query = `
      SELECT r.*, rt.TypeName, rt.BasePrice, rt.Capacity
      FROM Rooms r
      JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      WHERE 1=1
    `;
    const params: any[] = [];

    if (roomTypeId) {
      query += ' AND r.RoomTypeID = ?';
      params.push(roomTypeId);
    }

    query += ` AND r.RoomID NOT IN (
      SELECT AssignedRoomID FROM Reservations
      WHERE Status IN ('Confirmed', 'Checked In')
      AND AssignedRoomID IS NOT NULL
      AND CheckInDate < ?
      AND CheckOutDate > ?
    ) ORDER BY r.RoomNumber`;

    params.push(checkOut, checkIn);
    const availableRooms = db.prepare(query).all(...params);

    const transformedRooms = availableRooms.map((room: any) => ({
      roomId: room.RoomID,
      roomNumber: room.RoomNumber,
      roomTypeId: room.RoomTypeID,
      typeName: room.TypeName,
      basePrice: room.BasePrice,
      capacity: room.Capacity,
      status: room.Status,
      floorId: room.FloorID,
      branchId: room.BranchID
    }));

    res.json(transformedRooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Room Types
router.get('/types/list', (req: Request, res: Response) => {
  try {
    const roomTypes = db.prepare('SELECT * FROM RoomTypes WHERE IsActive = 1').all();
    const transformed = roomTypes.map((rt: any) => ({
      roomTypeId: rt.RoomTypeID,
      typeName: rt.TypeName,
      description: rt.Description,
      capacity: rt.Capacity,
      basePrice: rt.BasePrice,
      maxOccupancy: rt.MaxOccupancy,
      bedType: rt.BedType,
      sizeSqFt: rt.SizeSqFt,
      isActive: rt.IsActive,
    }));
    res.json(transformed);
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
    const rt: any = roomType;
    res.json({
      roomTypeId: rt.RoomTypeID,
      typeName: rt.TypeName,
      description: rt.Description,
      capacity: rt.Capacity,
      basePrice: rt.BasePrice,
      maxOccupancy: rt.MaxOccupancy,
      bedType: rt.BedType,
      sizeSqFt: rt.SizeSqFt,
      isActive: rt.IsActive,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room type' });
  }
});

router.post('/types', (req: Request, res: Response) => {
  try {
    const { typeName, description, capacity, basePrice, maxOccupancy, bedType, sizeSqFt } = req.body;
    
    // Validate required fields
    if (!typeName || !typeName.trim()) {
      res.status(400).json({ error: 'Room type name is required' });
      return;
    }

    // Check for duplicate name (including inactive - to prevent unique constraint violations)
    const existing = db.prepare('SELECT RoomTypeID, IsActive FROM RoomTypes WHERE TypeName = ?').get(typeName) as { RoomTypeID: number; IsActive: number } | undefined;
    if (existing) {
      if (existing.IsActive === 1) {
        res.status(400).json({ error: 'A room type with this name already exists' });
        return;
      } else {
        // Reactivate the soft-deleted room type instead of creating new
        db.prepare(`
          UPDATE RoomTypes SET IsActive = 1, Description = ?, Capacity = ?, BasePrice = ?, MaxOccupancy = ?, BedType = ?, SizeSqFt = ?, UpdatedDate = CURRENT_TIMESTAMP
          WHERE RoomTypeID = ?
        `).run(description, capacity, basePrice, maxOccupancy, bedType, sizeSqFt, existing.RoomTypeID);
        
        res.status(201).json({ roomTypeId: existing.RoomTypeID });
        return;
      }
    }

    const result = db.prepare(`
      INSERT INTO RoomTypes (TypeName, Description, Capacity, BasePrice, MaxOccupancy, BedType, SizeSqFt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(typeName, description, capacity, basePrice, maxOccupancy, bedType, sizeSqFt);
    
    res.status(201).json({ roomTypeId: result.lastInsertRowid });
  } catch (error: any) {
    console.error('Error creating room type:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'A room type with this name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create room type' });
    }
  }
});

router.put('/types/:id', (req: Request, res: Response) => {
  try {
    const { typeName, description, capacity, basePrice, maxOccupancy, bedType, sizeSqFt, isActive } = req.body;
    
    // Validate required fields
    if (!typeName || !typeName.trim()) {
      res.status(400).json({ error: 'Room type name is required' });
      return;
    }

    // Check for duplicate name (excluding current room type)
    const existing = db.prepare('SELECT RoomTypeID FROM RoomTypes WHERE TypeName = ? AND RoomTypeID != ?').get(typeName, req.params.id) as { RoomTypeID: number } | undefined;
    if (existing) {
      res.status(400).json({ error: 'A room type with this name already exists' });
      return;
    }

    db.prepare(`
      UPDATE RoomTypes SET TypeName = ?, Description = ?, Capacity = ?, BasePrice = ?, MaxOccupancy = ?, BedType = ?, SizeSqFt = ?, IsActive = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE RoomTypeID = ?
    `).run(typeName, description, capacity, basePrice, maxOccupancy, bedType, sizeSqFt, isActive, req.params.id);
    
    res.json({ message: 'Room type updated successfully' });
  } catch (error: any) {
    console.error('Error updating room type:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'A room type with this name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update room type' });
    }
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

// Get all floors
router.get('/floors/list', (req: Request, res: Response) => {
  try {
    const floors = db.prepare('SELECT * FROM Floors WHERE BranchID = 1 ORDER BY FloorNumber').all();
    res.json(floors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch floors' });
  }
});

// Create new floor
router.post('/floors', (req: Request, res: Response) => {
  try {
    const { floorNumber, floorName, description } = req.body;
    const result = db.prepare(`
      INSERT INTO Floors (BranchID, FloorNumber, FloorName, Description)
      VALUES (1, ?, ?, ?)
    `).run(floorNumber, floorName, description);
    res.status(201).json({ floorId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create floor' });
  }
});

// Update floor
router.put('/floors/:id', (req: Request, res: Response) => {
  try {
    const { floorNumber, floorName, description } = req.body;
    db.prepare(`
      UPDATE Floors SET FloorNumber = ?, FloorName = ?, Description = ?
      WHERE FloorID = ?
    `).run(floorNumber, floorName, description, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update floor' });
  }
});

// Delete floor
router.delete('/floors/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM Floors WHERE FloorID = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete floor' });
  }
});

// Get images for a room type
router.get('/types/:id/images', (req: Request, res: Response) => {
  try {
    const roomTypeId = parseInt(req.params.id);
    const images = db.prepare('SELECT * FROM RoomImages WHERE RoomTypeID = ? ORDER BY SortOrder, CreatedDate').all(roomTypeId);
    const transformed = images.map((img: any) => ({
      imageId: img.ImageID,
      roomTypeId: img.RoomTypeID,
      imageUrl: img.ImageURL,
      isPrimary: img.IsPrimary,
      sortOrder: img.SortOrder,
    }));
    res.json(transformed);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Add image to room type
router.post('/types/:id/images', (req: Request, res: Response) => {
  try {
    const { imageUrl, isPrimary, sortOrder } = req.body;
    const roomTypeId = parseInt(req.params.id);
    
    if (isNaN(roomTypeId)) {
      return res.status(400).json({ error: 'Invalid room type ID' });
    }
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
    
    const result = db.prepare(
      'INSERT INTO RoomImages (RoomTypeID, ImageURL, IsPrimary, SortOrder) VALUES (?, ?, ?, ?)'
    ).run(roomTypeId, imageUrl, isPrimary ? 1 : 0, sortOrder || 0);
    res.json({ imageId: result.lastInsertRowid });
  } catch (error) {
    console.error('Error adding image:', error);
    res.status(500).json({ error: 'Failed to add image' });
  }
});

// Delete image from room type
router.delete('/images/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM RoomImages WHERE ImageID = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
