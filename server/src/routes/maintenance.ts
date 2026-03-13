import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

interface PaginationQuery {
  page?: string;
  limit?: string;
  status?: string;
  priority?: string;
  roomId?: string;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const transformRequest = (row: any): any => {
  if (!row) return null;
  return {
    requestId: row.RequestID,
    roomId: row.RoomID,
    roomNumber: row.RoomNumber,
    requestType: row.RequestType,
    priority: row.Priority,
    description: row.Description,
    reportedBy: row.ReportedBy,
    reportedByName: row.ReportedByName ? `${row.FirstName} ${row.LastName}` : null,
    reportedDate: row.ReportedDate,
    status: row.Status,
    scheduledDate: row.ScheduledDate,
    completedDate: row.CompletedDate,
    estimatedCost: row.EstimatedCost,
    actualCost: row.ActualCost,
    notes: row.Notes,
    assignedToFirstName: row.AssignedToFirstName,
    assignedToLastName: row.AssignedToLastName,
    typeName: row.TypeName,
    createdDate: row.CreatedDate,
    updatedDate: row.UpdatedDate,
  };
};

const transformTask = (row: any): any => {
  if (!row) return null;
  return {
    taskId: row.TaskID,
    requestId: row.RequestID,
    assignedStaffId: row.AssignedStaffID,
    assignedStaffName: row.AssignedStaffName ? `${row.AssignedStaffName}` : null,
    status: row.Status,
    startDate: row.StartDate,
    completionDate: row.CompletionDate,
    notes: row.Notes,
    createdDate: row.CreatedDate,
    updatedDate: row.UpdatedDate,
  };
};

const transformHistory = (row: any): any => {
  if (!row) return null;
  return {
    historyId: row.HistoryID,
    requestId: row.RequestID,
    taskId: row.TaskID,
    updateDate: row.UpdateDate,
    status: row.Status,
    notes: row.Notes,
    updatedBy: row.UpdatedBy,
  };
};

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
    
    try {
      const totalResult = db.prepare('SELECT COUNT(*) as count FROM MaintenanceRequests WHERE Status != ?').get('Closed') as any;
      stats.totalRequests = totalResult?.count || 0;
    } catch (e) { console.error('totalResult error:', e); }
    
    try {
      const pendingResult = db.prepare("SELECT COUNT(*) as count FROM MaintenanceRequests WHERE Status = 'Open'").get() as any;
      stats.pendingRequests = pendingResult?.count || 0;
    } catch (e) { console.error('pendingResult error:', e); }
    
    try {
      const inProgressResult = db.prepare("SELECT COUNT(*) as count FROM MaintenanceRequests WHERE Status = 'In Progress'").get() as any;
      stats.inProgressRequests = inProgressResult?.count || 0;
    } catch (e) { console.error('inProgressResult error:', e); }
    
    try {
      const completedTodayResult = db.prepare("SELECT COUNT(*) as count FROM MaintenanceRequests WHERE Status = 'Completed' AND date(CompletedDate) = ?").get(today) as any;
      stats.completedToday = completedTodayResult?.count || 0;
    } catch (e) { console.error('completedTodayResult error:', e); }
    
    try {
      const urgentResult = db.prepare("SELECT COUNT(*) as count FROM MaintenanceRequests WHERE Priority IN ('Emergency', 'High') AND Status NOT IN ('Completed', 'Closed')").get() as any;
      stats.urgentRequests = urgentResult?.count || 0;
    } catch (e) { console.error('urgentResult error:', e); }
    
    // Task distribution by type
    let taskDistribution: any[] = [];
    try {
      taskDistribution = db.prepare(`
        SELECT RequestType as name, COUNT(*) as value
        FROM MaintenanceRequests
        WHERE Status != 'Closed'
        GROUP BY RequestType
      `).all() as any[];
    } catch (e) { console.error('taskDistribution error:', e); }
    
    // Weekly performance
    let weeklyPerformance: any[] = [];
    try {
      weeklyPerformance = db.prepare(`
        SELECT 
          strftime('%w', ReportedDate) as day,
          COUNT(*) as reported,
          SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) as completed
        FROM MaintenanceRequests
        WHERE ReportedDate >= date('now', '-7 days')
        GROUP BY strftime('%w', ReportedDate)
      `).all() as any[];
    } catch (e) { console.error('weeklyPerformance error:', e); }
    
