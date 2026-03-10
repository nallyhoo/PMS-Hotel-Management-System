import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const permissions = db.prepare('SELECT * FROM Permissions WHERE IsActive = 1').all();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

router.get('/modules', (req: Request, res: Response) => {
  try {
    const modules = db.prepare('SELECT DISTINCT Module FROM Permissions').all();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { permissionName, permissionCode, module, description } = req.body;
    const result = db.prepare('INSERT INTO Permissions (PermissionName, PermissionCode, Module, Description) VALUES (?, ?, ?, ?)').run(permissionName, permissionCode, module, description);
    res.status(201).json({ permissionId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create permission' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE Permissions SET IsActive = 0 WHERE PermissionID = ?').run(req.params.id);
    res.json({ message: 'Permission deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete permission' });
  }
});

router.get('/activity-logs', (req: Request, res: Response) => {
  try {
    const { userId, module, startDate, endDate, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = `
      SELECT al.*, u.Username
      FROM ActivityLogs al
      LEFT JOIN Users u ON al.UserID = u.UserID
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (userId) { query += ' AND al.UserID = ?'; params.push(userId); }
    if (module) { query += ' AND al.Module = ?'; params.push(module); }
    if (startDate) { query += ' AND al.Timestamp >= ?'; params.push(startDate); }
    if (endDate) { query += ' AND al.Timestamp <= ?'; params.push(endDate); }
    
    const countQuery = query.replace('SELECT al.*, u.Username', 'SELECT COUNT(*) as total');
    const total = (db.prepare(countQuery).get(...params) as any).total;
    
    query += ' ORDER BY al.Timestamp DESC LIMIT ? OFFSET ?';
    const logs = db.prepare(query).all(...params, Number(limit), offset);
    
    res.json({ data: logs, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

export default router;
