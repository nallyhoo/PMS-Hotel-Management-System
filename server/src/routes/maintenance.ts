import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/requests', (req: Request, res: Response) => {
  try {
    const { status, priority, roomId } = req.query;
    let query = `
      SELECT mr.*, r.RoomNumber, e.FirstName, e.LastName as ReportedByName
      FROM MaintenanceRequests mr
      JOIN Rooms r ON mr.RoomID = r.RoomID
      LEFT JOIN Employees e ON mr.ReportedBy = e.EmployeeID
      WHERE 1=1
    `;
    const params: any[] = [];
    if (status) { query += ' AND mr.Status = ?'; params.push(status); }
    if (priority) { query += ' AND mr.Priority = ?'; params.push(priority); }
    if (roomId) { query += ' AND mr.RoomID = ?'; params.push(roomId); }
    query += ' ORDER BY mr.ReportedDate DESC';
    const requests = db.prepare(query).all(...params);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

router.get('/requests/:id', (req: Request, res: Response) => {
  try {
    const request = db.prepare(`
      SELECT mr.*, r.RoomNumber, rt.TypeName, e.FirstName, e.LastName
      FROM MaintenanceRequests mr
      JOIN Rooms r ON mr.RoomID = r.RoomID
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      LEFT JOIN Employees e ON mr.ReportedBy = e.EmployeeID
      WHERE mr.RequestID = ?
    `).get(req.params.id);
    const tasks = db.prepare('SELECT * FROM MaintenanceTasks WHERE RequestID = ?').all(req.params.id);
    const history = db.prepare('SELECT * FROM MaintenanceHistory WHERE RequestID = ? ORDER BY UpdateDate DESC').all(req.params.id);
    res.json({ ...request, tasks, history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

router.post('/requests', (req: Request, res: Response) => {
  try {
    const { roomId, requestType, priority, description, reportedBy, scheduledDate, estimatedCost } = req.body;
    const result = db.prepare(`
      INSERT INTO MaintenanceRequests (RoomID, RequestType, Priority, Description, ReportedBy, ScheduledDate, EstimatedCost)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(roomId, requestType, priority || 'Normal', description, reportedBy, scheduledDate, estimatedCost);
    res.status(201).json({ requestId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

router.put('/requests/:id', (req: Request, res: Response) => {
  try {
    const { status, scheduledDate, estimatedCost, actualCost, notes } = req.body;
    const current = db.prepare('SELECT Status FROM MaintenanceRequests WHERE RequestID = ?').get(req.params.id) as any;
    
    db.prepare(`
      UPDATE MaintenanceRequests SET Status = ?, ScheduledDate = ?, EstimatedCost = ?, ActualCost = ?, Notes = ?
      WHERE RequestID = ?
    `).run(status, scheduledDate, estimatedCost, actualCost, notes, req.params.id);

    if (current && current.Status !== status) {
      db.prepare(`
        INSERT INTO MaintenanceHistory (RequestID, Status, Notes)
        VALUES (?, ?, ?)
      `).run(req.params.id, status, `Status changed from ${current.Status} to ${status}`);
    }
    res.json({ message: 'Request updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

router.post('/tasks', (req: Request, res: Response) => {
  try {
    const { requestId, assignedStaffId, startDate } = req.body;
    const result = db.prepare(`
      INSERT INTO MaintenanceTasks (RequestID, AssignedStaffID, StartDate, Status)
      VALUES (?, ?, ?, 'In Progress')
    `).run(requestId, assignedStaffId, startDate);
    res.status(201).json({ taskId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/tasks/:id', (req: Request, res: Response) => {
  try {
    const { status, completionDate, notes } = req.body;
    db.prepare(`
      UPDATE MaintenanceTasks SET Status = ?, CompletionDate = ?, Notes = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE TaskID = ?
    `).run(status, completionDate, notes, req.params.id);

    if (status === 'Completed') {
      const task = db.prepare('SELECT RequestID FROM MaintenanceTasks WHERE TaskID = ?').get(req.params.id) as any;
      if (task) {
        db.prepare('UPDATE MaintenanceRequests SET Status = ? WHERE RequestID = ?').run('Completed', task.RequestID);
      }
    }
    res.json({ message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.get('/history', (req: Request, res: Response) => {
  try {
    const { roomId, startDate, endDate } = req.query;
    let query = `
      SELECT mr.*, r.RoomNumber, rt.TypeName
      FROM MaintenanceRequests mr
      JOIN Rooms r ON mr.RoomID = r.RoomID
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      WHERE mr.Status IN ('Completed', 'Closed')
    `;
    const params: any[] = [];
    if (roomId) { query += ' AND mr.RoomID = ?'; params.push(roomId); }
    if (startDate) { query += ' AND mr.ReportedDate >= ?'; params.push(startDate); }
    if (endDate) { query += ' AND mr.ReportedDate <= ?'; params.push(endDate); }
    query += ' ORDER BY mr.ReportedDate DESC';
    const history = db.prepare(query).all(...params);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