    // Recent requests (LIMIT 10)
    let recentRequestsRaw: any[] = [];
    try {
      recentRequestsRaw = db.prepare(`
        SELECT mr.*, r.RoomNumber,
               ae.FirstName as AssignedToFirstName, ae.LastName as AssignedToLastName
        FROM MaintenanceRequests mr
        JOIN Rooms r ON mr.RoomID = r.RoomID
        LEFT JOIN MaintenanceTasks mt ON mr.RequestID = mt.RequestID
        LEFT JOIN Employees ae ON mt.AssignedStaffID = ae.EmployeeID
        ORDER BY mr.ReportedDate DESC
        LIMIT 10
      `).all() as any[];
    } catch (e) { console.error('recentRequestsRaw error:', e); }
    
    res.json({
      stats,
      taskDistribution: taskDistribution || [],
      weeklyPerformance: weeklyPerformance || [],
      recentRequests: recentRequestsRaw.map(transformRequest),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data', message: 'Unable to load dashboard statistics' });
  }
});

router.get('/requests', (req: Request<PaginationQuery>, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;
    const { status, priority, roomId, search } = req.query;

    let whereClause = '1=1';
    const params: any[] = [];
    
    if (status) { 
      whereClause += ' AND mr.Status = ?'; 
      params.push(status); 
    }
    if (priority) { 
      whereClause += ' AND mr.Priority = ?'; 
      params.push(priority); 
    }
    if (roomId) { 
      whereClause += ' AND mr.RoomID = ?'; 
      params.push(roomId); 
    }
    if (search) {
      whereClause += ' AND (mr.Description LIKE ? OR mr.RequestType LIKE ? OR r.RoomNumber LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM MaintenanceRequests mr
      JOIN Rooms r ON mr.RoomID = r.RoomID
      WHERE ${whereClause}
    `;
    const countResult = db.prepare(countQuery).get(...params) as any;
    const total = countResult?.total || 0;

    // Get paginated data
    const dataQuery = `
      SELECT mr.*, r.RoomNumber, e.FirstName, e.LastName as ReportedByName,
             ae.FirstName as AssignedToFirstName, ae.LastName as AssignedToLastName
      FROM MaintenanceRequests mr
      JOIN Rooms r ON mr.RoomID = r.RoomID
      LEFT JOIN Employees e ON mr.ReportedBy = e.EmployeeID
      LEFT JOIN MaintenanceTasks mt ON mr.RequestID = mt.RequestID
      LEFT JOIN Employees ae ON mt.AssignedStaffID = ae.EmployeeID
      WHERE ${whereClause}
      ORDER BY mr.ReportedDate DESC
      LIMIT ? OFFSET ?
    `;
    const requestsRaw = db.prepare(dataQuery).all(...params, limit, offset);
    
    res.json({
      data: requestsRaw.map(transformRequest),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests', message: 'Unable to retrieve maintenance requests' });
  }
});

router.get('/requests/:id', (req: Request, res: Response) => {
  try {
    const requestRaw = db.prepare(`
      SELECT mr.*, r.RoomNumber, rt.TypeName, e.FirstName, e.LastName
      FROM MaintenanceRequests mr
      JOIN Rooms r ON mr.RoomID = r.RoomID
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      LEFT JOIN Employees e ON mr.ReportedBy = e.EmployeeID
      WHERE mr.RequestID = ?
    `).get(req.params.id);
    
    if (!requestRaw) {
      return res.status(404).json({ error: 'Not found', message: 'Maintenance request not found' });
    }
    
    const tasksRaw = db.prepare(`
      SELECT mt.*, e.FirstName as StaffFirstName, e.LastName as StaffLastName
      FROM MaintenanceTasks mt
      LEFT JOIN Employees e ON mt.AssignedStaffID = e.EmployeeID
      WHERE mt.RequestID = ?
    `).all(req.params.id);
    
    const historyRaw = db.prepare('SELECT * FROM MaintenanceHistory WHERE RequestID = ? ORDER BY UpdateDate DESC').all(req.params.id);
    
    // Transform tasks to include staff name
    const tasks = tasksRaw.map((row: any) => ({
      taskId: row.TaskID,
      requestId: row.RequestID,
      assignedStaffId: row.AssignedStaffID,
      assignedStaffName: row.StaffFirstName ? `${row.StaffFirstName} ${row.StaffLastName || ''}` : null,
      status: row.Status,
      startDate: row.StartDate,
      completionDate: row.CompletionDate,
      notes: row.Notes,
      createdDate: row.CreatedDate,
      updatedDate: row.UpdatedDate,
    }));
    
    res.json({ 
      ...transformRequest(requestRaw), 
      tasks, 
      history: historyRaw.map(transformHistory) 
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: 'Failed to fetch request', message: 'Unable to retrieve maintenance request details' });
  }
});

router.post('/requests', (req: Request, res: Response) => {
  try {
    const { roomId, requestType, priority, description, reportedBy, scheduledDate, estimatedCost } = req.body;

    // Validation
    if (!roomId || !requestType || !description) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Room ID, request type, and description are required' 
      });
    }

    // Check if room exists (optional - skip if table might be empty)
    let roomExists = true;
    try {
      const room = db.prepare('SELECT RoomID FROM Rooms WHERE RoomID = ?').get(roomId);
      roomExists = !!room;
    } catch (e) {
      console.log('Room check skipped:', e);
    }

    if (!roomExists) {
      return res.status(400).json({ error: 'Invalid room', message: 'The specified room does not exist' });
    }

    const validPriority = ['Low', 'Normal', 'High', 'Emergency'].includes(priority) ? priority : 'Normal';
    
    const result = db.prepare(`
      INSERT INTO MaintenanceRequests (RoomID, RequestType, Priority, Description, ReportedBy, ScheduledDate, EstimatedCost)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(roomId, requestType, validPriority, description, reportedBy || null, scheduledDate || null, estimatedCost || 0);
    
    res.status(201).json({ requestId: result.lastInsertRowid });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create request', message: 'Unable to create maintenance request' });
  }
});

