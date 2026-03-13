import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/tasks', (req: Request, res: Response) => {
  try {
    const { status, scheduledDate, assignedStaffId, priority } = req.query;
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
    if (assignedStaffId) { query += ' AND ht.AssignedStaffID = ?'; params.push(Number(assignedStaffId)); }
    if (priority) { query += ' AND ht.Priority = ?'; params.push(priority); }
    query += " ORDER BY CASE ht.Priority WHEN 'Urgent' THEN 1 WHEN 'High' THEN 2 WHEN 'Normal' THEN 3 WHEN 'Low' THEN 4 END, ht.ScheduledDate, ht.ScheduledTime";
    
    console.log('Executing query:', query);
    console.log('Params:', params);
    
    const tasks = db.prepare(query).all(...params);
    console.log('Tasks found:', tasks.length);
    res.json(tasks);
  } catch (error: any) {
    console.error('Error fetching housekeeping tasks:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
});

router.get('/tasks/:id', (req: Request, res: Response) => {
  try {
    const task = db.prepare(`
      SELECT ht.*, r.RoomNumber, rt.TypeName, e.FirstName, e.LastName
      FROM HousekeepingTasks ht
      JOIN Rooms r ON ht.RoomID = r.RoomID
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      LEFT JOIN Employees e ON ht.AssignedStaffID = e.EmployeeID
      WHERE ht.TaskID = ?
    `).get(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
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
    const taskId = req.params.id;
    
    console.log('PUT /tasks/:id - Task ID:', taskId, 'Status:', status);
    
    const currentTask = db.prepare('SELECT RoomID, Status as currentStatus FROM HousekeepingTasks WHERE TaskID = ?').get(taskId) as any;
    console.log('Current task:', currentTask);
    
    if (!currentTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    db.prepare(`
      UPDATE HousekeepingTasks SET Status = ?, AssignedStaffID = ?, StartTime = ?, EndTime = ?, Notes = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE TaskID = ?
    `).run(status, assignedStaffId || null, startTime || null, endTime || null, notes || null, taskId);

    if (status === 'In Progress') {
      db.prepare('UPDATE Rooms SET CleaningStatus = ? WHERE RoomID = ?').run('Cleaning', currentTask.RoomID);
      console.log('Room', currentTask.RoomID, 'set to Cleaning');
    }
    else if (status === 'Completed') {
      db.prepare("UPDATE Rooms SET CleaningStatus = 'Clean', Status = 'Available' WHERE RoomID = ?").run(currentTask.RoomID);
      console.log('Room', currentTask.RoomID, 'set to Clean and Available');
    }
    else if (status === 'Verified') {
      db.prepare("UPDATE Rooms SET CleaningStatus = 'Inspected', Status = 'Available' WHERE RoomID = ?").run(currentTask.RoomID);
      console.log('Room', currentTask.RoomID, 'set to Inspected and Available');
    }
    else if (status === 'Cancelled') {
      const otherActiveTasks = db.prepare(`
        SELECT COUNT(*) as count FROM HousekeepingTasks 
        WHERE RoomID = ? AND Status IN ('Pending', 'In Progress') AND TaskID != ?
      `).get(currentTask.RoomID, taskId) as any;
      
      if (!otherActiveTasks || otherActiveTasks.count === 0) {
        const lastStatus = db.prepare('SELECT CleaningStatus FROM Rooms WHERE RoomID = ?').get(currentTask.RoomID) as any;
        if (lastStatus && lastStatus.CleaningStatus === 'Cleaning') {
          db.prepare('UPDATE Rooms SET CleaningStatus = ? WHERE RoomID = ?').run('Dirty', currentTask.RoomID);
          
          db.prepare(`
            INSERT OR REPLACE INTO HousekeepingStatus (RoomID, CleaningStatus, UpdatedTime, Notes)
            VALUES (?, 'Dirty', CURRENT_TIMESTAMP, ?)
          `).run(currentTask.RoomID, `Task #${taskId} cancelled - room marked dirty`);
        }
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

router.post('/tasks/:id/request-inspection', (req: Request, res: Response) => {
  try {
    const { notes } = req.body;
    const taskId = req.params.id;
    
    const task = db.prepare('SELECT RoomID, Status FROM HousekeepingTasks WHERE TaskID = ?').get(taskId) as any;
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.Status !== 'Completed') {
      return res.status(400).json({ error: 'Task must be completed before requesting inspection' });
    }

    const inspectionTask = db.prepare(`
      INSERT INTO HousekeepingTasks (RoomID, TaskType, Priority, ScheduledDate, Notes)
      VALUES (?, 'Inspection', 'High', CURRENT_DATE, ?)
    `).run(task.RoomID, `Inspection for completed task #${taskId}. ${notes || ''}`);

    res.json({ message: 'Inspection requested', inspectionTaskId: inspectionTask.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to request inspection' });
  }
});

router.post('/tasks/:id/approve', (req: Request, res: Response) => {
  try {
    const { approved, notes, rating } = req.body;
    const taskId = req.params.id;
    
    const task = db.prepare('SELECT RoomID FROM HousekeepingTasks WHERE TaskID = ?').get(taskId) as any;
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (approved) {
      db.prepare('UPDATE HousekeepingTasks SET Status = ?, Notes = COALESCE(?, Notes) WHERE TaskID = ?').run('Verified', notes, taskId);
      db.prepare("UPDATE Rooms SET CleaningStatus = 'Inspected', Status = 'Available' WHERE RoomID = ?").run(task.RoomID);
      
      db.prepare(`
        INSERT OR REPLACE INTO HousekeepingStatus (RoomID, CleaningStatus, LastCleaned, UpdatedTime, Notes)
        VALUES (?, 'Inspected', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
      `).run(task.RoomID, `Inspection approved - Task #${taskId}. ${notes || ''}`);
      
      res.json({ message: 'Task verified and approved' });
    } else {
      db.prepare('UPDATE HousekeepingTasks SET Status = ?, Notes = COALESCE(?, Notes) WHERE TaskID = ?').run('Pending', notes, taskId);
      db.prepare("UPDATE Rooms SET CleaningStatus = 'Dirty', Status = 'Dirty' WHERE RoomID = ?").run(task.RoomID);
      
      db.prepare(`
        INSERT OR REPLACE INTO HousekeepingStatus (RoomID, CleaningStatus, UpdatedTime, Notes)
        VALUES (?, 'Dirty', CURRENT_TIMESTAMP, ?)
      `).run(task.RoomID, `Inspection failed - Task #${taskId}. ${notes || ''}. Re-cleaning required.`);
      
      res.json({ message: 'Inspection failed - re-cleaning required' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to process approval' });
  }
});

router.get('/status', (req: Request, res: Response) => {
  try {
    const status = db.prepare(`
      SELECT r.RoomID, r.RoomNumber, rt.TypeName, r.CleaningStatus, r.Status as RoomStatus, r.FloorID,
        hs.LastCleaned, hs.NextScheduledClean, hs.Notes as StatusNotes,
        (SELECT COUNT(*) FROM HousekeepingTasks ht WHERE ht.RoomID = r.RoomID AND ht.Status IN ('Pending', 'In Progress')) as ActiveTasks
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
    
    let pendingCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let dirtyRoomsCount = 0;
    let totalRoomsCount = 0;
    let cleanRoomsCount = 0;
    
    try {
      const pending = db.prepare("SELECT COUNT(*) as count FROM HousekeepingTasks WHERE Status = 'Pending' AND ScheduledDate = ?").get(today) as any;
      pendingCount = pending?.count || 0;
    } catch (e) { console.error('pending error:', e); }
    
    try {
      const inProgress = db.prepare("SELECT COUNT(*) as count FROM HousekeepingTasks WHERE Status = 'In Progress'").get() as any;
      inProgressCount = inProgress?.count || 0;
    } catch (e) { console.error('inProgress error:', e); }
    
    try {
      const completed = db.prepare("SELECT COUNT(*) as count FROM HousekeepingTasks WHERE Status = 'Completed' AND ScheduledDate = ?").get(today) as any;
      completedCount = completed?.count || 0;
    } catch (e) { console.error('completed error:', e); }
    
    try {
      const dirty = db.prepare("SELECT COUNT(*) as count FROM Rooms WHERE CleaningStatus = 'Dirty'").get() as any;
      dirtyRoomsCount = dirty?.count || 0;
    } catch (e) { console.error('dirtyRooms error:', e); }
    
    try {
      const total = db.prepare("SELECT COUNT(*) as count FROM Rooms").get() as any;
      totalRoomsCount = total?.count || 0;
    } catch (e) { console.error('totalRooms error:', e); }
    
    try {
      const clean = db.prepare("SELECT COUNT(*) as count FROM Rooms WHERE CleaningStatus = 'Clean'").get() as any;
      cleanRoomsCount = clean?.count || 0;
    } catch (e) { console.error('cleanRooms error:', e); }

    let activeTasks: any[] = [];
    try {
      activeTasks = db.prepare(`
        SELECT ht.TaskID, ht.RoomID, ht.TaskType, ht.Status, ht.Priority, ht.ScheduledDate, ht.ScheduledTime, 
               ht.StartTime, ht.EndTime, ht.Notes, ht.AssignedStaffID, ht.CreatedDate, ht.UpdatedDate,
               r.RoomNumber, rt.TypeName, e.FirstName, e.LastName
        FROM HousekeepingTasks ht
        JOIN Rooms r ON ht.RoomID = r.RoomID
        LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
        LEFT JOIN Employees e ON ht.AssignedStaffID = e.EmployeeID
        WHERE ht.Status IN ('Pending', 'In Progress')
        ORDER BY CASE ht.Priority WHEN 'Urgent' THEN 1 WHEN 'High' THEN 2 WHEN 'Normal' THEN 3 WHEN 'Low' THEN 4 END
        LIMIT 10
      `).all();
    } catch (e) { console.error('activeTasks error:', e); }

    let staffOnDuty: any[] = [];
    try {
      const hkDept = db.prepare("SELECT DepartmentID FROM Departments WHERE DepartmentName = 'Housekeeping'").get() as any;
      if (hkDept) {
        staffOnDuty = db.prepare(`
          SELECT e.EmployeeID, e.FirstName, e.LastName, e.Position,
            (SELECT COUNT(*) FROM HousekeepingTasks ht 
             WHERE ht.AssignedStaffID = e.EmployeeID 
             AND ht.Status IN ('Pending', 'In Progress')) as activeTasks
          FROM Employees e
          WHERE e.DepartmentID = ?
          AND e.EmploymentStatus = 'Active'
          LIMIT 10
        `).all(hkDept.DepartmentID);
      }
    } catch (e) { console.error('staffOnDuty error:', e); }

    res.json({
      stats: {
        totalRooms: totalRoomsCount,
        dirtyRooms: dirtyRoomsCount,
        inProgress: inProgressCount,
        cleanAndReady: cleanRoomsCount,
        pending: pendingCount,
        completed: completedCount,
      },
      activeTasks: activeTasks || [],
      staffOnDuty: staffOnDuty || [],
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

router.get('/staff', (req: Request, res: Response) => {
  try {
    const staff = db.prepare(`
      SELECT e.EmployeeID, e.FirstName, e.LastName, e.Position, e.Phone, e.Email,
        (SELECT COUNT(*) FROM HousekeepingTasks ht 
         WHERE ht.AssignedStaffID = e.EmployeeID 
         AND ht.Status IN ('Pending', 'In Progress')) as activeTasks
      FROM Employees e
      WHERE e.DepartmentID = (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'Housekeeping')
      AND e.EmploymentStatus = 'Active'
      ORDER BY e.FirstName, e.LastName
    `).all();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.get('/rooms/dirty', (req: Request, res: Response) => {
  try {
    const rooms = db.prepare(`
      SELECT r.RoomID, r.RoomNumber, rt.TypeName, r.CleaningStatus, r.Status as RoomStatus, r.FloorID,
        (SELECT MAX(hs.UpdatedTime) FROM HousekeepingStatus hs WHERE hs.RoomID = r.RoomID) as LastCleaned,
        (SELECT COUNT(*) FROM HousekeepingTasks ht WHERE ht.RoomID = r.RoomID AND ht.Status IN ('Pending', 'In Progress')) as ActiveTasks
      FROM Rooms r
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      WHERE r.CleaningStatus = 'Dirty' OR r.CleaningStatus IS NULL
      ORDER BY r.FloorID, r.RoomNumber
    `).all();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dirty rooms' });
  }
});

router.get('/rooms', (req: Request, res: Response) => {
  try {
    const { cleaningStatus } = req.query;
    let query = `
      SELECT r.RoomID, r.RoomNumber, rt.TypeName, r.CleaningStatus, r.Status as RoomStatus, r.FloorID,
        r.CurrentReservationID,
        (SELECT MAX(hs.UpdatedTime) FROM HousekeepingStatus hs WHERE hs.RoomID = r.RoomID) as LastCleaned,
        (SELECT MAX(ht.ScheduledDate) FROM HousekeepingTasks ht WHERE ht.RoomID = r.RoomID AND ht.Status = 'Completed') as LastCleanScheduled,
        (SELECT COUNT(*) FROM HousekeepingTasks ht WHERE ht.RoomID = r.RoomID AND ht.Status IN ('Pending', 'In Progress')) as ActiveTasks
      FROM Rooms r
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      WHERE 1=1
    `;
    const params: any[] = [];
    if (cleaningStatus) {
      if (cleaningStatus === 'Dirty') {
        query += ' AND (r.CleaningStatus = ? OR r.CleaningStatus IS NULL)';
      } else {
        query += ' AND r.CleaningStatus = ?';
      }
      params.push(cleaningStatus);
    }
    query += ' ORDER BY r.FloorID, r.RoomNumber';
    const rooms = db.prepare(query).all(...params);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

router.get('/reports/analytics', (req: Request, res: Response) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const tasksByStatus = db.prepare(`
      SELECT Status, COUNT(*) as count 
      FROM HousekeepingTasks 
      WHERE ScheduledDate >= ?
      GROUP BY Status
    `).all(startDateStr);

    const tasksByType = db.prepare(`
      SELECT TaskType, COUNT(*) as count 
      FROM HousekeepingTasks 
      WHERE ScheduledDate >= ?
      GROUP BY TaskType
    `).all(startDateStr);

    const staffProductivity = db.prepare(`
      SELECT e.EmployeeID, e.FirstName, e.LastName,
        COUNT(ht.TaskID) as totalTasks,
        SUM(CASE WHEN ht.Status = 'Completed' THEN 1 ELSE 0 END) as completedTasks,
        AVG(CASE WHEN ht.EndTime IS NOT NULL AND ht.StartTime IS NOT NULL 
          THEN (julianday(ht.EndTime) - julianday(ht.StartTime)) * 24 * 60 ELSE 0 END) as avgMinutes
      FROM Employees e
      LEFT JOIN HousekeepingTasks ht ON e.EmployeeID = ht.AssignedStaffID AND ht.ScheduledDate >= ?
      WHERE e.DepartmentID = (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'Housekeeping')
      GROUP BY e.EmployeeID
    `).all(startDateStr);

    const avgCleaningTime = db.prepare(`
      SELECT AVG(julianday(EndTime) - julianday(StartTime)) * 24 * 60 as avgMinutes
      FROM HousekeepingTasks
      WHERE StartTime IS NOT NULL AND EndTime IS NOT NULL
      AND ScheduledDate >= ?
    `).get(startDateStr) as any;

    const delayedTasks = db.prepare(`
      SELECT COUNT(*) as count
      FROM HousekeepingTasks
      WHERE Status NOT IN ('Completed', 'Verified', 'Cancelled')
      AND ScheduledDate < date('now')
    `).get() as any;

    const passRate = db.prepare(`
      SELECT 
        CAST(SUM(CASE WHEN Status = 'Verified' THEN 1 ELSE 0 END) AS FLOAT) / 
        CAST(NULLIF(SUM(CASE WHEN Status IN ('Completed', 'Verified') THEN 1 ELSE 0 END), 0) AS FLOAT) * 100 as rate
      FROM HousekeepingTasks
      WHERE ScheduledDate >= ?
    `).get(startDateStr) as any;

    res.json({
      tasksByStatus: tasksByStatus || [],
      tasksByType: tasksByType || [],
      staffProductivity: staffProductivity || [],
      avgCleaningTime: avgCleaningTime?.avgMinutes || 0,
      delayedTasks: delayedTasks?.count || 0,
      passRate: (passRate?.rate !== null && passRate?.rate !== undefined) ? passRate.rate : 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

router.get('/status-board', (req: Request, res: Response) => {
  try {
    const statusBoard = db.prepare(`
      SELECT 
        rt.TypeName,
        COUNT(r.RoomID) as total,
        SUM(CASE WHEN r.Status = 'Available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN r.Status = 'Occupied' THEN 1 ELSE 0 END) as occupied,
        SUM(CASE WHEN r.CleaningStatus = 'Dirty' OR r.CleaningStatus IS NULL THEN 1 ELSE 0 END) as dirty,
        SUM(CASE WHEN r.Status = 'Maintenance' THEN 1 ELSE 0 END) as maintenance,
        SUM(CASE WHEN r.Status = 'Reserved' THEN 1 ELSE 0 END) as reserved
      FROM Rooms r
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      GROUP BY rt.TypeName
    `).all();
    res.json(statusBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status board' });
  }
});

router.post('/tasks/:id/photos', (req: Request, res: Response) => {
  try {
    const { photoUrl, photoType, notes } = req.body;
    const taskId = req.params.id;

    const task = db.prepare('SELECT RoomID FROM HousekeepingTasks WHERE TaskID = ?').get(taskId) as any;
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const result = db.prepare(`
      INSERT INTO CleaningPhotos (TaskID, RoomID, PhotoURL, PhotoType, Notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(taskId, task.RoomID, photoUrl, photoType || 'before', notes);

    res.status(201).json({ photoId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

router.get('/tasks/:id/photos', (req: Request, res: Response) => {
  try {
    const photos = db.prepare(`
      SELECT * FROM CleaningPhotos WHERE TaskID = ? ORDER BY CreatedDate DESC
    `).all(req.params.id);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Schedule Management
router.get('/schedule', (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        es.ScheduleID,
        es.EmployeeID,
        es.ShiftDate,
        es.ShiftType,
        es.StartTime,
        es.EndTime,
        es.BreakDuration,
        es.Status,
        es.Notes,
        e.FirstName,
        e.LastName,
        e.Position
      FROM EmployeeSchedules es
      JOIN Employees e ON es.EmployeeID = e.EmployeeID
      WHERE e.DepartmentID = (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'Housekeeping')
    `;
    const params: any[] = [];
    
    if (startDate) {
      query += ' AND es.ShiftDate >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND es.ShiftDate <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY es.ShiftDate, es.StartTime';
    
    const schedules = db.prepare(query).all(...params);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

router.get('/schedule/shifts', (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    
    const schedules = db.prepare(`
      SELECT 
        es.ScheduleID,
        es.EmployeeID,
        es.ShiftDate,
        es.ShiftType,
        es.StartTime,
        es.EndTime,
        es.Status,
        e.FirstName,
        e.LastName,
        e.Position
      FROM EmployeeSchedules es
      JOIN Employees e ON es.EmployeeID = e.EmployeeID
      WHERE e.DepartmentID = (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'Housekeeping')
        AND es.ShiftDate = ?
      ORDER BY es.StartTime
    `).all(date || new Date().toISOString().split('T')[0]);
    
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shifts' });
  }
});

router.post('/schedule', (req: Request, res: Response) => {
  try {
    const { employeeId, shiftDate, shiftType, startTime, endTime, breakDuration, notes } = req.body;
    
    const existing = db.prepare(`
      SELECT ScheduleID FROM EmployeeSchedules 
      WHERE EmployeeID = ? AND ShiftDate = ? AND ShiftType = ?
    `).get(employeeId, shiftDate, shiftType);
    
    if (existing) {
      return res.status(400).json({ error: 'Shift already exists for this employee on this date' });
    }
    
    const result = db.prepare(`
      INSERT INTO EmployeeSchedules (EmployeeID, ShiftDate, ShiftType, StartTime, EndTime, BreakDuration, Notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(employeeId, shiftDate, shiftType, startTime, endTime, breakDuration || 60, notes);
    
    res.status(201).json({ scheduleId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

router.put('/schedule/:id', (req: Request, res: Response) => {
  try {
    const { shiftType, startTime, endTime, breakDuration, status, notes } = req.body;
    
    db.prepare(`
      UPDATE EmployeeSchedules 
      SET ShiftType = ?, StartTime = ?, EndTime = ?, BreakDuration = ?, Status = ?, Notes = ?
      WHERE ScheduleID = ?
    `).run(shiftType, startTime, endTime, breakDuration, status || 'Scheduled', notes, req.params.id);
    
    res.json({ message: 'Schedule updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

router.delete('/schedule/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM EmployeeSchedules WHERE ScheduleID = ?').run(req.params.id);
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

router.post('/schedule/bulk', (req: Request, res: Response) => {
  try {
    const { schedules } = req.body;
    
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({ error: 'No schedules provided' });
    }
    
    const insertStmt = db.prepare(`
      INSERT INTO EmployeeSchedules (EmployeeID, ShiftDate, ShiftType, StartTime, EndTime, BreakDuration, Notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertMany = db.transaction((items: any[]) => {
      for (const item of items) {
        insertStmt.run(
          item.employeeId, 
          item.shiftDate, 
          item.shiftType, 
          item.startTime, 
          item.endTime, 
          item.breakDuration || 60, 
          item.notes
        );
      }
    });
    
    insertMany(schedules);
    
    res.status(201).json({ message: 'Schedules created', count: schedules.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bulk schedules' });
  }
});

router.get('/export/tasks', (req: Request, res: Response) => {
  try {
    const { startDate, endDate, format } = req.query;
    
    let query = `
      SELECT 
        ht.TaskID,
        r.RoomNumber,
        rt.TypeName as RoomType,
        ht.TaskType,
        ht.Status,
        ht.Priority,
        ht.ScheduledDate,
        ht.ScheduledTime,
        ht.StartTime,
        ht.EndTime,
        e.FirstName || ' ' || e.LastName as AssignedStaff,
        ht.Notes,
        ht.CreatedDate
      FROM HousekeepingTasks ht
      JOIN Rooms r ON ht.RoomID = r.RoomID
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      LEFT JOIN Employees e ON ht.AssignedStaffID = e.EmployeeID
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (startDate) {
      query += ' AND ht.ScheduledDate >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND ht.ScheduledDate <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY ht.ScheduledDate DESC, ht.Priority DESC';
    
    const tasks = db.prepare(query).all(...params);
    
    if (format === 'csv') {
      const headers = ['Task ID', 'Room', 'Room Type', 'Task Type', 'Status', 'Priority', 'Scheduled Date', 'Scheduled Time', 'Start Time', 'End Time', 'Assigned Staff', 'Notes'];
      const rows = tasks.map((t: any) => [
        t.TaskID,
        t.RoomNumber,
        t.RoomType || '',
        t.TaskType,
        t.Status,
        t.Priority,
        t.ScheduledDate || '',
        t.ScheduledTime || '',
        t.StartTime || '',
        t.EndTime || '',
        t.AssignedStaff || 'Unassigned',
        t.Notes || ''
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
      
      const csv = [headers.join(','), ...rows].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=housekeeping_tasks_${startDate || 'all'}_${endDate || 'all'}.csv`);
      res.send(csv);
    } else {
      res.json(tasks);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to export tasks' });
  }
});

router.get('/export/staff-performance', (req: Request, res: Response) => {
  try {
    const { startDate, endDate, format } = req.query;
    
    const startDateStr = startDate ? startDate as string : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDateStr = endDate ? endDate as string : new Date().toISOString().split('T')[0];
    
    const staffPerformance = db.prepare(`
      SELECT 
        e.EmployeeID,
        e.FirstName,
        e.LastName,
        e.Position,
        COUNT(ht.TaskID) as totalTasks,
        SUM(CASE WHEN ht.Status = 'Completed' THEN 1 ELSE 0 END) as completedTasks,
        SUM(CASE WHEN ht.Status = 'Verified' THEN 1 ELSE 0 END) as verifiedTasks,
        SUM(CASE WHEN ht.Status = 'Cancelled' THEN 1 ELSE 0 END) as cancelledTasks,
        AVG(CASE WHEN ht.EndTime IS NOT NULL AND ht.StartTime IS NOT NULL 
          THEN (julianday(ht.EndTime) - julianday(ht.StartTime)) * 24 * 60 ELSE NULL END) as avgMinutes
      FROM Employees e
      LEFT JOIN HousekeepingTasks ht ON e.EmployeeID = ht.AssignedStaffID 
        AND ht.ScheduledDate >= ? AND ht.ScheduledDate <= ?
      WHERE e.DepartmentID = (SELECT DepartmentID FROM Departments WHERE DepartmentName = 'Housekeeping')
      GROUP BY e.EmployeeID
    `).all(startDateStr, endDateStr);
    
    if (format === 'csv') {
      const headers = ['Employee ID', 'First Name', 'Last Name', 'Position', 'Total Tasks', 'Completed', 'Verified', 'Cancelled', 'Avg. Time (min)'];
      const rows = staffPerformance.map((s: any) => [
        s.EmployeeID,
        s.FirstName,
        s.LastName,
        s.Position || 'Housekeeper',
        s.totalTasks || 0,
        s.completedTasks || 0,
        s.verifiedTasks || 0,
        s.cancelledTasks || 0,
        s.avgMinutes ? Math.round(s.avgMinutes) : 0
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
      
      const csv = [headers.join(','), ...rows].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=staff_performance_${startDateStr}_${endDateStr}.csv`);
      res.send(csv);
    } else {
      res.json(staffPerformance);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to export staff performance' });
  }
});

router.get('/export/daily-summary', (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const summary = db.prepare(`
      SELECT 
        ht.ScheduledDate,
        COUNT(ht.TaskID) as totalTasks,
        SUM(CASE WHEN ht.Status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN ht.Status = 'In Progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN ht.Status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN ht.Status = 'Verified' THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN ht.Status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled,
        AVG(CASE WHEN ht.EndTime IS NOT NULL AND ht.StartTime IS NOT NULL 
          THEN (julianday(ht.EndTime) - julianday(ht.StartTime)) * 24 * 60 ELSE NULL END) as avgMinutes
      FROM HousekeepingTasks ht
      WHERE ht.ScheduledDate = ?
      GROUP BY ht.ScheduledDate
    `).get(targetDate) as any;
    
    const taskBreakdown = db.prepare(`
      SELECT 
        TaskType,
        COUNT(*) as count,
        SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) as completed
      FROM HousekeepingTasks
      WHERE ScheduledDate = ?
      GROUP BY TaskType
    `).all(targetDate);
    
    const roomBreakdown = db.prepare(`
      SELECT 
        rt.TypeName,
        COUNT(ht.TaskID) as tasks,
        SUM(CASE WHEN ht.Status IN ('Completed', 'Verified') THEN 1 ELSE 0 END) as completed
      FROM HousekeepingTasks ht
      JOIN Rooms r ON ht.RoomID = r.RoomID
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      WHERE ht.ScheduledDate = ?
      GROUP BY rt.TypeName
    `).all(targetDate);
    
    res.json({
      date: targetDate,
      summary: summary ? {
        totalTasks: summary.totalTasks || 0,
        pending: summary.pending || 0,
        inProgress: summary.inProgress || 0,
        completed: summary.completed || 0,
        verified: summary.verified || 0,
        cancelled: summary.cancelled || 0,
        avgMinutes: summary.avgMinutes || 0,
      } : { totalTasks: 0, pending: 0, inProgress: 0, completed: 0, verified: 0, cancelled: 0, avgMinutes: 0 },
      taskBreakdown: taskBreakdown || [],
      roomBreakdown: roomBreakdown || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily summary' });
  }
});

// Supply Management
router.get('/supplies', (req: Request, res: Response) => {
  try {
    const { category, lowStock } = req.query;
    let query = 'SELECT * FROM HousekeepingSupplies WHERE IsActive = 1';
    const params: any[] = [];
    
    if (category) {
      query += ' AND Category = ?';
      params.push(category);
    }
    
    if (lowStock === 'true') {
      query += ' AND CurrentStock <= MinStockLevel';
    }
    
    query += ' ORDER BY Category, ItemName';
    const supplies = db.prepare(query).all(...params);
    res.json(supplies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplies' });
  }
});

router.get('/supplies/:id', (req: Request, res: Response) => {
  try {
    const supply = db.prepare('SELECT * FROM HousekeepingSupplies WHERE SupplyID = ?').get(req.params.id);
    if (!supply) {
      return res.status(404).json({ error: 'Supply not found' });
    }
    res.json(supply);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supply' });
  }
});

router.post('/supplies', (req: Request, res: Response) => {
  try {
    const { itemName, itemCode, category, unit, minStockLevel, currentStock, costPerUnit, supplier } = req.body;
    const result = db.prepare(`
      INSERT INTO HousekeepingSupplies (ItemName, ItemCode, Category, Unit, MinStockLevel, CurrentStock, CostPerUnit, Supplier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(itemName, itemCode, category, unit, minStockLevel || 10, currentStock || 0, costPerUnit || 0, supplier);
    res.status(201).json({ supplyId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supply' });
  }
});

router.put('/supplies/:id', (req: Request, res: Response) => {
  try {
    const { itemName, itemCode, category, unit, minStockLevel, currentStock, costPerUnit, supplier } = req.body;
    db.prepare(`
      UPDATE HousekeepingSupplies 
      SET ItemName = ?, ItemCode = ?, Category = ?, Unit = ?, MinStockLevel = ?, CurrentStock = ?, CostPerUnit = ?, Supplier = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE SupplyID = ?
    `).run(itemName, itemCode, category, unit, minStockLevel, currentStock, costPerUnit, supplier, req.params.id);
    res.json({ message: 'Supply updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update supply' });
  }
});

router.delete('/supplies/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE HousekeepingSupplies SET IsActive = 0 WHERE SupplyID = ?').run(req.params.id);
    res.json({ message: 'Supply deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supply' });
  }
});

router.post('/supplies/:id/adjust', (req: Request, res: Response) => {
  try {
    const { adjustment, notes } = req.body;
    const supply = db.prepare('SELECT CurrentStock FROM HousekeepingSupplies WHERE SupplyID = ?').get(req.params.id) as any;
    
    if (!supply) {
      return res.status(404).json({ error: 'Supply not found' });
    }
    
    const newStock = supply.CurrentStock + adjustment;
    if (newStock < 0) {
      return res.status(400).json({ error: 'Stock cannot be negative' });
    }
    
    db.prepare(`
      UPDATE HousekeepingSupplies SET CurrentStock = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE SupplyID = ?
    `).run(newStock, req.params.id);
    
    res.json({ message: 'Stock adjusted', newStock });
  } catch (error) {
    res.status(500).json({ error: 'Failed to adjust stock' });
  }
});

router.get('/supplies/low-stock', (req: Request, res: Response) => {
  try {
    const supplies = db.prepare(`
      SELECT * FROM HousekeepingSupplies 
      WHERE IsActive = 1 AND CurrentStock <= MinStockLevel
      ORDER BY (CurrentStock * 1.0 / MinStockLevel) ASC
    `).all();
    res.json(supplies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch low stock items' });
  }
});

router.get('/usage', (req: Request, res: Response) => {
  try {
    const { taskId, startDate, endDate } = req.query;
    let query = `
      SELECT 
        csu.*,
        hs.ItemName,
        hs.ItemCode,
        hs.Category,
        e.FirstName,
        e.LastName
      FROM CleaningSupplyUsage csu
      LEFT JOIN HousekeepingSupplies hs ON csu.SupplyID = hs.SupplyID
      LEFT JOIN Employees e ON csu.UsedBy = e.EmployeeID
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (taskId) {
      query += ' AND csu.TaskID = ?';
      params.push(taskId);
    }
    if (startDate) {
      query += ' AND DATE(csu.UsageDate) >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND DATE(csu.UsageDate) <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY csu.UsageDate DESC';
    const usage = db.prepare(query).all(...params);
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usage' });
  }
});

router.post('/usage', (req: Request, res: Response) => {
  try {
    const { taskId, supplyId, quantityUsed, usedBy, notes } = req.body;
    
    const result = db.prepare(`
      INSERT INTO CleaningSupplyUsage (TaskID, SupplyID, QuantityUsed, UsedBy, Notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(taskId, supplyId, quantityUsed, usedBy, notes);
    
    db.prepare(`
      UPDATE HousekeepingSupplies 
      SET CurrentStock = CurrentStock - ?, UpdatedDate = CURRENT_TIMESTAMP 
      WHERE SupplyID = ?
    `).run(quantityUsed, supplyId);
    
    res.status(201).json({ usageId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record usage' });
  }
});

// Alerts and Notifications
router.get('/alerts/overdue', (req: Request, res: Response) => {
  try {
    const overdueTasks = db.prepare(`
      SELECT 
        ht.*,
        r.RoomNumber,
        rt.TypeName,
        e.FirstName,
        e.LastName,
        ht.ScheduledTime,
        CASE 
          WHEN ht.ScheduledTime IS NOT NULL THEN 
            datetime(ht.ScheduledDate || ' ' || ht.ScheduledTime)
          ELSE
            ht.ScheduledDate
        END as ExpectedComplete,
        CASE 
          WHEN ht.ScheduledTime IS NOT NULL THEN 
            (julianday('now') - julianday(ht.ScheduledDate || ' ' || ht.ScheduledTime)) * 24 * 60
          ELSE
            (julianday('now') - julianday(ht.ScheduledDate)) * 24 * 60
        END as MinutesOverdue
      FROM HousekeepingTasks ht
      JOIN Rooms r ON ht.RoomID = r.RoomID
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      LEFT JOIN Employees e ON ht.AssignedStaffID = e.EmployeeID
      WHERE ht.Status NOT IN ('Completed', 'Verified', 'Cancelled')
        AND (
          (ht.ScheduledTime IS NOT NULL AND datetime(ht.ScheduledDate || ' ' || ht.ScheduledTime) < datetime('now'))
          OR 
          (ht.ScheduledTime IS NULL AND ht.ScheduledDate < date('now'))
        )
      ORDER BY MinutesOverdue DESC
    `).all();
    res.json(overdueTasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overdue tasks' });
  }
});

router.get('/alerts/low-stock', (req: Request, res: Response) => {
  try {
    const lowStock = db.prepare(`
      SELECT 
        hs.*,
        CASE WHEN hs.CurrentStock <= 0 THEN 'Out of Stock'
             WHEN hs.CurrentStock <= hs.MinStockLevel * 0.25 THEN 'Critical'
             WHEN hs.CurrentStock <= hs.MinStockLevel * 0.5 THEN 'Low'
             ELSE 'Warning'
        END as AlertLevel
      FROM HousekeepingSupplies hs
      WHERE hs.IsActive = 1 AND hs.CurrentStock <= hs.MinStockLevel
      ORDER BY (hs.CurrentStock * 1.0 / hs.MinStockLevel) ASC
    `).all();
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch low stock alerts' });
  }
});

router.get('/alerts/dashboard', (req: Request, res: Response) => {
  try {
    const overdue = db.prepare(`
      SELECT COUNT(*) as count FROM HousekeepingTasks 
      WHERE Status NOT IN ('Completed', 'Verified', 'Cancelled')
        AND (
          (ScheduledTime IS NOT NULL AND datetime(ScheduledDate || ' ' || ScheduledTime) < datetime('now'))
          OR 
          (ScheduledTime IS NULL AND ScheduledDate < date('now'))
        )
    `).get() as any;

    const lowStock = db.prepare(`
      SELECT COUNT(*) as count FROM HousekeepingSupplies 
      WHERE IsActive = 1 AND CurrentStock <= MinStockLevel
    `).get() as any;

    const pendingToday = db.prepare(`
      SELECT COUNT(*) as count FROM HousekeepingTasks 
      WHERE Status = 'Pending' AND ScheduledDate = date('now')
    `).get() as any;

    const delayedToday = db.prepare(`
      SELECT COUNT(*) as count FROM HousekeepingTasks 
      WHERE Status IN ('In Progress') AND ScheduledDate = date('now')
        AND (ScheduledTime IS NOT NULL AND datetime(ScheduledDate || ' ' || ScheduledTime) < datetime('now'))
    `).get() as any;

    res.json({
      overdueTasks: overdue?.count || 0,
      lowStockItems: lowStock?.count || 0,
      pendingToday: pendingToday?.count || 0,
      delayedToday: delayedToday?.count || 0,
      hasAlerts: (overdue?.count || 0) > 0 || (lowStock?.count || 0) > 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard alerts' });
  }
});

export default router;
