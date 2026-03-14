import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

interface PaymentGatewayConfig {
  gatewayId: number;
  gatewayName: string;
  gatewayType: string;
  configJson: string;
  isActive: boolean;
  isTestMode: boolean;
}

interface GatewayConfig {
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  webhookUrl?: string;
}

router.get('/gateways', (req: Request, res: Response) => {
  try {
    const gateways = db.prepare('SELECT * FROM PaymentGateways').all();
    res.json(gateways);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment gateways' });
  }
});

router.get('/gateways/:id', (req: Request, res: Response) => {
  try {
    const gateway = db.prepare('SELECT * FROM PaymentGateways WHERE GatewayID = ?').get(req.params.id);
    if (!gateway) {
      return res.status(404).json({ error: 'Gateway not found' });
    }
    res.json(gateway);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gateway' });
  }
});

router.post('/gateways', (req: Request, res: Response) => {
  try {
    const { gatewayName, gatewayType, config, isTestMode } = req.body;
    
    const configJson = JSON.stringify(config || {});
    
    const result = db.prepare(`
      INSERT INTO PaymentGateways (GatewayName, GatewayType, ConfigJSON, IsActive, IsTestMode)
      VALUES (?, ?, ?, 1, ?)
    `).run(gatewayName, gatewayType, configJson, isTestMode ? 1 : 0);

    res.status(201).json({ gatewayId: result.lastInsertRowid, message: 'Gateway created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create gateway' });
  }
});

router.put('/gateways/:id', (req: Request, res: Response) => {
  try {
    const { gatewayName, gatewayType, config, isActive, isTestMode } = req.body;
    
    const configJson = JSON.stringify(config || {});
    
    db.prepare(`
      UPDATE PaymentGateways 
      SET GatewayName = ?, GatewayType = ?, ConfigJSON = ?, IsActive = ?, IsTestMode = ?, UpdatedDate = CURRENT_TIMESTAMP
      WHERE GatewayID = ?
    `).run(gatewayName, gatewayType, configJson, isActive ? 1 : 0, isTestMode ? 1 : 0, req.params.id);

    res.json({ message: 'Gateway updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gateway' });
  }
});

router.delete('/gateways/:id', (req: Request, res: Response) => {
  try {
    db.prepare('DELETE FROM PaymentGateways WHERE GatewayID = ?').run(req.params.id);
    res.json({ message: 'Gateway deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gateway' });
  }
});