router.put('/requests/:id', (req: Request, res: Response) => {
  try {
    const { status, scheduledDate, estimatedCost, actualCost, notes, priority } = req.body;
    const current = db.prepare('SELECT Status, RoomID FROM MaintenanceRequests WHERE RequestID = ?').get(req.params.id) as any;
    
    if (!current) {
      return res.status(404).json({ error: 'Not found', message: 'Maintenance request not found' });
    }

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
    res.json({ message: 'Request updated successfully' });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update request', message: 'Unable to update maintenance request' });
  }
});

router.post('/tasks', (req: Request, res: Response) => {
  try {
    const { requestId, assignedStaffId, startDate } = req.body;
    
    // Validation
    if (!requestId) {
      return res.status(400).json({ error: 'Validation failed', message: 'Request ID is required' });
    }

    // Get the request to find the room
    const request = db.prepare('SELECT RoomID, RequestType, Status FROM MaintenanceRequests WHERE RequestID = ?').get(requestId) as any;
    
    if (!request) {
      return res.status(404).json({ error: 'Not found', message: 'Maintenance request not found' });
    }

    // Check if already has active task
    if (request.Status === 'In Progress') {
      return res.status(400).json({ error: 'Task already exists', message: 'This request already has an active task' });
    }

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
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task', message: 'Unable to create maintenance task' });
  }
});

router.put('/tasks/:id', (req: Request, res: Response) => {
  try {
    const { status, completionDate, notes } = req.body;
    const currentTask = db.prepare('SELECT RequestID FROM MaintenanceTasks WHERE TaskID = ?').get(req.params.id) as any;
    
    if (!currentTask) {
      return res.status(404).json({ error: 'Not found', message: 'Maintenance task not found' });
    }

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
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task', message: 'Unable to update maintenance task' });
  }
});

