import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/items', (req: Request, res: Response) => {
  try {
    const { categoryId, isActive } = req.query;
    let query = `
      SELECT ii.*, ic.CategoryName
      FROM InventoryItems ii
      LEFT JOIN InventoryCategories ic ON ii.CategoryID = ic.CategoryID
      WHERE 1=1
    `;
    const params: any[] = [];
    if (categoryId) { query += ' AND ii.CategoryID = ?'; params.push(categoryId); }
    if (isActive !== undefined) { query += ' AND ii.IsActive = ?'; params.push(isActive === 'true' ? 1 : 0); }
    query += ' ORDER BY ii.ItemName';
    const items = db.prepare(query).all(...params);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.get('/items/:id', (req: Request, res: Response) => {
  try {
    const item = db.prepare(`
      SELECT ii.*, ic.CategoryName
      FROM InventoryItems ii
      LEFT JOIN InventoryCategories ic ON ii.CategoryID = ic.CategoryID
      WHERE ii.ItemID = ?
    `).get(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

router.post('/items', (req: Request, res: Response) => {
  try {
    const { itemName, sku, categoryId, description, unitOfMeasure, currentStock, minimumStock, maximumStock, unitCost, unitPrice, location } = req.body;
    const result = db.prepare(`
      INSERT INTO InventoryItems (ItemName, SKU, CategoryID, Description, UnitOfMeasure, CurrentStock, MinimumStock, MaximumStock, UnitCost, UnitPrice, Location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(itemName, sku, categoryId, description, unitOfMeasure || 'pcs', currentStock || 0, minimumStock || 0, maximumStock || 0, unitCost, unitPrice, location);
    res.status(201).json({ itemId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

router.put('/items/:id', (req: Request, res: Response) => {
  try {
    const { itemName, sku, categoryId, description, unitOfMeasure, minimumStock, maximumStock, unitCost, unitPrice, location, isActive } = req.body;
    db.prepare(`
      UPDATE InventoryItems SET ItemName = ?, SKU = ?, CategoryID = ?, Description = ?, UnitOfMeasure = ?, MinimumStock = ?, MaximumStock = ?, UnitCost = ?, UnitPrice = ?, Location = ?, IsActive = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE ItemID = ?
    `).run(itemName, sku, categoryId, description, unitOfMeasure, minimumStock, maximumStock, unitCost, unitPrice, location, isActive, req.params.id);
    res.json({ message: 'Item updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/items/:id', (req: Request, res: Response) => {
  try {
    db.prepare('UPDATE InventoryItems SET IsActive = 0 WHERE ItemID = ?').run(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

router.post('/adjustment', (req: Request, res: Response) => {
  try {
    const { itemId, transactionType, quantity, notes } = req.body;
    const item = db.prepare('SELECT CurrentStock FROM InventoryItems WHERE ItemID = ?').get(itemId) as any;
    
    let newStock = item.CurrentStock;
    if (transactionType === 'Purchase' || transactionType === 'Return') newStock += quantity;
    else if (transactionType === 'Sale' || transactionType === 'Damaged' || transactionType === 'Expired') newStock -= quantity;
    else newStock = quantity;

    db.prepare('UPDATE InventoryItems SET CurrentStock = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE ItemID = ?').run(newStock, itemId);

    db.prepare(`
      INSERT INTO InventoryTransactions (ItemID, TransactionType, Quantity, PreviousStock, NewStock, Notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(itemId, transactionType, quantity, item.CurrentStock, newStock, notes);

    res.json({ message: 'Stock adjusted', newStock });
  } catch (error) {
    res.status(500).json({ error: 'Failed to adjust stock' });
  }
});

router.get('/transactions', (req: Request, res: Response) => {
  try {
    const { itemId, transactionType, startDate, endDate } = req.query;
    let query = `
      SELECT it.*, ii.ItemName
      FROM InventoryTransactions it
      JOIN InventoryItems ii ON it.ItemID = ii.ItemID
      WHERE 1=1
    `;
    const params: any[] = [];
    if (itemId) { query += ' AND it.ItemID = ?'; params.push(itemId); }
    if (transactionType) { query += ' AND it.TransactionType = ?'; params.push(transactionType); }
    if (startDate) { query += ' AND it.TransactionDate >= ?'; params.push(startDate); }
    if (endDate) { query += ' AND it.TransactionDate <= ?'; params.push(endDate); }
    query += ' ORDER BY it.TransactionDate DESC';
    const transactions = db.prepare(query).all(...params);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.get('/alerts', (req: Request, res: Response) => {
  try {
    const alerts = db.prepare(`
      SELECT * FROM InventoryItems
      WHERE CurrentStock <= ReorderPoint AND IsActive = 1
      ORDER BY CurrentStock
    `).all();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.get('/categories', (req: Request, res: Response) => {
  try {
    const categories = db.prepare('SELECT * FROM InventoryCategories WHERE IsActive = 1').all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/categories', (req: Request, res: Response) => {
  try {
    const { categoryName, description, parentCategoryId } = req.body;
    const result = db.prepare('INSERT INTO InventoryCategories (CategoryName, Description, ParentCategoryID) VALUES (?, ?, ?)').run(categoryName, description, parentCategoryId);
    res.status(201).json({ categoryId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.get('/suppliers', (req: Request, res: Response) => {
  try {
    const suppliers = db.prepare('SELECT * FROM Suppliers WHERE IsActive = 1').all();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

router.post('/suppliers', (req: Request, res: Response) => {
  try {
    const { supplierName, contactPerson, email, phone, address, city, country, paymentTerms } = req.body;
    const result = db.prepare(`
      INSERT INTO Suppliers (SupplierName, ContactPerson, Email, Phone, Address, City, Country, PaymentTerms)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(supplierName, contactPerson, email, phone, address, city, country, paymentTerms);
    res.status(201).json({ supplierId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

router.get('/purchase-orders', (req: Request, res: Response) => {
  try {
    const orders = db.prepare(`
      SELECT po.*, s.SupplierName
      FROM PurchaseOrders po
      JOIN Suppliers s ON po.SupplierID = s.SupplierID
      ORDER BY po.OrderDate DESC
    `).all();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

export default router;
