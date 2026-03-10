import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'pms-secret-key';

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    const user = db.prepare(`
      SELECT u.*, e.FirstName, e.LastName, r.RoleName 
      FROM Users u
      LEFT JOIN Employees e ON u.EmployeeID = e.EmployeeID
      LEFT JOIN Roles r ON u.RoleID = r.RoleID
      WHERE u.Username = ? AND u.IsActive = 1
    `).get(username) as any;

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.LockedUntil && new Date(user.LockedUntil) > new Date()) {
      return res.status(423).json({ error: 'Account locked' });
    }

    const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
    
    if (!isValidPassword) {
      db.prepare('UPDATE Users SET FailedLoginAttempts = FailedLoginAttempts + 1 WHERE UserID = ?').run(user.UserID);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.UserID, roleId: user.RoleID, username: user.Username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    db.prepare('UPDATE Users SET LastLogin = ?, FailedLoginAttempts = 0 WHERE UserID = ?').run(new Date().toISOString(), user.UserID);

    res.json({
      token,
      user: {
        id: user.UserID,
        username: user.Username,
        firstName: user.FirstName,
        lastName: user.LastName,
        role: user.RoleName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

router.post('/refresh-token', (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const newToken = jwt.sign(
      { userId: decoded.userId, roleId: decoded.roleId, username: decoded.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token: newToken });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.get('/profile', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = db.prepare(`
      SELECT u.UserID, u.Username, u.Email, u.RoleID, r.RoleName,
             e.FirstName, e.LastName, e.Phone, e.Position
      FROM Users u
      LEFT JOIN Employees e ON u.EmployeeID = e.EmployeeID
      LEFT JOIN Roles r ON u.RoleID = r.RoleID
      WHERE u.UserID = ?
    `).get(decoded.userId) as any;

    res.json(user);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({ message: 'Password reset link sent' });
});

router.post('/reset-password', (req: Request, res: Response) => {
  const { token, password } = req.body;
  res.json({ message: 'Password reset successfully' });
});

export default router;