router.get('/history', (req: Request<PaginationQuery>, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;
    const { roomId, startDate, endDate } = req.query;

    let whereClause = "mr.Status IN ('Completed', 'Closed')";
    const params: any[] = [];
    
    if (roomId) { 
      whereClause += ' AND mr.RoomID = ?'; 
      params.push(roomId); 
    }
    if (startDate) { 
      whereClause += ' AND mr.ReportedDate >= ?'; 
      params.push(startDate); 
    }
    if (endDate) { 
      whereClause += ' AND mr.ReportedDate <= ?'; 
      params.push(endDate); 
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM MaintenanceRequests mr
      JOIN Rooms r ON mr.RoomID = r.RoomID
      WHERE ${whereClause}
    `;
    const countResult = db.prepare(countQuery).get(...params) as any;
    const total = countResult?.total || 0;

    // Get paginated data
    const dataQuery = `
      SELECT mr.*, r.RoomNumber, rt.TypeName
      FROM MaintenanceRequests mr
      JOIN Rooms r ON mr.RoomID = r.RoomID
      LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      WHERE ${whereClause}
      ORDER BY mr.ReportedDate DESC
      LIMIT ? OFFSET ?
    `;
    const historyRaw = db.prepare(dataQuery).all(...params, limit, offset);
    
    res.json({
      data: historyRaw.map(transformRequest),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history', message: 'Unable to retrieve maintenance history' });
  }
});

// Get all staff (for assignment - shows employees from all departments)
router.get('/staff', (req: Request, res: Response) => {
  try {
    const staffRaw = db.prepare(`
      SELECT e.EmployeeID, e.FirstName, e.LastName, e.Position, d.DepartmentName,
             (SELECT COUNT(*) FROM MaintenanceTasks mt 
              JOIN MaintenanceRequests mr ON mt.RequestID = mr.RequestID 
              WHERE mt.AssignedStaffID = e.EmployeeID AND mt.Status = 'In Progress') as activeTasks
      FROM Employees e
      JOIN Departments d ON e.DepartmentID = d.DepartmentID
      WHERE e.EmploymentStatus = 'Active'
      ORDER BY e.FirstName
    `).all();
    
    const staff = staffRaw.map((row: any) => ({
      employeeId: row.EmployeeID,
      firstName: row.FirstName,
      lastName: row.LastName,
      position: row.Position,
      departmentName: row.DepartmentName,
      activeTasks: row.activeTasks,
    }));
    
    res.json(staff || []);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Failed to fetch staff', message: 'Unable to retrieve staff' });
  }
});

// Quick seed 3 maintenance staff
router.post('/seed-staff', (req: Request, res: Response) => {
  try {
    // Get or create Maintenance department
    let maintDept = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Maintenance') as any;
    if (!maintDept) {
      db.prepare('INSERT INTO Departments (DepartmentName, Description) VALUES (?, ?)').run('Maintenance', 'Property Maintenance');
      maintDept = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Maintenance') as any;
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Add 3 maintenance staff
    const staffData = [
      ['John', 'Smith', 'Maintenance Technician', 'john.maintenance@hotel.com', '555-0301'],
      ['Maria', 'Garcia', 'Electrician', 'maria.maintenance@hotel.com', '555-0302'],
      ['David', 'Chen', 'Plumber', 'david.maintenance@hotel.com', '555-0303'],
    ];

    const insertedIds: number[] = [];
    for (const s of staffData) {
      const result = db.prepare(`
        INSERT INTO Employees (DepartmentID, FirstName, LastName, Position, Gender, HireDate, EmploymentStatus, Phone, Email)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(maintDept.DepartmentID, s[0], s[1], s[2], 'Male', today, 'Active', s[4], s[3]);
      insertedIds.push(Number(result.lastInsertRowid));
    }

    res.json({ 
      message: 'Added 3 maintenance staff', 
      staffIds: insertedIds,
      staff: staffData.map((s, i) => ({
        employeeId: insertedIds[i],
        firstName: s[0],
        lastName: s[1],
        position: s[2],
        departmentName: 'Maintenance',
        activeTasks: 0
      }))
    });
  } catch (error) {
    console.error('Seed staff error:', error);
    res.status(500).json({ error: 'Failed to seed staff', message: 'Unable to add maintenance staff' });
  }
});

