import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

// Dashboard stats
router.get('/dashboard', (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
      totalRequests: 0,
      pendingRequests: 0,
      inProgressRequests: 0,
      completedToday: 0,
      urgentRequests: 0,
    };
    
    const totalResult = db.prepare('SELECT COUNT(*) as count FROM MaintenanceRequests WHERE Status != ?').get('Closed') as any;
    stats.totalRequests = totalResult?.count || 0;
    
    const pendingResult = db.prepare("SELECT COUNT(*) as count FROM MaintenanceRequests WHERE Status = 'Pending'").get() as any;
    stats.pendingRequests = pendingResult?.count || 0;
    
    const inProgressResult = db.prepare("SELECT COUNT(*) as count FROM MaintenanceRequests WHERE Status = 'In Progress'").get() as any;
    stats.inProgressRequests = inProgressResult?.count || 0;
    
    const completedTodayResult = db.prepare("SELECT COUNT(*) as count FROM MaintenanceRequests WHERE Status = 'Completed' AND CompletedDate = ?").get(today) as any;
    stats.completedToday = completedTodayResult?.count || 0;
    
    const urgentResult = db.prepare("SELECT COUNT(*) as count FROM MaintenanceRequests WHERE Priority IN ('Urgent', 'High') AND Status NOT IN ('Completed', 'Closed')").get() as any;
    stats.urgentRequests = urgentResult?.count || 0;
    
    // Task distribution by type
    const taskDistribution = db.prepare(`
      SELECT RequestType as name, COUNT(*) as value
      FROM MaintenanceRequests
      WHERE Status != 'Closed'
      GROUP BY RequestType
    `).all();
    
    // Weekly performance
    const weeklyPerformance = db.prepare(`
      SELECT 
        strftime('%w', ReportedDate) as day,
        COUNT(*) as reported,
        SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) as completed
      FROM MaintenanceRequests
      WHERE ReportedDate >= date('now', '-7 days')
      GROUP BY strftime('%w', ReportedDate)
    `).all();
    
    // Recent requests
    const recentRequests = db.prepare(`
      SELECT mr.*, r.RoomNumber,
             ae.FirstName as AssignedToFirstName, ae.LastName as AssignedToLastName
      FROM MaintenanceRequests mr
      JOIN Rooms r ON mr.RoomID = r.RoomID
      LEFT JOIN MaintenanceTasks mt ON mr.RequestID = mt.RequestID
      LEFT JOIN Employees ae ON mt.AssignedStaffID = ae.EmployeeID
      ORDER BY mr.ReportedDate DESC
      LIMIT 10
    `).all();
    
    res.json({
      stats,
      taskDistribution: taskDistribution || [],
      weeklyPerformance: weeklyPerformance || [],
      recentRequests: recentRequests || [],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

router.get('/requests', (req: Request, res: Response) => {
  try {
    const { status, priority, roomId } = req.query;
    let query = `
      SELECT mr.*, r.RoomNumber, e.FirstName, e.LastName as ReportedByName,
             ae.FirstName as AssignedToFirstName, ae.LastName as AssignedToLastName
      FROM MaintenanceRequests mr
      JOIN Rooms r ON mr.RoomID = r.RoomID
      LEFT JOIN Employees e ON mr.ReportedBy = e.EmployeeID
      LEFT JOIN MaintenanceTasks mt ON mr.RequestID = mt.RequestID
      LEFT JOIN Employees ae ON mt.AssignedStaffID = ae.EmployeeID
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
    const { status, scheduledDate, estimatedCost, actualCost, notes, priority } = req.body;
    const current = db.prepare('SELECT Status, RoomID FROM MaintenanceRequests WHERE RequestID = ?').get(req.params.id) as any;
    
    db.prepare(`
      UPDATE MaintenanceRequests SET Status = ?, ScheduledDate = ?, EstimatedCost = ?, ActualCost = ?, Notes = ?, Priority = COALESCE(?, Priority)
      WHERE RequestID = ?
    `).run(status, scheduledDate, estimatedCost, actualCost, notes, priority, req.params.id);

    // Update room status based on maintenance status
    if (current && current.Status !== status) {
      if (status === 'In Progress') {
        db.prepare("UPDATE Rooms SET Status = 'Maintenance' WHERE RoomID = ?").run(current.RoomID);
      } else if (status === 'Completed' || status === 'Closed') {
        db.prepare("UPDATE Rooms SET Status = 'Available' WHERE RoomID = ? AND Status = 'Maintenance'").run(current.RoomID);
      }
      
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
    
    // Get the request to find the room
    const request = db.prepare('SELECT RoomID, RequestType FROM MaintenanceRequests WHERE RequestID = ?').get(requestId) as any;
    
    const result = db.prepare(`
      INSERT INTO MaintenanceTasks (RequestID, AssignedStaffID, StartDate, Status)
      VALUES (?, ?, ?, 'In Progress')
    `).run(requestId, assignedStaffId, startDate);
    
    // Update request status to In Progress
    db.prepare("UPDATE MaintenanceRequests SET Status = 'In Progress' WHERE RequestID = ?").run(requestId);
    
    // Update room to Maintenance
    if (request?.RoomID) {
      db.prepare("UPDATE Rooms SET Status = 'Maintenance' WHERE RoomID = ?").run(request.RoomID);
    }
    
    res.status(201).json({ taskId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/tasks/:id', (req: Request, res: Response) => {
  try {
    const { status, completionDate, notes } = req.body;
    const currentTask = db.prepare('SELECT RequestID FROM MaintenanceTasks WHERE TaskID = ?').get(req.params.id) as any;
    
    db.prepare(`
      UPDATE MaintenanceTasks SET Status = ?, CompletionDate = ?, Notes = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE TaskID = ?
    `).run(status, completionDate, notes, req.params.id);

    if (status === 'Completed' && currentTask?.RequestID) {
      // Get the request and room
      const request = db.prepare('SELECT RoomID FROM MaintenanceRequests WHERE RequestID = ?').get(currentTask.RequestID) as any;
      
      // Update request to Completed
      db.prepare("UPDATE MaintenanceRequests SET Status = 'Completed', CompletedDate = CURRENT_TIMESTAMP WHERE RequestID = ?").run(currentTask.RequestID);
      
      // Update room back to Available
      if (request?.RoomID) {
        db.prepare("UPDATE Rooms SET Status = 'Available' WHERE RoomID = ? AND Status = 'Maintenance'").run(request.RoomID);
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

// Get maintenance staff
router.get('/staff', (req: Request, res: Response) => {
  try {
    const staff = db.prepare(`
      SELECT e.EmployeeID, e.FirstName, e.LastName, e.Position, d.DepartmentName,
             (SELECT COUNT(*) FROM MaintenanceTasks mt 
              JOIN MaintenanceRequests mr ON mt.RequestID = mr.RequestID 
              WHERE mt.AssignedStaffID = e.EmployeeID AND mt.Status = 'In Progress') as activeTasks
      FROM Employees e
      JOIN Departments d ON e.DepartmentID = d.DepartmentID
      WHERE d.DepartmentName IN ('Maintenance', 'Engineering')
      AND e.IsActive = 1
      ORDER BY e.FirstName
    `).all();
    res.json(staff || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

export default router;
