import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const { departmentId, employmentStatus, position } = req.query;
    let query = `
      SELECT e.*, d.DepartmentName
      FROM Employees e
      LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
      WHERE 1=1
    `;
    const params: any[] = [];
    if (departmentId) { query += ' AND e.DepartmentID = ?'; params.push(departmentId); }
    if (employmentStatus) { query += ' AND e.EmploymentStatus = ?'; params.push(employmentStatus); }
    if (position) { query += ' AND e.Position LIKE ?'; params.push(`%${position}%`); }
    query += ' ORDER BY e.FirstName, e.LastName';
    const employees = db.prepare(query).all(...params);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const employee = db.prepare(`
      SELECT e.*, d.DepartmentName
      FROM Employees e
      LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
      WHERE e.EmployeeID = ?
    `).get(req.params.id);
    const departments = db.prepare('SELECT * FROM EmployeeDepartments WHERE EmployeeID = ?').all(req.params.id);
    const schedules = db.prepare('SELECT * FROM EmployeeSchedules WHERE EmployeeID = ? ORDER BY ShiftDate DESC LIMIT 30').all(req.params.id);
    res.json({ ...employee, departments, schedules });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, position, departmentId, hireDate, salary, emergencyContactName, emergencyContactPhone, dateOfBirth, gender, address } = req.body;
    const result = db.prepare(`
      INSERT INTO Employees (FirstName, LastName, Email, Phone, Position, DepartmentID, HireDate, Salary, EmergencyContactName, EmergencyContactPhone, DateOfBirth, Gender, Address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(firstName, lastName, email, phone, position, departmentId, hireDate, salary, emergencyContactName, emergencyContactPhone, dateOfBirth, gender, address);
    res.status(201).json({ employeeId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, position, departmentId, employmentStatus, salary, emergencyContactName, emergencyContactPhone, dateOfBirth, gender, address } = req.body;
    db.prepare(`
      UPDATE Employees SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Position = ?, DepartmentID = ?, EmploymentStatus = ?, Salary = ?, EmergencyContactName = ?, EmergencyContactPhone = ?, DateOfBirth = ?, Gender = ?, Address = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE EmployeeID = ?
    `).run(firstName, lastName, email, phone, position, departmentId, employmentStatus, salary, emergencyContactName, emergencyContactPhone, dateOfBirth, gender, address, req.params.id);
    res.json({ message: 'Employee updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE Employees SET EmploymentStatus = ? WHERE EmployeeID = ?').run('Terminated', req.params.id);
    res.json({ message: 'Employee terminated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to terminate employee' });
  }
});

router.get('/departments', (req: Request, res: Response) => {
  try {
    const departments = db.prepare('SELECT * FROM Departments WHERE IsActive = 1').all();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

router.post('/departments', (req: Request, res: Response) => {
  try {
    const { departmentName, description, managerId } = req.body;
    const result = db.prepare('INSERT INTO Departments (DepartmentName, Description, ManagerID) VALUES (?, ?, ?)').run(departmentName, description, managerId);
    res.status(201).json({ departmentId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create department' });
  }
});

router.get('/schedules', (req: Request, res: Response) => {
  try {
    const { employeeId, shiftDate, startDate, endDate } = req.query;
    let query = `
      SELECT es.*, e.FirstName, e.LastName, e.Position
      FROM EmployeeSchedules es
      JOIN Employees e ON es.EmployeeID = e.EmployeeID
      WHERE 1=1
    `;
    const params: any[] = [];
    if (employeeId) { query += ' AND es.EmployeeID = ?'; params.push(employeeId); }
    if (shiftDate) { query += ' AND es.ShiftDate = ?'; params.push(shiftDate); }
    if (startDate) { query += ' AND es.ShiftDate >= ?'; params.push(startDate); }
    if (endDate) { query += ' AND es.ShiftDate <= ?'; params.push(endDate); }
    query += ' ORDER BY es.ShiftDate, es.StartTime';
    const schedules = db.prepare(query).all(...params);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

router.post('/schedules', (req: Request, res: Response) => {
  try {
    const { employeeId, shiftDate, shiftType, startTime, endTime, breakDuration, notes } = req.body;
    const result = db.prepare(`
      INSERT INTO EmployeeSchedules (EmployeeID, ShiftDate, ShiftType, StartTime, EndTime, BreakDuration, Notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(employeeId, shiftDate, shiftType, startTime, endTime, breakDuration || 60, notes);
    res.status(201).json({ scheduleId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

router.get('/attendance', (req: Request, res: Response) => {
  try {
    const { employeeId, attendanceDate, startDate, endDate, status } = req.query;
    let query = `
      SELECT a.*, e.FirstName, e.LastName, e.Position
      FROM Attendance a
      JOIN Employees e ON a.EmployeeID = e.EmployeeID
      WHERE 1=1
    `;
    const params: any[] = [];
    if (employeeId) { query += ' AND a.EmployeeID = ?'; params.push(employeeId); }
    if (attendanceDate) { query += ' AND a.AttendanceDate = ?'; params.push(attendanceDate); }
    if (startDate) { query += ' AND a.AttendanceDate >= ?'; params.push(startDate); }
    if (endDate) { query += ' AND a.AttendanceDate <= ?'; params.push(endDate); }
    if (status) { query += ' AND a.Status = ?'; params.push(status); }
    query += ' ORDER BY a.AttendanceDate DESC';
    const attendance = db.prepare(query).all(...params);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

router.post('/attendance/checkin', (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];
    
    const existing = db.prepare('SELECT * FROM Attendance WHERE EmployeeID = ? AND AttendanceDate = ?').get(employeeId, today);
    if (existing) {
      return res.status(400).json({ error: 'Already checked in today' });
    }
    
    const result = db.prepare(`
      INSERT INTO Attendance (EmployeeID, AttendanceDate, CheckIn, Status)
      VALUES (?, ?, CURRENT_TIMESTAMP, 'Present')
    `).run(employeeId, today);
    res.status(201).json({ attendanceId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check in' });
  }
});

router.post('/attendance/checkout', (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];
    
    const attendance = db.prepare('SELECT * FROM Attendance WHERE EmployeeID = ? AND AttendanceDate = ?').get(employeeId, today) as any;
    if (!attendance) {
      return res.status(400).json({ error: 'No check-in found for today' });
    }
    
    db.prepare(`
      UPDATE Attendance SET CheckOut = CURRENT_TIMESTAMP, WorkHours = TIMEDIFF(CURRENT_TIMESTAMP, CheckIn)
      WHERE EmployeeID = ? AND AttendanceDate = ?
    `).run(employeeId, today);
    res.json({ message: 'Checked out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check out' });
  }
});

export default router;