// Seed maintenance staff only
router.post('/seed-staff', (req: Request, res: Response) => {
  try {
    // Get or create maintenance department
    let maintDept = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Maintenance') as any;
    if (!maintDept) {
      db.prepare('INSERT INTO Departments (DepartmentName, Description) VALUES (?, ?)').run('Maintenance', 'Property Maintenance');
      maintDept = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Maintenance') as any;
    }

    // Check if already has maintenance staff
    const existingStaff = db.prepare(`
      SELECT COUNT(*) as count FROM Employees WHERE DepartmentID = ?
    `).get(maintDept.DepartmentID) as any;

    if (existingStaff?.count > 0) {
      return res.json({ message: 'Maintenance staff already exists', count: existingStaff.count });
    }

    // Insert maintenance staff
    const mntStaff = [
      ['Bob', 'Wilson', 'Maintenance Technician', 'Male', 'bob@hotel.com', '555-0201'],
      ['Sarah', 'Martinez', 'Electrician', 'Female', 'sarah@hotel.com', '555-0202'],
      ['Carlos', 'Lee', 'Plumber', 'Male', 'carlos@hotel.com', '555-0203'],
      ['Diana', 'Chen', 'HVAC Specialist', 'Female', 'diana@hotel.com', '555-0204'],
      ['Mike', 'Johnson', 'General Maintenance', 'Male', 'mike@hotel.com', '555-0205'],
    ];

    const insertStaff = db.prepare(`
      INSERT INTO Employees (BranchID, DepartmentID, FirstName, LastName, Position, Gender, HireDate, EmploymentStatus, Phone, Email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const staffIds: number[] = [];
    const today = new Date().toISOString().split('T')[0];

    for (const s of mntStaff) {
      insertStaff.run(1, maintDept.DepartmentID, s[0], s[1], s[2], s[3], today, 'Active', s[5], s[4]);
      const lastId = db.prepare('SELECT last_insert_rowid() as id').get() as any;
      staffIds.push(lastId.id);
    }

    res.json({ message: 'Maintenance staff created successfully', count: mntStaff.length, staffIds });
  } catch (error) {
    console.error('Seed staff error:', error);
    res.status(500).json({ error: 'Failed to seed staff', message: 'Unable to create maintenance staff' });
  }
});

// Seed maintenance data (development only)
router.post('/seed', (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Check if already seeded
    const existingCount = db.prepare('SELECT COUNT(*) as count FROM MaintenanceRequests').get() as any;
    if (existingCount?.count > 0) {
      return res.json({ message: 'Maintenance data already seeded', count: existingCount.count });
    }

    // Get or create maintenance department
    let maintDept = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Maintenance') as any;
    if (!maintDept) {
      db.prepare('INSERT INTO Departments (DepartmentName, Description) VALUES (?, ?)').run('Maintenance', 'Property Maintenance');
      maintDept = db.prepare('SELECT DepartmentID FROM Departments WHERE DepartmentName = ?').get('Maintenance') as any;
    }

    // Insert maintenance staff
    const mntStaff = [
      ['Bob', 'Wilson', 'Maintenance Technician'],
      ['Carlos', 'Martinez', 'Electrician'],
      ['Diana', 'Lee', 'Plumber'],
    ];

    const mntStaffIds: number[] = [];
    const insertStaff = db.prepare(`
      INSERT INTO Employees (BranchID, DepartmentID, FirstName, LastName, Position, Gender, HireDate, EmploymentStatus, Phone, Email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const s of mntStaff) {
      insertStaff.run(1, maintDept.DepartmentID, s[0], s[1], s[2], 'Male', '2023-06-01', 'Active', '555-0201', `${s[0].toLowerCase()}@hotel.com`);
      const lastId = db.prepare('SELECT last_insert_rowid() as id').get() as any;
      mntStaffIds.push(lastId.id);
    }

    // Insert maintenance requests
    const mntRequests = [
      [1, 'Plumbing', 'High', 'Leaking faucet in bathroom sink', 1, yesterday, 'Open', null, 50.00, null],
      [2, 'Electrical', 'Emergency', 'Power outlet not working', 2, yesterday, 'In Progress', today, 75.00, null],
      [3, 'HVAC', 'Normal', 'AC not cooling properly', 1, yesterday, 'Open', null, 150.00, null],
      [5, 'Furniture', 'Low', 'Broken chair leg', 3, today, 'Open', null, 25.00, null],
      [3, 'Appliance', 'High', 'Microwave not heating', 1, yesterday, 'Completed', yesterday, 80.00, 80.00],
      [1, 'Plumbing', 'Normal', 'Toilet running constantly', 2, yesterday, 'Open', null, 60.00, null],
      [4, 'Electrical', 'Normal', 'Light flickering in bedroom', 1, today, 'In Progress', today, 45.00, null],
      [2, 'HVAC', 'High', 'Heater not working', 3, yesterday, 'Open', null, 200.00, null],
    ];

    const insertMntRequest = db.prepare(`
      INSERT INTO MaintenanceRequests (RoomID, RequestType, Priority, Description, ReportedBy, ReportedDate, Status, ScheduledDate, EstimatedCost, ActualCost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of mntRequests) {
      insertMntRequest.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9]);
    }

    // Insert some maintenance tasks
    const insertMntTask = db.prepare(`
      INSERT INTO MaintenanceTasks (RequestID, AssignedStaffID, Status, StartDate, CompletionDate, Notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertMntTask.run(2, mntStaffIds[1], 'In Progress', today, null, 'Checking electrical wiring');
    insertMntTask.run(5, mntStaffIds[2], 'Completed', yesterday, yesterday, 'Replaced magnetron tube');
    insertMntTask.run(7, mntStaffIds[0], 'In Progress', today, null, 'Investigating loose wire');

    res.json({ message: 'Maintenance data seeded successfully', requestCount: mntRequests.length });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed data', message: 'Unable to seed maintenance data' });
  }
});

export default router;
