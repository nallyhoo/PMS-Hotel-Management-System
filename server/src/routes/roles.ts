import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const roles = db.prepare('SELECT * FROM Roles WHERE IsActive = 1').all();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const role = db.prepare('SELECT * FROM Roles WHERE RoleID = ?').get(req.params.id);
    const permissions = db.prepare(`
      SELECT p.*, rp.IsGranted
      FROM RolePermissions rp
      JOIN Permissions p ON rp.PermissionID = p.PermissionID
      WHERE rp.RoleID = ?
    `).all(req.params.id);
    res.json({ ...role, permissions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch role' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { roleName, roleDescription } = req.body;
    const result = db.prepare('INSERT INTO Roles (RoleName, RoleDescription) VALUES (?, ?)').run(roleName, roleDescription);
    res.status(201).json({ roleId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create role' });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { roleName, roleDescription, isActive } = req.body;
    db.prepare('UPDATE Roles SET RoleName = ?, RoleDescription = ?, IsActive = ? WHERE RoleID = ?').run(roleName, roleDescription, isActive, req.params.id);
    res.json({ message: 'Role updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE Roles SET IsActive = 0 WHERE RoleID = ? AND IsSystemRole = 0').run(req.params.id);
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

router.post('/:id/permissions', (req: Request, res: Response) => {
  try {
    const { permissions } = req.body;
    
    db.prepare('DELETE FROM RolePermissions WHERE RoleID = ?').run(req.params.id);
    
    if (permissions && permissions.length > 0) {
      const insert = db.prepare('INSERT INTO RolePermissions (RoleID, PermissionID, IsGranted) VALUES (?, ?, ?)');
      permissions.forEach((permissionId: number) => {
        insert.run(req.params.id, permissionId, 1);
      });
    }
    
    res.json({ message: 'Permissions updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update permissions' });
  }
});

export default router;
