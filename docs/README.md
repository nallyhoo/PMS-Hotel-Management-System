# PMS API Documentation Summary

## Total Endpoints: 200+

### 1. Authentication (6 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/refresh-token` | Refresh JWT token |
| GET | `/api/auth/profile` | Get current user profile |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |

### 2. Hotels (10 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels` | Get all hotels |
| POST | `/api/hotels` | Create new hotel |
| GET | `/api/hotels/{id}` | Get hotel by ID |
| PUT | `/api/hotels/{id}` | Update hotel |
| DELETE | `/api/hotels/{id}` | Delete hotel |
| GET | `/api/hotels/{hotelId}/branches` | Get branches |
| POST | `/api/hotels/{hotelId}/branches` | Create branch |
| GET | `/api/hotels/{hotelId}/floors` | Get floors |
| POST | `/api/hotels/{hotelId}/floors` | Create floor |

### 3. Rooms (15 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | Get all rooms |
| POST | `/api/rooms` | Create new room |
| GET | `/api/rooms/{id}` | Get room by ID |
| PUT | `/api/rooms/{id}` | Update room |
| DELETE | `/api/rooms/{id}` | Delete room |
| GET | `/api/rooms/availability/check` | Check availability |
| GET | `/api/rooms/types/list` | Get room types |
| POST | `/api/rooms/types` | Create room type |
| GET | `/api/rooms/types/{id}` | Get room type |
| PUT | `/api/rooms/types/{id}` | Update room type |
| DELETE | `/api/rooms/types/{id}` | Delete room type |
| GET | `/api/rooms/amenities` | Get amenities |
| POST | `/api/rooms/amenities` | Create amenity |
| DELETE | `/api/rooms/amenities/{id}` | Delete amenity |
| GET | `/api/rooms/status-board` | Get status board |

### 4. Guests (12 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/guests` | Get all guests |
| POST | `/api/guests` | Create new guest |
| GET | `/api/guests/{id}` | Get guest by ID |
| PUT | `/api/guests/{id}` | Update guest |
| DELETE | `/api/guests/{id}` | Delete guest |
| GET | `/api/guests/{id}/documents` | Get documents |
| POST | `/api/guests/{id}/documents` | Add document |
| GET | `/api/guests/{id}/preferences` | Get preferences |
| POST | `/api/guests/{id}/preferences` | Add preference |
| GET | `/api/guests/{id}/loyalty` | Get loyalty info |
| PUT | `/api/guests/{id}/loyalty` | Update loyalty |
| GET | `/api/guests/{id}/reservations` | Get history |

### 5. Reservations (20 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservations` | Get all reservations |
| POST | `/api/reservations` | Create reservation |
| GET | `/api/reservations/{id}` | Get reservation |
| PUT | `/api/reservations/{id}` | Update reservation |
| DELETE | `/api/reservations/{id}` | Delete reservation |
| POST | `/api/reservations/{id}/cancel` | Cancel reservation |
| POST | `/api/reservations/{id}/confirm` | Confirm reservation |
| POST | `/api/reservations/{id}/checkin` | Check-in guest |
| POST | `/api/reservations/{id}/checkout` | Check-out guest |
| GET | `/api/reservations/{id}/notes` | Get notes |
| POST | `/api/reservations/{id}/notes` | Add note |
| GET | `/api/reservations/calendar` | Get calendar |

### 6. Check-in / Check-out (4 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/checkins` | Get all check-ins |
| GET | `/api/checkins/{id}` | Get check-in |
| GET | `/api/checkouts` | Get all check-outs |
| GET | `/api/checkouts/{id}` | Get check-out |

### 7. Invoices (12 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | Get all invoices |
| POST | `/api/invoices` | Create invoice |
| GET | `/api/invoices/{id}` | Get invoice |
| PUT | `/api/invoices/{id}` | Update invoice |
| DELETE | `/api/invoices/{id}` | Cancel invoice |
| POST | `/api/invoices/{id}/items` | Add item |
| GET | `/api/invoices/{id}/print` | Print invoice |

### 8. Payments (10 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments` | Get all payments |
| POST | `/api/payments` | Process payment |
| GET | `/api/payments/{id}` | Get payment |
| POST | `/api/payments/{id}/refund` | Process refund |
| GET | `/api/payments/methods/list` | Get methods |
| POST | `/api/payments/methods` | Create method |
| GET | `/api/payments/history` | Get history |

### 9. Services & POS (10 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services/services` | Get services |
| POST | `/api/services/services` | Create service |
| GET | `/api/services/services/{id}` | Get service |
| PUT | `/api/services/services/{id}` | Update service |
| DELETE | `/api/services/services/{id}` | Delete service |
| GET | `/api/services/categories` | Get categories |
| POST | `/api/services/categories` | Create category |
| GET | `/api/services/orders` | Get orders |
| POST | `/api/services/orders` | Create order |
| PUT | `/api/services/orders/{id}` | Update order |

