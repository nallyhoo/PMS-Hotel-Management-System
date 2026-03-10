Below is a **logical ER Diagram structure for the 54 tables of the Hotel Management System**. Because 54 tables are very large, the ERD is usually divided into **modules**, just like real enterprise systems. This makes it easier to design and implement.

---

# 1. Hotel Structure ERD

```
Hotels
 └── HotelBranches
       └── Floors
```

**Relationships**

* Hotels (1) —— (M) HotelBranches
* HotelBranches (1) —— (M) Floors

---

# 2. Room Management ERD

```
RoomTypes
   ├── RoomTypeAmenities
   │       └── RoomAmenities
   └── RoomImages

Floors
   └── Rooms
        └── RoomStatusHistory
```

**Relationships**

* RoomTypes (1) —— (M) Rooms
* Floors (1) —— (M) Rooms
* RoomTypes (1) —— (M) RoomTypeAmenities
* RoomAmenities (1) —— (M) RoomTypeAmenities
* Rooms (1) —— (M) RoomStatusHistory

---

# 3. Guest Management ERD

```
Guests
 ├── GuestDocuments
 ├── GuestPreferences
 └── GuestLoyalty
```

**Relationships**

* Guests (1) —— (M) GuestDocuments
* Guests (1) —— (M) GuestPreferences
* Guests (1) —— (1) GuestLoyalty

---

# 4. Reservation System ERD

```
Guests
   └── Reservations
          ├── ReservationRooms
          │        └── Rooms
          ├── ReservationGuests
          ├── ReservationNotes
          └── ReservationHistory
```

**Relationships**

* Guests (1) —— (M) Reservations
* Reservations (1) —— (M) ReservationRooms
* Rooms (1) —— (M) ReservationRooms
* Reservations (1) —— (M) ReservationNotes
* Reservations (1) —— (M) ReservationHistory

---

# 5. Check-in / Check-out ERD

```
Reservations
   ├── CheckIns
   └── CheckOuts
```

**Relationships**

* Reservations (1) —— (1) CheckIns
* Reservations (1) —— (1) CheckOuts

---

# 6. Billing & Payment ERD

```
Reservations
   └── Invoices
         ├── InvoiceItems
         └── Payments
                ├── PaymentMethods
                └── Refunds
```

**Relationships**

* Reservations (1) —— (M) Invoices
* Invoices (1) —— (M) InvoiceItems
* Invoices (1) —— (M) Payments
* Payments (1) —— (M) Refunds
* PaymentMethods (1) —— (M) Payments

---

# 7. Service / POS ERD

```
ServiceCategories
      └── Services

Reservations
      └── ServiceOrders
             └── ServiceOrderItems
                    └── Services
```

**Relationships**

* ServiceCategories (1) —— (M) Services
* Reservations (1) —— (M) ServiceOrders
* ServiceOrders (1) —— (M) ServiceOrderItems
* Services (1) —— (M) ServiceOrderItems

---

# 8. Housekeeping ERD

```
Rooms
 ├── HousekeepingTasks
 ├── HousekeepingStatus
 └── CleaningLogs
```

**Relationships**

* Rooms (1) —— (M) HousekeepingTasks
* Rooms (1) —— (M) HousekeepingStatus
* Rooms (1) —— (M) CleaningLogs

---

# 9. Maintenance ERD

```
Rooms
 └── MaintenanceRequests
        └── MaintenanceTasks
               └── MaintenanceHistory
```

**Relationships**

* Rooms (1) —— (M) MaintenanceRequests
* MaintenanceRequests (1) —— (M) MaintenanceTasks
* MaintenanceTasks (1) —— (M) MaintenanceHistory

---

# 10. Staff / HR ERD

```
Departments
    └── EmployeeDepartments
            └── Employees
                    ├── EmployeeSchedules
                    └── Attendance
```

**Relationships**

* Departments (1) —— (M) EmployeeDepartments
* Employees (1) —— (M) EmployeeSchedules
* Employees (1) —— (M) Attendance

---

# 11. Inventory ERD

```
InventoryCategories
      └── InventoryItems
             └── InventoryTransactions

Suppliers
     └── PurchaseOrders
            └── PurchaseOrderItems
```

**Relationships**

* InventoryCategories (1) —— (M) InventoryItems
* InventoryItems (1) —— (M) InventoryTransactions
* Suppliers (1) —— (M) PurchaseOrders
* PurchaseOrders (1) —— (M) PurchaseOrderItems

---

# 12. Reporting ERD

```
HotelBranches
   ├── DailyReports
   ├── OccupancyReports
   └── RevenueReports
```

---

# 13. Security ERD

```
Employees
   └── Users
         ├── Roles
         │     └── RolePermissions
         │           └── Permissions
         └── ActivityLogs
```

**Relationships**

* Employees (1) —— (1) Users
* Roles (1) —— (M) Users
* Roles (1) —— (M) RolePermissions
* Permissions (1) —— (M) RolePermissions
* Users (1) —— (M) ActivityLogs

---

# Complete High-Level ER Diagram (Simplified)

```
Guests
  │
  └── Reservations
        ├── ReservationRooms ── Rooms ── RoomTypes
        ├── Invoices ── Payments
        ├── ServiceOrders ── Services
        ├── CheckIns
        └── CheckOuts

Rooms
 ├── HousekeepingTasks
 ├── MaintenanceRequests
 └── CleaningLogs

Employees
 ├── Users ── Roles ── Permissions
 ├── Attendance
 └── EmployeeSchedules

Inventory
 ├── InventoryItems
 └── Suppliers ── PurchaseOrders
```

---