router.post('/process-card', async (req: Request, res: Response) => {
  try {
    const { invoiceId, amount, currency, cardNumber, cardExpiry, cardCvv, gatewayId, saveCard } = req.body;
    
    const gateway = db.prepare('SELECT * FROM PaymentGateways WHERE GatewayID = ?').get(gatewayId) as PaymentGatewayConfig | undefined;
    
    if (!gateway) {
      return res.status(400).json({ error: 'Payment gateway not configured' });
    }

    if (!gateway.isActive) {
      return res.status(400).json({ error: 'Payment gateway is inactive' });
    }

    const config: GatewayConfig = JSON.parse(gateway.configJson || '{}');
    
    const isTestMode = gateway.isTestMode;
    
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const maskedCard = cardNumber ? `****${cardNumber.slice(-4)}` : '****';
    
    const paymentResult = db.prepare(`
      INSERT INTO Payments (InvoiceID, PaymentMethod, Amount, Currency, TransactionID, CardLast4, CardType, Status, PaymentDate)
      VALUES (?, 'Credit Card', ?, ?, ?, ?, ?, 'Completed', CURRENT_TIMESTAMP)
    `).run(invoiceId, amount, currency || 'USD', transactionId, maskedCard, cardNumber ? cardNumber.charAt(0) === '4' ? 'Visa' : 'Mastercard' : 'Unknown');

    if (invoiceId) {
      const invoice = db.prepare('SELECT TotalAmount, AmountPaid FROM Invoices WHERE InvoiceID = ?').get(invoiceId) as any;
      if (invoice) {
        const newAmountPaid = (invoice.AmountPaid || 0) + amount;
        const newStatus = newAmountPaid >= invoice.TotalAmount ? 'Paid' : 'Partial';
        db.prepare('UPDATE Invoices SET AmountPaid = ?, BalanceDue = TotalAmount - ?, Status = ? WHERE InvoiceID = ?')
          .run(newAmountPaid, newAmountPaid, newStatus, invoiceId);
      }
    }

    res.json({
      success: true,
      paymentId: paymentResult.lastInsertRowid,
      transactionId,
      message: isTestMode ? 'Test payment processed successfully' : 'Payment processed successfully',
      testMode: isTestMode
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

router.post('/process-paypal', (req: Request, res: Response) => {
  try {
    const { invoiceId, amount, currency, paypalEmail, transactionId: clientTxnId } = req.body;
    
    const transactionId = clientTxnId || `PP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentResult = db.prepare(`
      INSERT INTO Payments (InvoiceID, PaymentMethod, Amount, Currency, TransactionID, Status, PaymentDate)
      VALUES (?, 'Mobile Payment', ?, ?, ?, 'Completed', CURRENT_TIMESTAMP)
    `).run(invoiceId, amount, currency || 'USD', transactionId);

    if (invoiceId) {
      const invoice = db.prepare('SELECT TotalAmount, AmountPaid FROM Invoices WHERE InvoiceID = ?').get(invoiceId) as any;
      if (invoice) {
        const newAmountPaid = (invoice.AmountPaid || 0) + amount;
        const newStatus = newAmountPaid >= invoice.TotalAmount ? 'Paid' : 'Partial';
        db.prepare('UPDATE Invoices SET AmountPaid = ?, BalanceDue = TotalAmount - ?, Status = ? WHERE InvoiceID = ?')
          .run(newAmountPaid, newAmountPaid, newStatus, invoiceId);
      }
    }

    res.json({
      success: true,
      paymentId: paymentResult.lastInsertRowid,
      transactionId,
      message: 'PayPal payment processed'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process PayPal payment' });
  }
});

router.post('/process-bank-transfer', (req: Request, res: Response) => {
  try {
    const { invoiceId, amount, currency, bankName, referenceNumber } = req.body;
    
    const transactionId = `BT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentResult = db.prepare(`
      INSERT INTO Payments (InvoiceID, PaymentMethod, Amount, Currency, ReferenceNumber, TransactionID, Status, PaymentDate)
      VALUES (?, 'Bank Transfer', ?, ?, ?, ?, 'Pending', CURRENT_TIMESTAMP)
    `).run(invoiceId, amount, currency || 'USD', bankName, referenceNumber || transactionId, transactionId);

    res.json({
      success: true,
      paymentId: paymentResult.lastInsertRowid,
      transactionId,
      message: 'Bank transfer recorded - pending confirmation'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process bank transfer' });
  }
});

router.post('/webhook/:gateway', (req: Request, res: Response) => {
  try {
    const { gateway } = req.params;
    const webhookData = req.body;
    
    console.log(`Webhook received from ${gateway}:`, webhookData);
    
    if (webhookData.event === 'payment.completed' || webhookData.event === 'payment.success') {
      const transactionId = webhookData.transaction_id || webhookData.id;
      
      const payment = db.prepare('SELECT * FROM Payments WHERE TransactionID = ?').get(transactionId) as any;
      
      if (payment) {
        db.prepare(`UPDATE Payments SET Status = 'Completed' WHERE TransactionID = ?`).run(transactionId);
        
        if (payment.InvoiceID) {
          const invoice = db.prepare('SELECT TotalAmount, AmountPaid FROM Invoices WHERE InvoiceID = ?').get(payment.InvoiceID) as any;
          if (invoice) {
            const newAmountPaid = (invoice.AmountPaid || 0) + payment.Amount;
            const newStatus = newAmountPaid >= invoice.TotalAmount ? 'Paid' : 'Partial';
            db.prepare('UPDATE Invoices SET AmountPaid = ?, BalanceDue = TotalAmount - ?, Status = ? WHERE InvoiceID = ?')
              .run(newAmountPaid, newAmountPaid, newStatus, payment.InvoiceID);
          }
        }
      }
    } else if (webhookData.event === 'payment.failed' || webhookData.event === 'payment.error') {
      const transactionId = webhookData.transaction_id || webhookData.id;
      db.prepare(`UPDATE Payments SET Status = 'Failed' WHERE TransactionID = ?`).run(transactionId);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

router.get('/methods/active', (req: Request, res: Response) => {
  try {
    const methods = db.prepare('SELECT * FROM PaymentMethods WHERE IsActive = 1').all();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

router.put('/methods/:id/toggle', (req: Request, res: Response) => {
  try {
    const { isActive } = req.body;
    db.prepare('UPDATE PaymentMethods SET IsActive = ? WHERE MethodID = ?').run(isActive ? 1 : 0, req.params.id);
    res.json({ message: 'Payment method updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment method' });
  }
});

export default router;
