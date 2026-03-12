import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, seedDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

initDatabase();
seedDatabase();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import routes
import authRoutes from './routes/auth.js';
import hotelRoutes from './routes/hotels.js';
import roomRoutes from './routes/rooms.js';
import guestRoutes from './routes/guests.js';
import reservationRoutes from './routes/reservations.js';
import checkInRoutes from './routes/checkins.js';
import checkOutRoutes from './routes/checkouts.js';
import invoiceRoutes from './routes/invoices.js';
import paymentRoutes from './routes/payments.js';
import serviceRoutes from './routes/services.js';
import housekeepingRoutes from './routes/housekeeping.js';
import maintenanceRoutes from './routes/maintenance.js';
import inventoryRoutes from './routes/inventory.js';
import staffRoutes from './routes/staff.js';
import reportRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import permissionRoutes from './routes/permissions.js';
import settingsRoutes from './routes/settings.js';
import notificationRoutes from './routes/notifications.js';
import keyCardRoutes from './routes/keycards.js';
import guestNotesRoutes from './routes/guestNotes.js';
import guestLoyaltyRoutes from './routes/guestLoyalty.js';

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/checkins', checkInRoutes);
app.use('/api/checkouts', checkOutRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/keycards', keyCardRoutes);
app.use('/api/guests', guestNotesRoutes);
app.use('/api/guests', guestLoyaltyRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
