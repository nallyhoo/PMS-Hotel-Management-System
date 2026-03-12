import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

// Get loyalty info for a guest
router.get('/:id/loyalty', (req: Request, res: Response) => {
  try {
    let loyalty = db.prepare(`
      SELECT * FROM GuestLoyalty WHERE GuestID = ?
    `).get(req.params.id);

    if (!loyalty) {
      // Create default loyalty record if doesn't exist
      const result = db.prepare(`
        INSERT INTO GuestLoyalty (GuestID, PointsBalance, LifetimePoints, TierLevel)
        VALUES (?, 0, 0, 'Bronze')
      `).run(req.params.id);
      
      loyalty = db.prepare('SELECT * FROM GuestLoyalty WHERE LoyaltyID = ?').get(result.lastInsertRowid);
    }
    
    res.json(loyalty);
  } catch (error) {
    console.error('Error fetching guest loyalty:', error);
    res.status(500).json({ error: 'Failed to fetch guest loyalty' });
  }
});

// Update loyalty info
router.put('/:id/loyalty', (req: Request, res: Response) => {
  try {
    const { pointsBalance, lifetimePoints, tierLevel, pointsExpiring, expiryDate } = req.body;
    
    const existing = db.prepare('SELECT LoyaltyID FROM GuestLoyalty WHERE GuestID = ?').get(req.params.id);
    
    if (existing) {
      db.prepare(`
        UPDATE GuestLoyalty 
        SET PointsBalance = COALESCE(?, PointsBalance),
            LifetimePoints = COALESCE(?, LifetimePoints),
            TierLevel = COALESCE(?, TierLevel),
            PointsExpiring = COALESCE(?, PointsExpiring),
            ExpiryDate = COALESCE(?, ExpiryDate),
            LastActivityDate = DATE('now'),
            UpdatedDate = CURRENT_TIMESTAMP
        WHERE GuestID = ?
      `).run(pointsBalance, lifetimePoints, tierLevel, pointsExpiring, expiryDate, req.params.id);
    } else {
      db.prepare(`
        INSERT INTO GuestLoyalty (GuestID, PointsBalance, LifetimePoints, TierLevel, PointsExpiring)
        VALUES (?, ?, ?, ?, ?)
      `).run(req.params.id, pointsBalance || 0, lifetimePoints || 0, tierLevel || 'Bronze', pointsExpiring || 0);
    }
    
    res.json({ message: 'Loyalty updated successfully' });
  } catch (error) {
    console.error('Error updating guest loyalty:', error);
    res.status(500).json({ error: 'Failed to update guest loyalty' });
  }
});

// Add points to guest
router.post('/:id/loyalty/add-points', (req: Request, res: Response) => {
  try {
    const { points, reason } = req.body;
    
    const existing = db.prepare('SELECT * FROM GuestLoyalty WHERE GuestID = ?').get(req.params.id) as any;
    
    if (existing) {
      const newBalance = (existing.PointsBalance || 0) + points;
      const newLifetime = (existing.LifetimePoints || 0) + points;
      
      // Auto-upgrade tier based on lifetime points
      let newTier = existing.TierLevel;
      if (newLifetime >= 50000) newTier = 'Diamond';
      else if (newLifetime >= 25000) newTier = 'Platinum';
      else if (newLifetime >= 10000) newTier = 'Gold';
      else if (newLifetime >= 5000) newTier = 'Silver';
      
      db.prepare(`
        UPDATE GuestLoyalty 
        SET PointsBalance = ?, LifetimePoints = ?, TierLevel = ?, LastActivityDate = DATE('now'), UpdatedDate = CURRENT_TIMESTAMP
        WHERE GuestID = ?
      `).run(newBalance, newLifetime, newTier, req.params.id);
    } else {
      let newTier = 'Bronze';
      if (points >= 5000) newTier = 'Silver';
      
      db.prepare(`
        INSERT INTO GuestLoyalty (GuestID, PointsBalance, LifetimePoints, TierLevel)
        VALUES (?, ?, ?, ?)
      `).run(req.params.id, points, points, newTier);
    }
    
    res.json({ message: 'Points added successfully' });
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({ error: 'Failed to add points' });
  }
});

// Redeem points
router.post('/:id/loyalty/redeem-points', (req: Request, res: Response) => {
  try {
    const { points } = req.body;
    
    const existing = db.prepare('SELECT * FROM GuestLoyalty WHERE GuestID = ?').get(req.params.id) as any;
    
    if (!existing || existing.PointsBalance < points) {
      res.status(400).json({ error: 'Insufficient points balance' });
      return;
    }
    
    const newBalance = existing.PointsBalance - points;
    
    db.prepare(`
      UPDATE GuestLoyalty 
      SET PointsBalance = ?, LastActivityDate = DATE('now'), UpdatedDate = CURRENT_TIMESTAMP
      WHERE GuestID = ?
    `).run(newBalance, req.params.id);
    
    res.json({ message: 'Points redeemed successfully' });
  } catch (error) {
    console.error('Error redeeming points:', error);
    res.status(500).json({ error: 'Failed to redeem points' });
  }
});

// Get documents for a guest
router.get('/:id/documents', (req: Request, res: Response) => {
  try {
    const documents = db.prepare(`
      SELECT * FROM GuestDocuments WHERE GuestID = ?
      ORDER BY CreatedDate DESC
    `).all(req.params.id);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guest documents' });
  }
});

// Add document to a guest
router.post('/:id/documents', (req: Request, res: Response) => {
  try {
    const { documentType, documentNumber, imageUrl, issueDate, expiryDate } = req.body;
    
    if (!documentType) {
      res.status(400).json({ error: 'Document type is required' });
      return;
    }

    const result = db.prepare(`
      INSERT INTO GuestDocuments (GuestID, DocumentType, DocumentNumber, ImageURL, IssueDate, ExpiryDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.params.id, documentType, documentNumber || null, imageUrl || null, issueDate || null, expiryDate || null);

    res.status(201).json({ documentId: result.lastInsertRowid });
  } catch (error) {
    console.error('Error adding guest document:', error);
    res.status(500).json({ error: 'Failed to add guest document' });
  }
});

// Delete document
router.delete('/documents/:documentId', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM GuestDocuments WHERE DocumentID = ?').run(req.params.documentId);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
