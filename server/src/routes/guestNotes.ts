import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

// Get notes for a guest
router.get('/:id/notes', (req: Request, res: Response) => {
  try {
    const notes = db.prepare(`
      SELECT * FROM GuestNotes 
      WHERE GuestID = ? 
      ORDER BY CreatedDate DESC
    `).all(req.params.id);
    const transformedNotes = notes.map((n: any) => ({
      NoteID: n.NoteID,
      GuestID: n.GuestID,
      NoteType: n.NoteType,
      NoteContent: n.NoteContent,
      CreatedDate: n.CreatedDate
    }));
    res.json(transformedNotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guest notes' });
  }
});

// Add note to a guest
router.post('/:id/notes', (req: Request, res: Response) => {
  try {
    const { noteType, noteContent, createdBy } = req.body;
    
    if (!noteContent) {
      res.status(400).json({ error: 'Note content is required' });
      return;
    }

    const result = db.prepare(`
      INSERT INTO GuestNotes (GuestID, NoteType, NoteContent, CreatedBy)
      VALUES (?, ?, ?, ?)
    `).run(req.params.id, noteType || 'General', noteContent, createdBy || null);

    res.status(201).json({ noteId: result.lastInsertRowid });
  } catch (error) {
    console.error('Error adding guest note:', error);
    res.status(500).json({ error: 'Failed to add guest note' });
  }
});

// Update note
router.put('/notes/:noteId', (req: Request, res: Response) => {
  try {
    const { noteContent, noteType } = req.body;
    
    db.prepare(`
      UPDATE GuestNotes 
      SET NoteContent = ?, NoteType = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE NoteID = ?
    `).run(noteContent, noteType, req.params.noteId);

    res.json({ message: 'Note updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete note
router.delete('/notes/:noteId', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM GuestNotes WHERE NoteID = ?').run(req.params.noteId);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Get preferences for a guest
router.get('/:id/preferences', (req: Request, res: Response) => {
  try {
    const preferences = db.prepare(`
      SELECT * FROM GuestPreferences 
      WHERE GuestID = ? 
      ORDER BY PreferenceType
    `).all(req.params.id);
    const transformedPreferences = preferences.map((p: any) => ({
      PreferenceID: p.PreferenceID,
      GuestID: p.GuestID,
      PreferenceType: p.PreferenceType,
      PreferenceValue: p.PreferenceValue,
      Notes: p.Notes
    }));
    res.json(transformedPreferences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guest preferences' });
  }
});

// Add preference to a guest
router.post('/:id/preferences', (req: Request, res: Response) => {
  try {
    const { preferenceType, preferenceValue, notes } = req.body;
    
    if (!preferenceType) {
      res.status(400).json({ error: 'Preference type is required' });
      return;
    }

    const result = db.prepare(`
      INSERT INTO GuestPreferences (GuestID, PreferenceType, PreferenceValue, Notes)
      VALUES (?, ?, ?, ?)
    `).run(req.params.id, preferenceType, preferenceValue || null, notes || null);

    res.status(201).json({ preferenceId: result.lastInsertRowid });
  } catch (error) {
    console.error('Error adding guest preference:', error);
    res.status(500).json({ error: 'Failed to add guest preference' });
  }
});

// Delete preference
router.delete('/preferences/:preferenceId', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM GuestPreferences WHERE PreferenceID = ?').run(req.params.preferenceId);
    res.json({ message: 'Preference deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete preference' });
  }
});

export default router;