### 10. Housekeeping (10 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/housekeeping/tasks` | Get tasks |
| POST | `/api/housekeeping/tasks` | Create task |
| PUT | `/api/housekeeping/tasks/{id}` | Update task |
| DELETE | `/api/housekeeping/tasks/{id}` | Cancel task |
| GET | `/api/housekeeping/status` | Get status |
| POST | `/api/housekeeping/logs` | Create log |
| GET | `/api/housekeeping/dashboard` | Get dashboard |

### 11. Maintenance (10 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/maintenance/requests` | Get requests |
| POST | `/api/maintenance/requests` | Create request |
| GET | `/api/maintenance/requests/{id}` | Get request |
| PUT | `/api/maintenance/requests/{id}` | Update request |
| POST | `/api/maintenance/tasks` | Create task |
| PUT | `/api/maintenance/tasks/{id}` | Update task |
| GET | `/api/maintenance/history` | Get history |

### 12. Inventory (12 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory/items` | Get items |
| POST | `/api/inventory/items` | Create item |
| GET | `/api/inventory/items/{id}` | Get item |
| PUT | `/api/inventory/items/{id}` | Update item |
| DELETE | `/api/inventory/items/{id}` | Delete item |
| POST | `/api/inventory/adjustment` | Adjust stock |
| GET | `/api/inventory/transactions` | Get transactions |
| GET | `/api/inventory/alerts` | Get alerts |
| GET | `/api/inventory/categories` | Get categories |
| POST | `/api/inventory/categories` | Create category |
| GET | `/api/inventory/suppliers` | Get suppliers |
| POST | `/api/inventory/suppliers` | Create supplier |
| GET | `/api/inventory/purchase-orders` | Get orders |

### 13. Staff (10 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/staff` | Get employees |
| POST | `/api/staff` | Create employee |
| GET | `/api/staff/{id}` | Get employee |
| PUT | `/api/staff/{id}` | Update employee |
| DELETE | `/api/staff/{id}` | Terminate |
| GET | `/api/staff/departments` | Get departments |
| POST | `/api/staff/departments` | Create department |
| GET | `/api/staff/schedules` | Get schedules |
| POST | `/api/staff/schedules` | Create schedule |
| GET | `/api/staff/attendance` | Get attendance |
| POST | `/api/staff/attendance/checkin` | Staff check-in |
| POST | `/api/staff/attendance/checkout` | Staff check-out |

### 14. Reports (7 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/revenue` | Revenue report |
| GET | `/api/reports/occupancy` | Occupancy report |
| GET | `/api/reports/bookings` | Bookings report |
| GET | `/api/reports/payments` | Payments report |
| GET | `/api/reports/guests` | Guest stats |
| GET | `/api/reports/staff` | Staff report |
| GET | `/api/reports/room-availability` | Room availability |

### 15. Users (5 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create user |
| GET | `/api/users/{id}` | Get user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Deactivate user |

### 16. Roles (5 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roles` | Get all roles |
| POST | `/api/roles` | Create role |
| GET | `/api/roles/{id}` | Get role |
| PUT | `/api/roles/{id}` | Update role |
| DELETE | `/api/roles/{id}` | Delete role |
| POST | `/api/roles/{id}/permissions` | Update permissions |

### 17. Permissions (4 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/permissions` | Get permissions |
| POST | `/api/permissions` | Create permission |
| GET | `/api/permissions/modules` | Get modules |
| DELETE | `/api/permissions/{id}` | Delete permission |
| GET | `/api/permissions/activity-logs` | Activity logs |

### 18. Settings (15 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/tax-rates` | Get tax rates |
| POST | `/api/settings/tax-rates` | Create tax rate |
| GET | `/api/settings/currencies` | Get currencies |
| POST | `/api/settings/currencies` | Create currency |
| GET | `/api/settings/languages` | Get languages |
| POST | `/api/settings/languages` | Create language |
| GET | `/api/settings/payment-gateways` | Get gateways |
| POST | `/api/settings/payment-gateways` | Create gateway |
| GET | `/api/settings/hotel` | Get hotel info |
| PUT | `/api/settings/hotel` | Update hotel info |

### 19. Notifications (10 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| POST | `/api/notifications` | Create notification |
| PUT | `/api/notifications/{id}` | Update notification |
| GET | `/api/notifications/email-templates` | Get email templates |
| POST | `/api/notifications/email-templates` | Create email template |
| PUT | `/api/notifications/email-templates/{id}` | Update email template |
| GET | `/api/notifications/sms-templates` | Get SMS templates |
| POST | `/api/notifications/sms-templates` | Create SMS template |
| PUT | `/api/notifications/sms-templates/{id}` | Update SMS template |

---

## Quick Start

### 1. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. Use Token
```bash
curl -X GET http://localhost:3001/api/rooms \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## View Documentation

Open `docs/index.html` in a browser to view the interactive Swagger UI documentation.
