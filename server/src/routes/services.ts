import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/services', (req: Request, res: Response) => {
  try {
    const services = db.prepare(`
      SELECT s.*, sc.CategoryName
      FROM Services s
      LEFT JOIN ServiceCategories sc ON s.CategoryID = sc.CategoryID
      WHERE s.IsAvailable = 1
    `).all();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.get('/services/:id', (req: Request, res: Response) => {
  try {
    const service = db.prepare('SELECT * FROM Services WHERE ServiceID = ?').get(req.params.id);
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

router.post('/services', (req: Request, res: Response) => {
  try {
    const { serviceName, categoryId, description, price, priceType, imageUrl } = req.body;
    const result = db.prepare(`
      INSERT INTO Services (ServiceName, CategoryID, Description, Price, PriceType, ImageURL)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(serviceName, categoryId, description, price, priceType || 'Fixed', imageUrl);
    res.status(201).json({ serviceId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/services/:id', (req: Request, res: Response) => {
  try {
    const { serviceName, categoryId, description, price, priceType, isAvailable } = req.body;
    db.prepare(`
      UPDATE Services SET ServiceName = ?, CategoryID = ?, Description = ?, Price = ?, PriceType = ?, IsAvailable = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE ServiceID = ?
    `).run(serviceName, categoryId, description, price, priceType, isAvailable, req.params.id);
    res.json({ message: 'Service updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE Services SET IsAvailable = 0 WHERE ServiceID = ?').run(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

router.get('/categories', (req: Request, res: Response) => {
  try {
    const categories = db.prepare('SELECT * FROM ServiceCategories WHERE IsActive = 1 ORDER BY SortOrder').all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/categories', (req: Request, res: Response) => {
  try {
    const { categoryName, description, sortOrder } = req.body;
    const result = db.prepare('INSERT INTO ServiceCategories (CategoryName, Description, SortOrder) VALUES (?, ?, ?)').run(categoryName, description, sortOrder || 0);
    res.status(201).json({ categoryId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.get('/orders', (req: Request, res: Response) => {
  try {
    const { status, orderType, roomId } = req.query;
    let query = `
      SELECT so.*, r.RoomNumber, rm.RoomNumber as DeliveryRoom
      FROM ServiceOrders so
      LEFT JOIN Reservations rs ON so.ReservationID = rs.ReservationID
      LEFT JOIN Rooms r ON so.RoomID = r.RoomID
      WHERE 1=1
    `;
    const params: any[] = [];
    if (status) { query += ' AND so.Status = ?'; params.push(status); }
    if (orderType) { query += ' AND so.OrderType = ?'; params.push(orderType); }
    if (roomId) { query += ' AND so.RoomID = ?'; params.push(roomId); }
    query += ' ORDER BY so.OrderDate DESC';
    const orders = db.prepare(query).all(...params);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/orders', (req: Request, res: Response) => {
  try {
    const { reservationId, roomId, orderType, staffId, deliveryRoom, tableNumber, numberOfGuests, notes, items } = req.body;
    
    let subTotal = 0;
    if (items) {
      items.forEach((item: any) => { subTotal += item.amount; });
    }
    
    const result = db.prepare(`
      INSERT INTO ServiceOrders (ReservationID, RoomID, OrderType, StaffID, DeliveryRoom, TableNumber, NumberOfGuests, Notes, SubTotal, TotalAmount, Status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `).run(reservationId, roomId, orderType, staffId, deliveryRoom, tableNumber, numberOfGuests, notes, subTotal, subTotal);

    if (items && items.length > 0) {
      const insertItem = db.prepare(`
        INSERT INTO ServiceOrderItems (OrderID, ServiceID, Quantity, UnitPrice, Amount)
        VALUES (?, ?, ?, ?, ?)
      `);
      items.forEach((item: any) => {
        insertItem.run(result.lastInsertRowid, item.serviceId, item.quantity, item.unitPrice, item.amount);
      });
    }

    res.status(201).json({ orderId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.put('/orders/:id', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE ServiceOrders SET Status = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE OrderID = ?').run(status, req.params.id);
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
