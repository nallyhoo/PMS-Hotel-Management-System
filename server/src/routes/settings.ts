import { Router, Request, Response } from 'express';
import db from '../config/database.js';

const router = Router();

router.get('/tax-rates', (req: Request, res: Response) => {
  try {
    const rates = db.prepare('SELECT * FROM TaxRates WHERE IsActive = 1').all();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tax rates' });
  }
});

router.post('/tax-rates', (req: Request, res: Response) => {
  try {
    const { taxName, taxCode, rate, taxType, country, isDefault } = req.body;
    if (isDefault) {
      db.prepare('UPDATE TaxRates SET IsDefault = 0').run();
    }
    const result = db.prepare('INSERT INTO TaxRates (TaxName, TaxCode, Rate, TaxType, Country, IsDefault) VALUES (?, ?, ?, ?, ?, ?)').run(taxName, taxCode, rate, taxType, country, isDefault ? 1 : 0);
    res.status(201).json({ taxRateId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tax rate' });
  }
});

router.get('/currencies', (req: Request, res: Response) => {
  try {
    const currencies = db.prepare('SELECT * FROM Currencies WHERE IsActive = 1').all();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currencies' });
  }
});

router.post('/currencies', (req: Request, res: Response) => {
  try {
    const { currencyCode, currencyName, symbol, exchangeRate, isDefault } = req.body;
    if (isDefault) {
      db.prepare('UPDATE Currencies SET IsDefault = 0').run();
    }
    const result = db.prepare('INSERT INTO Currencies (CurrencyCode, CurrencyName, Symbol, ExchangeRate, IsDefault) VALUES (?, ?, ?, ?, ?)').run(currencyCode, currencyName, symbol, exchangeRate, isDefault ? 1 : 0);
    res.status(201).json({ currencyId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create currency' });
  }
});

router.get('/languages', (req: Request, res: Response) => {
  try {
    const languages = db.prepare('SELECT * FROM Languages WHERE IsActive = 1 ORDER BY SortOrder').all();
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

router.post('/languages', (req: Request, res: Response) => {
  try {
    const { languageCode, languageName, nativeName, isDefault, sortOrder } = req.body;
    if (isDefault) {
      db.prepare('UPDATE Languages SET IsDefault = 0').run();
    }
    const result = db.prepare('INSERT INTO Languages (LanguageCode, LanguageName, NativeName, IsDefault, SortOrder) VALUES (?, ?, ?, ?, ?)').run(languageCode, languageName, nativeName, isDefault ? 1 : 0, sortOrder || 0);
    res.status(201).json({ languageId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create language' });
  }
});

router.get('/payment-gateways', (req: Request, res: Response) => {
  try {
    const gateways = db.prepare('SELECT * FROM PaymentGateways').all();
    res.json(gateways);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment gateways' });
  }
});

router.post('/payment-gateways', (req: Request, res: Response) => {
  try {
    const { gatewayName, gatewayType, configJson, isActive, isTestMode } = req.body;
    const result = db.prepare('INSERT INTO PaymentGateways (GatewayName, GatewayType, ConfigJSON, IsActive, IsTestMode) VALUES (?, ?, ?, ?, ?)').run(gatewayName, gatewayType, configJson, isActive ? 1 : 0, isTestMode ? 1 : 0);
    res.status(201).json({ gatewayId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment gateway' });
  }
});

router.get('/hotel', (req: Request, res: Response) => {
  try {
    const hotel = db.prepare('SELECT * FROM Hotels LIMIT 1').get();
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotel info' });
  }
});

router.put('/hotel', (req: Request, res: Response) => {
  try {
    const { hotelName, address, city, country, phone, email, website, timezone } = req.body;
    db.prepare('UPDATE Hotels SET HotelName = ?, Address = ?, City = ?, Country = ?, Phone = ?, Email = ?, Website = ?, Timezone = ?, UpdatedDate = CURRENT_TIMESTAMP WHERE HotelID = 1').run(hotelName, address, city, country, phone, email, website, timezone);
    res.json({ message: 'Hotel info updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hotel info' });
  }
});

export default router;
