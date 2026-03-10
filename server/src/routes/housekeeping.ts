import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/tasks', (req: Request, res: Response) => {
  try {
    const { status, scheduledDate, assignedStaffId } = req.query;
    let query = `
      SELECT ht.*, r.RoomNumber, rt.TypeName, e.FirstName, e.LastName
      FROM HousekeepingTasks ht
      JOIN Rooms r ON ht.RoomID = r.RoomID
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      LEFT JOIN Employees e ON ht.AssignedStaffID = e.EmployeeID
      WHERE 1=1
    `;
    const params: any[] = [];
    if (status) { query += ' AND ht.Status = ?'; params.push(status); }
    if (scheduledDate) { query += ' AND ht.ScheduledDate = ?'; params.push(scheduledDate); }
    if (assignedStaffId) { query += ' AND ht.AssignedStaffID = ?'; params.push(assignedStaffId); }
    query += ' ORDER BY ht.ScheduledDate, ht.Priority DESC';
    const tasks = db.prepare(query).all(...params);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/tasks', (req: Request, res: Response) => {
  try {
    const { roomId, taskType, assignedStaffId, priority, scheduledDate, scheduledTime, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO HousekeepingTasks (RoomID, TaskType, AssignedStaffID, Priority, ScheduledDate, ScheduledTime, Notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(roomId, taskType, assignedStaffId, priority || 'Normal', scheduledDate, scheduledTime, notes);
    res.status(201).json({ taskId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/tasks/:id', (req: Request, res: Response) => {
  try {
    const { status, assignedStaffId, startTime, endTime, notes } = req.body;
    db.prepare(`
      UPDATE HousekeepingTasks SET Status = ?, AssignedStaffID = ?, StartTime = ?, EndTime = ?, Notes = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE TaskID = ?
    `).run(status, assignedStaffId, startTime, endTime, notes, req.params.id);

    if (status === 'Completed' || status === 'Verified') {
      const task = db.prepare('SELECT RoomID FROM HousekeepingTasks WHERE TaskID = ?').get(req.params.id) as any;
      if (task) {
        db.prepare('UPDATE Rooms SET CleaningStatus = ? WHERE RoomID = ?').run(status === 'Verified' ? 'Clean' : 'Cleaning', task.RoomID);
      }
    }
    res.json({ message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/tasks/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE HousekeepingTasks SET Status = ? WHERE TaskID = ?').run('Cancelled', req.params.id);
    res.json({ message: 'Task cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel task' });
  }
});

router.get('/status', (req: Request, res: Response) => {
  try {
    const status = db.prepare(`
      SELECT r.RoomID, r.RoomNumber, rt.TypeName, r.CleaningStatus, r.Status as RoomStatus, hs.LastCleaned, hs.NextScheduledClean
      FROM Rooms r
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      LEFT JOIN HousekeepingStatus hs ON r.RoomID = hs.RoomID
      ORDER BY r.FloorID, r.RoomNumber
    `).all();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

router.post('/logs', (req: Request, res: Response) => {
  try {
    const { roomId, staffId, taskId, cleaningType, startTime, endTime, status, notes, rating } = req.body;
    const result = db.prepare(`
      INSERT INTO CleaningLogs (RoomID, StaffID, TaskID, CleaningType, StartTime, EndTime, Status, Notes, Rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(roomId, staffId, taskId, cleaningType, startTime, endTime, status || 'Completed', notes, rating);
    res.status(201).json({ logId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create log' });
  }
});

router.get('/dashboard', (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const stats = {
      pending: db.prepare("SELECT COUNT(*) as count FROM HousekeepingTasks WHERE Status = 'Pending' AND ScheduledDate = ?").get(today) as any,
      inProgress: db.prepare("SELECT COUNT(*) as count FROM HousekeepingTasks WHERE Status = 'In Progress'").get() as any,
      completed: db.prepare("SELECT COUNT(*) as count FROM HousekeepingTasks WHERE Status = 'Completed' AND ScheduledDate = ?").get(today) as any,
      dirtyRooms: db.prepare("SELECT COUNT(*) as count FROM Rooms WHERE CleaningStatus = 'Dirty'").get() as any,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

export default router;
