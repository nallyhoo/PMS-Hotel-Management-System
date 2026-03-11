import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

// Get all guests with pagination
router.get('/', (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, search, vipStatus } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = 'SELECT * FROM Guests WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (vipStatus) {
      query += ' AND VIPStatus = ?';
      params.push(vipStatus);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as any).total;

    query += ' ORDER BY GuestID DESC LIMIT ? OFFSET ?';
    const guests = db.prepare(query).all(...params, Number(limit), offset);

    const transformedGuests = guests.map((guest: any) => ({
      guestId: guest.GuestID,
      firstName: guest.FirstName,
      lastName: guest.LastName,
      email: guest.Email,
      phone: guest.Phone,
      alternatePhone: guest.AlternatePhone,
      nationality: guest.Nationality,
      dateOfBirth: guest.DateOfBirth,
      gender: guest.Gender,
      address: guest.Address,
      city: guest.City,
      country: guest.Country,
      postalCode: guest.PostalCode,
      vipStatus: guest.VIPStatus,
      blacklistReason: guest.BlacklistReason,
      marketingConsent: guest.MarketingConsent === 1,
      notes: guest.Notes,
      createdDate: guest.CreatedDate,
      updatedDate: guest.UpdatedDate
    }));

    res.json({
      data: transformedGuests,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guests' });
  }
});

// Get guest by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const guest = db.prepare('SELECT * FROM Guests WHERE GuestID = ?').get(req.params.id);
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guest' });
  }
});

// Create guest
router.post('/', (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, nationality, dateOfBirth, gender, address, city, country, postalCode, vipStatus, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO Guests (FirstName, LastName, Email, Phone, Nationality, DateOfBirth, Gender, Address, City, Country, PostalCode, VIPStatus, Notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(firstName, lastName, email, phone, nationality, dateOfBirth, gender, address, city, country, postalCode, vipStatus || 'Regular', notes);
    
    res.status(201).json({ guestId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create guest' });
  }
});

// Update guest
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, nationality, dateOfBirth, gender, address, city, country, postalCode, vipStatus, notes } = req.body;
    db.prepare(`
      UPDATE Guests SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Nationality = ?, DateOfBirth = ?, Gender = ?, Address = ?, City = ?, Country = ?, PostalCode = ?, VIPStatus = ?, Notes = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE GuestID = ?
    `).run(firstName, lastName, email, phone, nationality, dateOfBirth, gender, address, city, country, postalCode, vipStatus, notes, req.params.id);
    
    res.json({ message: 'Guest updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update guest' });
  }
});

// Delete guest (soft delete)
router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE Guests SET VIPStatus = ? WHERE GuestID = ?').run('Blacklist', req.params.id);
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete guest' });
  }
});

// Guest Documents
router.get('/:id/documents', (req: Request, res: Response) => {
  try {
    const documents = db.prepare('SELECT * FROM GuestDocuments WHERE GuestID = ?').all(req.params.id);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

router.post('/:id/documents', (req: Request, res: Response) => {
  try {
    const { documentType, documentNumber, issueDate, expiryDate, imageUrl } = req.body;
    const result = db.prepare(`
      INSERT INTO GuestDocuments (GuestID, DocumentType, DocumentNumber, IssueDate, ExpiryDate, ImageURL)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.params.id, documentType, documentNumber, issueDate, expiryDate, imageUrl);
    
    res.status(201).json({ documentId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add document' });
  }
});

// Guest Preferences
router.get('/:id/preferences', (req: Request, res: Response) => {
  try {
    const preferences = db.prepare('SELECT * FROM GuestPreferences WHERE GuestID = ?').all(req.params.id);
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

router.post('/:id/preferences', (req: Request, res: Response) => {
  try {
    const { preferenceType, preferenceValue, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO GuestPreferences (GuestID, PreferenceType, PreferenceValue, Notes)
      VALUES (?, ?, ?, ?)
    `).run(req.params.id, preferenceType, preferenceValue, notes);
    
    res.status(201).json({ preferenceId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add preference' });
  }
});

// Guest Loyalty
router.get('/:id/loyalty', (req: Request, res: Response) => {
  try {
    let loyalty = db.prepare('SELECT * FROM GuestLoyalty WHERE GuestID = ?').get(req.params.id);
    
    if (!loyalty) {
      const result = db.prepare('INSERT INTO GuestLoyalty (GuestID) VALUES (?)').run(req.params.id);
      loyalty = { loyaltyId: result.lastInsertRowid, guestId: req.params.id, points: 0, tierLevel: 'Bronze' };
    }
    
    res.json(loyalty);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch loyalty' });
  }
});

router.put('/:id/loyalty', (req: Request, res: Response) => {
  try {
    const { points, tierLevel } = req.body;
    
    const existing = db.prepare('SELECT * FROM GuestLoyalty WHERE GuestID = ?').get(req.params.id);
    
    if (existing) {
      db.prepare('UPDATE GuestLoyalty SET Points = Points + ?, TierLevel = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE GuestID = ?')
        .run(points, tierLevel, req.params.id);
    } else {
      db.prepare('INSERT INTO GuestLoyalty (GuestID, Points, TierLevel) VALUES (?, ?, ?)')
        .run(req.params.id, points, tierLevel);
    }
    
    res.json({ message: 'Loyalty updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update loyalty' });
  }
});

// Guest Reservation History
router.get('/:id/reservations', (req: Request, res: Response) => {
  try {
    const reservations = db.prepare(`
      SELECT r.*, rt.TypeName as RoomTypeName
      FROM Reservations r
      LEFT JOIN RoomTypes rt ON r.AssignedRoomID = rt.RoomTypeID
      WHERE r.GuestID = ?
      ORDER BY r.CheckInDate DESC
    `).all(req.params.id);
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

export default router;
