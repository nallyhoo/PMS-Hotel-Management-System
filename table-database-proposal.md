Below is a **Complete Database Design for a Hotel Management System (50+ tables)** similar to what large hotel software uses. This design supports **reservations, guests, rooms, billing, housekeeping, staff, inventory, and reporting**.

---

# 1. Hotel Core Tables

These tables store hotel property information.

1. **Hotels**

* HotelID (PK)
* HotelName
* Address
* City
* Country
* Phone
* Email
* Website
* Timezone
* CreatedDate

2. **HotelBranches**

* BranchID (PK)
* HotelID (FK)
* BranchName
* Address
* Phone

3. **Floors**

* FloorID (PK)
* BranchID (FK)
* FloorNumber
* Description

---

# 2. Room Management

4. **RoomTypes**

* RoomTypeID (PK)
* TypeName
* Description
* Capacity
* BasePrice

5. **Rooms**

* RoomID (PK)
* BranchID (FK)
* RoomNumber
* RoomTypeID (FK)
* FloorID (FK)
* Status
* Notes

6. **RoomAmenities**

* AmenityID (PK)
* AmenityName
* Description

7. **RoomTypeAmenities**

* ID (PK)
* RoomTypeID (FK)
* AmenityID (FK)

8. **RoomImages**

* ImageID (PK)
* RoomTypeID (FK)
* ImageURL

9. **RoomStatusHistory**

* StatusID (PK)
* RoomID (FK)
* Status
* StartTime
* EndTime

---

# 3. Guest Management

10. **Guests**

* GuestID (PK)
* FirstName
* LastName
* Email
* Phone
* Nationality
* DateOfBirth

11. **GuestDocuments**

* DocumentID (PK)
* GuestID (FK)
* DocumentType
* DocumentNumber
* ImageURL

12. **GuestPreferences**

* PreferenceID (PK)
* GuestID (FK)
* PreferenceType
* PreferenceValue

13. **GuestLoyalty**

* LoyaltyID (PK)
* GuestID (FK)
* Points
* TierLevel

---

# 4. Reservation System

14. **Reservations**

* ReservationID (PK)
* GuestID (FK)
* BranchID (FK)
* CheckInDate
* CheckOutDate
* Status
* BookingSource

15. **ReservationRooms**

* ReservationRoomID (PK)
* ReservationID (FK)
* RoomID (FK)
* Rate

16. **ReservationGuests**

* ID (PK)
* ReservationID (FK)
* GuestID (FK)

17. **ReservationNotes**

* NoteID (PK)
* ReservationID (FK)
* NoteText

18. **ReservationHistory**

* HistoryID (PK)
* ReservationID (FK)
* Action
* ActionDate

---

# 5. Check-in / Check-out

19. **CheckIns**

* CheckInID (PK)
* ReservationID (FK)
* CheckInDate
* AssignedRoom

20. **CheckOuts**

* CheckOutID (PK)
* ReservationID (FK)
* CheckOutDate
* TotalBill

---

# 6. Billing & Payments

21. **Invoices**

* InvoiceID (PK)
* ReservationID (FK)
* InvoiceDate
* TotalAmount

22. **InvoiceItems**

* ItemID (PK)
* InvoiceID (FK)
* Description
* Amount

23. **Payments**

* PaymentID (PK)
* InvoiceID (FK)
* PaymentDate
* PaymentMethod
* Amount

24. **PaymentMethods**

* MethodID (PK)
* MethodName

25. **Refunds**

* RefundID (PK)
* PaymentID (FK)
* RefundAmount
* RefundDate

---

# 7. Services & POS

26. **Services**

* ServiceID (PK)
* ServiceName
* CategoryID (FK)
* Price

27. **ServiceCategories**

* CategoryID (PK)
* CategoryName

28. **ServiceOrders**

* OrderID (PK)
* ReservationID (FK)
* OrderDate

29. **ServiceOrderItems**

* OrderItemID (PK)
* OrderID (FK)
* ServiceID (FK)
* Quantity
* Price

---

# 8. Housekeeping

30. **HousekeepingTasks**

* TaskID (PK)
* RoomID (FK)
* AssignedStaff
* Status
* ScheduledDate

31. **HousekeepingStatus**

* StatusID (PK)
* RoomID (FK)
* CleaningStatus
* UpdatedTime

32. **CleaningLogs**

* LogID (PK)
* RoomID (FK)
* StaffID (FK)
* CleaningDate

---

# 9. Maintenance

33. **MaintenanceRequests**

* RequestID (PK)
* RoomID (FK)
* Description
* Status

34. **MaintenanceTasks**

* TaskID (PK)
* RequestID (FK)
* AssignedStaff
* Status

35. **MaintenanceHistory**

* HistoryID (PK)
* TaskID (FK)
* UpdateDate

---

# 10. Staff & HR

36. **Employees**

* EmployeeID (PK)
* FirstName
* LastName
* Email
* Phone
* Position

37. **Departments**

* DepartmentID (PK)
* DepartmentName

38. **EmployeeDepartments**

* ID (PK)
* EmployeeID (FK)
* DepartmentID (FK)

39. **EmployeeSchedules**

* ScheduleID (PK)
* EmployeeID (FK)
* ShiftDate
* ShiftType

40. **Attendance**

* AttendanceID (PK)
* EmployeeID (FK)
* CheckIn
* CheckOut

---

# 11. Inventory Management

41. **InventoryItems**

* ItemID (PK)
* ItemName
* CategoryID (FK)
* Quantity

42. **InventoryCategories**

* CategoryID (PK)
* CategoryName

43. **InventoryTransactions**

* TransactionID (PK)
* ItemID (FK)
* Quantity
* TransactionType

44. **Suppliers**

* SupplierID (PK)
* SupplierName
* Contact

45. **PurchaseOrders**

* PurchaseID (PK)
* SupplierID (FK)
* OrderDate

46. **PurchaseOrderItems**

* ID (PK)
* PurchaseID (FK)
* ItemID (FK)
* Quantity

---

# 12. Reporting & Analytics

47. **DailyReports**

* ReportID (PK)
* BranchID (FK)
* Date
* TotalRevenue

48. **OccupancyReports**

* ReportID (PK)
* Date
* OccupancyRate

49. **RevenueReports**

* ReportID (PK)
* Date
* RoomRevenue
* ServiceRevenue

---

# 13. Security & System

50. **Users**

* UserID (PK)
* EmployeeID (FK)
* Username
* PasswordHash
* RoleID

51. **Roles**

* RoleID (PK)
* RoleName

52. **Permissions**

* PermissionID (PK)
* PermissionName

53. **RolePermissions**

* ID (PK)
* RoleID (FK)
* PermissionID (FK)

54. **ActivityLogs**

* LogID (PK)
* UserID (FK)
* Action
* Timestamp

---

# Summary

Total tables: **54 Tables**

Modules supported:

* Hotel Property
* Room Management
* Reservation System
* Guest Management
* Check-in / Check-out
* Billing & Payments
* POS Services
* Housekeeping
* Maintenance
* Staff Management
* Inventory
* Reporting
* Security

---

