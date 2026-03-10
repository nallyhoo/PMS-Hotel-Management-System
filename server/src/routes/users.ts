import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const users = db.prepare(`
      SELECT u.UserID, u.Username, u.IsActive, u.LastLogin, u.FailedLoginAttempts,
             e.FirstName, e.LastName, e.Email, r.RoleName
      FROM Users u
      LEFT JOIN Employees e ON u.EmployeeID = e.EmployeeID
      LEFT JOIN Roles r ON u.RoleID = r.RoleID
    `).all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const user = db.prepare(`
      SELECT u.*, e.FirstName, e.LastName, r.RoleName
      FROM Users u
      LEFT JOIN Employees e ON u.EmployeeID = e.EmployeeID
      LEFT JOIN Roles r ON u.RoleID = r.RoleID
      WHERE u.UserID = ?
    `).get(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, password, employeeId, roleId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = db.prepare(`
      INSERT INTO Users (Username, PasswordHash, EmployeeID, RoleID)
      VALUES (?, ?, ?, ?)
    `).run(username, passwordHash, employeeId, roleId);
    
    res.status(201).json({ userId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { username, password, roleId, isActive } = req.body;
    
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      db.prepare('UPDATE Users SET Username = ?, PasswordHash = ?, RoleID = ?, IsActive = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE UserID = ?')
        .run(username, passwordHash, roleId, isActive, req.params.id);
    } else {
      db.prepare('UPDATE Users SET Username = ?, RoleID = ?, IsActive = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE UserID = ?')
        .run(username, roleId, isActive, req.params.id);
    }
    
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE Users SET IsActive = 0 WHERE UserID = ?').run(req.params.id);
    res.json({ message: 'User deactivated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

export default router;
