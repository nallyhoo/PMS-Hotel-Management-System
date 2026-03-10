import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/revenue', (req: Request, res: Response) => {
  try {
    const { startDate, endDate, branchId } = req.query;
    const revenue = db.prepare(`
      SELECT 
        DATE(PaymentDate) as Date,
        SUM(Amount) as TotalRevenue,
        COUNT(*) as TransactionCount
      FROM Payments
      WHERE Status = 'Completed' AND PaymentDate BETWEEN ? AND ?
      GROUP BY DATE(PaymentDate)
      ORDER BY Date
    `).all(startDate, endDate);
    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue report' });
  }
});

router.get('/occupancy', (req: Request, res: Response) => {
  try {
    const { startDate, endDate, branchId } = req.query;
    
    const totalRooms = db.prepare('SELECT COUNT(*) as count FROM Rooms').get() as any;
    
    const occupancy = db.prepare(`
      SELECT 
        DATE(CheckInDate) as Date,
        COUNT(DISTINCT ReservationID) as Reservations,
        SUM(CASE WHEN Status = 'Checked In' THEN 1 ELSE 0 END) as CheckIns,
        SUM(CASE WHEN Status = 'Checked Out' THEN 1 ELSE 0 END) as CheckOuts
      FROM Reservations
      WHERE CheckInDate BETWEEN ? AND ?
      GROUP BY DATE(CheckInDate)
      ORDER BY Date
    `).all(startDate, endDate);

    const occupancyWithRate = occupancy.map((o: any) => ({
      ...o,
      OccupancyRate: Math.round((o.CheckIns / totalRooms.count) * 100)
    }));

    res.json(occupancyWithRate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch occupancy report' });
  }
});

router.get('/bookings', (req: Request, res: Response) => {
  try {
    const { startDate, endDate, bookingSource } = req.query;
    
    let query = `
      SELECT 
        DATE(CreatedDate) as Date,
        COUNT(*) as TotalBookings,
        SUM(CASE WHEN Status = 'Confirmed' THEN 1 ELSE 0 END) as Confirmed,
        SUM(CASE WHEN Status = 'Cancelled' THEN 1 ELSE 0 END) as Cancelled,
        SUM(TotalAmount) as TotalRevenue,
        BookingSource
      FROM Reservations
      WHERE CreatedDate BETWEEN ? AND ?
    `;
    const params: any[] = [startDate, endDate];
    
    if (bookingSource) {
      query += ' AND BookingSource = ?';
      params.push(bookingSource);
    }
    
    query += ' GROUP BY DATE(CreatedDate), BookingSource ORDER BY Date';
    const bookings = db.prepare(query).all(...params);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking report' });
  }
});

router.get('/payments', (req: Request, res: Response) => {
  try {
    const { startDate, endDate, paymentMethod } = req.query;
    
    let query = `
      SELECT 
        DATE(PaymentDate) as Date,
        PaymentMethod,
        SUM(Amount) as TotalAmount,
        COUNT(*) as Count
      FROM Payments
      WHERE Status = 'Completed' AND PaymentDate BETWEEN ? AND ?
    `;
    const params: any[] = [startDate, endDate];
    
    if (paymentMethod) {
      query += ' AND PaymentMethod = ?';
      params.push(paymentMethod);
    }
    
    query += ' GROUP BY DATE(PaymentDate), PaymentMethod ORDER BY Date';
    const payments = db.prepare(query).all(...params);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment report' });
  }
});

router.get('/guests', (req: Request, res: Response) => {
  try {
    const { startDate, endDate, nationality } = req.query;
    
    let query = `
      SELECT 
        Nationality,
        COUNT(*) as TotalGuests,
        SUM(CASE WHEN VIPStatus != 'Regular' THEN 1 ELSE 0 END) as VIPGuests
      FROM Guests
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (nationality) {
      query += ' AND Nationality = ?';
      params.push(nationality);
    }
    
    query += ' GROUP BY Nationality ORDER BY TotalGuests DESC';
    const guests = db.prepare(query).all(...params);
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guest report' });
  }
});

router.get('/staff', (req: Request, res: Response) => {
  try {
    const { startDate, endDate, departmentId } = req.query;
    
    let query = `
      SELECT 
        e.EmployeeID,
        e.FirstName,
        e.LastName,
        e.Position,
        d.DepartmentName,
        COUNT(a.AttendanceID) as WorkingDays,
        SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END) as PresentDays,
        SUM(CASE WHEN a.Status = 'Late' THEN 1 ELSE 0 END) as LateDays,
        SUM(CASE WHEN a.Status = 'Absent' THEN 1 ELSE 0 END) as AbsentDays
      FROM Employees e
      LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
      LEFT JOIN Attendance a ON e.EmployeeID = a.EmployeeID
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (departmentId) {
      query += ' AND e.DepartmentID = ?';
      params.push(departmentId);
    }
    
    if (startDate && endDate) {
      query += ' AND a.AttendanceDate BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    query += ' GROUP BY e.EmployeeID ORDER BY PresentDays DESC';
    const staff = db.prepare(query).all(...params);
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff report' });
  }
});

router.get('/room-availability', (req: Request, res: Response) => {
  try {
    const rooms = db.prepare(`
      SELECT 
        rt.TypeName,
        COUNT(r.RoomID) as TotalRooms,
        SUM(CASE WHEN r.Status = 'Available' THEN 1 ELSE 0 END) as Available,
        SUM(CASE WHEN r.Status = 'Occupied' THEN 1 ELSE 0 END) as Occupied,
        SUM(CASE WHEN r.Status = 'Dirty' THEN 1 ELSE 0 END) as Dirty,
        SUM(CASE WHEN r.Status = 'Maintenance' THEN 1 ELSE 0 END) as Maintenance
      FROM Rooms r
      JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
      GROUP BY rt.RoomTypeID
    `).all();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room availability' });
  }
});

export default router;
