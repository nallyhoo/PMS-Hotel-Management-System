import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { guestId, type, status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = 'SELECT * FROM Notifications WHERE 1=1';
    const params: any[] = [];
    
    if (guestId) { query += ' AND GuestID = ?'; params.push(guestId); }
    if (type) { query += ' AND Type = ?'; params.push(type); }
    if (status) { query += ' AND Status = ?'; params.push(status); }
    
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as any).total;
    
    query += ' ORDER BY CreatedDate DESC LIMIT ? OFFSET ?';
    const notifications = db.prepare(query).all(...params, Number(limit), offset);
    
    res.json({ data: notifications, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { guestId, reservationId, type, channel, subject, body, scheduledDate } = req.body;
    const result = db.prepare(`
      INSERT INTO Notifications (GuestID, ReservationID, Type, Channel, Subject, Body, ScheduledDate, Status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
    `).run(guestId, reservationId, type, channel, subject, body, scheduledDate);
    res.status(201).json({ notificationId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updateFields = status === 'Sent' ? ', SentDate = CURRENT_TIMESTAMP' : '';
    db.prepare(`UPDATE Notifications SET Status = ? ${updateFields} WHERE NotificationID = ?`).run(status, req.params.id);
    res.json({ message: 'Notification updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

router.get('/email-templates', (req: Request, res: Response) => {
  try {
    const templates = db.prepare('SELECT * FROM EmailTemplates WHERE IsActive = 1').all();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch email templates' });
  }
});

router.post('/email-templates', (req: Request, res: Response) => {
  try {
    const { templateName, templateType, subject, body, variables } = req.body;
    const result = db.prepare('INSERT INTO EmailTemplates (TemplateName, TemplateType, Subject, Body, Variables) VALUES (?, ?, ?, ?, ?)').run(templateName, templateType, subject, body, variables);
    res.status(201).json({ templateId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create email template' });
  }
});

router.put('/email-templates/:id', (req: Request, res: Response) => {
  try {
    const { templateName, templateType, subject, body, variables, isActive } = req.body;
    db.prepare('UPDATE EmailTemplates SET TemplateName = ?, TemplateType = ?, Subject = ?, Body = ?, Variables = ?, IsActive = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE TemplateID = ?').run(templateName, templateType, subject, body, variables, isActive, req.params.id);
    res.json({ message: 'Email template updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update email template' });
  }
});

router.get('/sms-templates', (req: Request, res: Response) => {
  try {
    const templates = db.prepare('SELECT * FROM SMSTemplates WHERE IsActive = 1').all();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SMS templates' });
  }
});

router.post('/sms-templates', (req: Request, res: Response) => {
  try {
    const { templateName, templateType, body, variables } = req.body;
    const result = db.prepare('INSERT INTO SMSTemplates (TemplateName, TemplateType, Body, Variables) VALUES (?, ?, ?, ?)').run(templateName, templateType, body, variables);
    res.status(201).json({ templateId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create SMS template' });
  }
});

router.put('/sms-templates/:id', (req: Request, res: Response) => {
  try {
    const { templateName, templateType, body, variables, isActive } = req.body;
    db.prepare('UPDATE SMSTemplates SET TemplateName = ?, TemplateType = ?, Body = ?, Variables = ?, IsActive = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE TemplateID = ?').run(templateName, templateType, body, variables, isActive, req.params.id);
    res.json({ message: 'SMS template updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update SMS template' });
  }
});

export default router;
