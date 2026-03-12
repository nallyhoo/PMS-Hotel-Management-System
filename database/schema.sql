-- ============================================================
-- PMS (Property Management System) Database Schema
-- Complete Database Design with 65+ Tables
-- Database: SQLite (compatible with better-sqlite3)
-- ============================================================

-- ============================================================
-- 1. HOTEL CORE TABLES
-- ============================================================

CREATE TABLE Hotels (
    HotelID INTEGER PRIMARY KEY AUTOINCREMENT,
    HotelName TEXT NOT NULL,
    Address TEXT,
    City TEXT,
    Country TEXT,
    Phone TEXT,
    Email TEXT,
    Website TEXT,
    Timezone TEXT DEFAULT 'UTC',
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE HotelBranches (
    BranchID INTEGER PRIMARY KEY AUTOINCREMENT,
    HotelID INTEGER NOT NULL,
    BranchName TEXT NOT NULL,
    Address TEXT,
    Phone TEXT,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (HotelID) REFERENCES Hotels(HotelID)
);

CREATE TABLE Floors (
    FloorID INTEGER PRIMARY KEY AUTOINCREMENT,
    BranchID INTEGER NOT NULL,
    FloorNumber INTEGER NOT NULL,
    FloorName TEXT,
    Description TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BranchID) REFERENCES HotelBranches(BranchID),
    UNIQUE(BranchID, FloorNumber)
);

-- ============================================================
-- 2. ROOM MANAGEMENT
-- ============================================================

CREATE TABLE RoomTypes (
    RoomTypeID INTEGER PRIMARY KEY AUTOINCREMENT,
    TypeName TEXT NOT NULL,
    Description TEXT,
    Capacity INTEGER DEFAULT 2,
    BasePrice DECIMAL(10,2) NOT NULL,
    MaxOccupancy INTEGER DEFAULT 2,
    BedType TEXT,
    SizeSqFt INTEGER,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Rooms (
    RoomID INTEGER PRIMARY KEY AUTOINCREMENT,
    BranchID INTEGER NOT NULL,
    RoomNumber TEXT NOT NULL,
    RoomTypeID INTEGER NOT NULL,
    FloorID INTEGER,
    Status TEXT DEFAULT 'Available' CHECK(Status IN ('Available', 'Occupied', 'Dirty', 'Maintenance', 'Reserved', 'Blocked')),
    CurrentReservationID INTEGER,
    CleaningStatus TEXT DEFAULT 'Clean' CHECK(CleaningStatus IN ('Clean', 'Dirty', 'Cleaning', 'Inspected')),
    Notes TEXT,
    LastCleaned DATETIME,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BranchID) REFERENCES HotelBranches(BranchID),
    FOREIGN KEY (RoomTypeID) REFERENCES RoomTypes(RoomTypeID),
    FOREIGN KEY (FloorID) REFERENCES Floors(FloorID),
    UNIQUE(BranchID, RoomNumber)
);

CREATE TABLE RoomAmenities (
    AmenityID INTEGER PRIMARY KEY AUTOINCREMENT,
    AmenityName TEXT NOT NULL UNIQUE,
    AmenityType TEXT,
    Description TEXT,
    Icon TEXT
);

CREATE TABLE RoomTypeAmenities (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomTypeID INTEGER NOT NULL,
    AmenityID INTEGER NOT NULL,
    FOREIGN KEY (RoomTypeID) REFERENCES RoomTypes(RoomTypeID),
    FOREIGN KEY (AmenityID) REFERENCES RoomAmenities(AmenityID),
    UNIQUE(RoomTypeID, AmenityID)
);

CREATE TABLE RoomImages (
    ImageID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomTypeID INTEGER NOT NULL,
    ImageURL TEXT NOT NULL,
    IsPrimary BOOLEAN DEFAULT 0,
    SortOrder INTEGER DEFAULT 0,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoomTypeID) REFERENCES RoomTypes(RoomTypeID)
);

CREATE TABLE RoomStatusHistory (
    StatusID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomID INTEGER NOT NULL,
    Status TEXT NOT NULL,
    PreviousStatus TEXT,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME,
    Notes TEXT,
    ChangedBy INTEGER,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

CREATE TABLE RoomTypePricing (
    PricingID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomTypeID INTEGER NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    DayOfWeek TEXT,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoomTypeID) REFERENCES RoomTypes(RoomTypeID)
);

-- ============================================================
-- 3. GUEST MANAGEMENT
-- ============================================================

CREATE TABLE Guests (
    GuestID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Email TEXT,
    Phone TEXT,
    AlternatePhone TEXT,
    Nationality TEXT,
    DateOfBirth DATE,
    Gender TEXT,
    Address TEXT,
    City TEXT,
    Country TEXT,
    PostalCode TEXT,
    VIPStatus TEXT DEFAULT 'Regular' CHECK(VIPStatus IN ('Regular', 'Silver', 'Gold', 'Platinum', 'Blacklist')),
    BlacklistReason TEXT,
    MarketingConsent BOOLEAN DEFAULT 0,
    Notes TEXT,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Guest Notes
CREATE TABLE GuestNotes (
    NoteID INTEGER PRIMARY KEY AUTOINCREMENT,
    GuestID INTEGER NOT NULL,
    NoteType TEXT DEFAULT 'General' CHECK(NoteType IN ('General', 'Preference', 'Complaint', 'Compliment', 'Internal')),
    NoteContent TEXT NOT NULL,
    CreatedBy INTEGER,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (GuestID) REFERENCES Guests(GuestID)
);

-- Guest Preferences
CREATE TABLE GuestPreferences (
    PreferenceID INTEGER PRIMARY KEY AUTOINCREMENT,
    GuestID INTEGER NOT NULL,
    PreferenceType TEXT NOT NULL,
    PreferenceValue TEXT,
    Notes TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (GuestID) REFERENCES Guests(GuestID)
);

-- Guest Loyalty
CREATE TABLE GuestLoyalty (
    LoyaltyID INTEGER PRIMARY KEY AUTOINCREMENT,
    GuestID INTEGER NOT NULL UNIQUE,
    PointsBalance INTEGER DEFAULT 0,
    LifetimePoints INTEGER DEFAULT 0,
    TierLevel TEXT DEFAULT 'Bronze' CHECK(TierLevel IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond')),
    PointsExpiring INTEGER DEFAULT 0,
    ExpiryDate DATE,
    EnrollmentDate DATE DEFAULT (DATE('now')),
    LastActivityDate DATE,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (GuestID) REFERENCES Guests(GuestID)
);

-- Guest Documents
CREATE TABLE GuestDocuments (
    DocumentID INTEGER PRIMARY KEY AUTOINCREMENT,
    GuestID INTEGER NOT NULL,
    DocumentType TEXT NOT NULL,
    DocumentNumber TEXT,
    ImageURL TEXT,
    IssueDate DATE,
    ExpiryDate DATE,
    IsVerified BOOLEAN DEFAULT 0,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (GuestID) REFERENCES Guests(GuestID)
);

CREATE TABLE Reservations (
    ReservationID INTEGER PRIMARY KEY AUTOINCREMENT,
    GuestID INTEGER NOT NULL,
    BranchID INTEGER NOT NULL,
    ReservationCode TEXT UNIQUE,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'No Show')),
    BookingSource TEXT NOT NULL CHECK(BookingSource IN ('Website', 'Booking.com', 'Expedia', 'Direct', 'Phone', 'Walk-in', 'Corporate')),
    Adults INTEGER DEFAULT 1,
    Children INTEGER DEFAULT 0,
    SpecialRequests TEXT,
    TotalAmount DECIMAL(10,2) NOT NULL,
    DepositAmount DECIMAL(10,2) DEFAULT 0,
    DepositPaid BOOLEAN DEFAULT 0,
    AssignedRoomID INTEGER,
    ConfirmationDate DATETIME,
    CancelledDate DATETIME,
    CancelledBy INTEGER,
    CancellationReason TEXT,
    CreatedBy INTEGER,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (GuestID) REFERENCES Guests(GuestID),
    FOREIGN KEY (BranchID) REFERENCES HotelBranches(BranchID),
    FOREIGN KEY (AssignedRoomID) REFERENCES Rooms(RoomID)
);

CREATE TABLE ReservationRooms (
    ReservationRoomID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER NOT NULL,
    RoomID INTEGER NOT NULL,
    RoomTypeID INTEGER NOT NULL,
    Rate DECIMAL(10,2) NOT NULL,
    Adults INTEGER DEFAULT 1,
    Children INTEGER DEFAULT 0,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID),
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID),
    FOREIGN KEY (RoomTypeID) REFERENCES RoomTypes(RoomTypeID)
);

CREATE TABLE ReservationGuests (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER NOT NULL,
    GuestID INTEGER NOT NULL,
    IsPrimary BOOLEAN DEFAULT 0,
    RelationType TEXT DEFAULT 'Self',
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID),
    FOREIGN KEY (GuestID) REFERENCES Guests(GuestID),
    UNIQUE(ReservationID, GuestID)
);

CREATE TABLE ReservationNotes (
    NoteID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER NOT NULL,
    NoteText TEXT NOT NULL,
    NoteType TEXT DEFAULT 'General' CHECK(NoteType IN ('General', 'Special Request', 'Complaint', 'Compliment', 'Internal')),
    CreatedBy INTEGER,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID)
);

CREATE TABLE ReservationHistory (
    HistoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER NOT NULL,
    Action TEXT NOT NULL,
    PreviousStatus TEXT,
    NewStatus TEXT,
    Notes TEXT,
    ActionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PerformedBy INTEGER,
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID)
);

-- ============================================================
-- 5. CHECK-IN / CHECK-OUT
-- ============================================================

CREATE TABLE CheckIns (
    CheckInID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER NOT NULL,
    RoomID INTEGER NOT NULL,
    CheckInDate DATETIME NOT NULL,
    CheckInTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    AssignedRoom TEXT NOT NULL,
    KeyCardNumber TEXT,
    CheckInMethod TEXT DEFAULT 'Standard',
    VerifiedBy INTEGER,
    Notes TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID),
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

CREATE TABLE CheckOuts (
    CheckOutID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER NOT NULL,
    RoomID INTEGER NOT NULL,
    CheckOutDate DATETIME NOT NULL,
    CheckOutTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    TotalBill DECIMAL(10,2) NOT NULL,
    PaymentStatus TEXT DEFAULT 'Pending',
    KeyCardReturned BOOLEAN DEFAULT 1,
    RoomInspected BOOLEAN DEFAULT 0,
    InspectionNotes TEXT,
    CheckOutMethod TEXT DEFAULT 'Standard',
    VerifiedBy INTEGER,
    Notes TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID),
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

-- Key Cards Management
CREATE TABLE KeyCards (
    KeyCardID INTEGER PRIMARY KEY AUTOINCREMENT,
    CardNumber TEXT NOT NULL UNIQUE,
    RoomID INTEGER NOT NULL,
    GuestName TEXT,
    ReservationID INTEGER,
    Status TEXT DEFAULT 'Active' CHECK(Status IN ('Active', 'Inactive', 'Lost', 'Returned')),
    IssueDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ExpiryDate DATETIME,
    ReturnDate DATETIME,
    CreatedBy INTEGER,
    Notes TEXT,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID),
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID)
);

-- ============================================================
-- 6. BILLING & PAYMENTS
-- ============================================================

CREATE TABLE Invoices (
    InvoiceID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER,
    InvoiceNumber TEXT UNIQUE,
    InvoiceDate DATE NOT NULL,
    DueDate DATE,
    SubTotal DECIMAL(10,2) NOT NULL,
    TaxAmount DECIMAL(10,2) DEFAULT 0,
    DiscountAmount DECIMAL(10,2) DEFAULT 0,
    TotalAmount DECIMAL(10,2) NOT NULL,
    AmountPaid DECIMAL(10,2) DEFAULT 0,
    BalanceDue DECIMAL(10,2) DEFAULT 0,
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'Partial', 'Paid', 'Overdue', 'Cancelled', 'Refunded')),
    Notes TEXT,
    CreatedBy INTEGER,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID)
);

CREATE TABLE InvoiceItems (
    ItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    InvoiceID INTEGER NOT NULL,
    ItemType TEXT NOT NULL CHECK(ItemType IN ('Room', 'Service', 'Food', 'Beverage', 'Tax', 'Discount', 'Other')),
    Description TEXT NOT NULL,
    Quantity INTEGER DEFAULT 1,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    TaxRate DECIMAL(5,2) DEFAULT 0,
    ReferenceID TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (InvoiceID) REFERENCES Invoices(InvoiceID)
);

CREATE TABLE Payments (
    PaymentID INTEGER PRIMARY KEY AUTOINCREMENT,
    InvoiceID INTEGER,
    ReservationID INTEGER,
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PaymentMethod TEXT NOT NULL CHECK(PaymentMethod IN ('Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Cheque', 'Mobile Payment', 'Gift Card')),
    Amount DECIMAL(10,2) NOT NULL,
    Currency TEXT DEFAULT 'USD',
    ExchangeRate DECIMAL(10,4) DEFAULT 1,
    ReferenceNumber TEXT,
    TransactionID TEXT,
    CardLast4 TEXT,
    CardType TEXT,
    Status TEXT DEFAULT 'Completed' CHECK(Status IN ('Pending', 'Completed', 'Failed', 'Refunded', 'Partially Refunded')),
    Notes TEXT,
    ReceivedBy INTEGER,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (InvoiceID) REFERENCES Invoices(InvoiceID),
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID)
);

CREATE TABLE PaymentMethods (
    MethodID INTEGER PRIMARY KEY AUTOINCREMENT,
    MethodName TEXT NOT NULL UNIQUE,
    MethodType TEXT,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Refunds (
    RefundID INTEGER PRIMARY KEY AUTOINCREMENT,
    PaymentID INTEGER NOT NULL,
    RefundAmount DECIMAL(10,2) NOT NULL,
    RefundDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    RefundMethod TEXT,
    Reason TEXT,
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'Approved', 'Rejected', 'Processed')),
    ProcessedBy INTEGER,
    Notes TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PaymentID) REFERENCES Payments(PaymentID)
);

-- ============================================================
-- 7. SERVICES & POS
-- ============================================================

CREATE TABLE Services (
    ServiceID INTEGER PRIMARY KEY AUTOINCREMENT,
    ServiceName TEXT NOT NULL,
    CategoryID INTEGER,
    Description TEXT,
    Price DECIMAL(10,2) NOT NULL,
    PriceType TEXT DEFAULT 'Fixed' CHECK(PriceType IN ('Fixed', 'Per Person', 'Per Hour', 'Per Unit')),
    IsAvailable BOOLEAN DEFAULT 1,
    ImageURL TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryID) REFERENCES ServiceCategories(CategoryID)
);

CREATE TABLE ServiceCategories (
    CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    CategoryName TEXT NOT NULL UNIQUE,
    Description TEXT,
    SortOrder INTEGER DEFAULT 0,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ServiceOrders (
    OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER,
    RoomID INTEGER,
    OrderType TEXT NOT NULL CHECK(OrderType IN ('Restaurant', 'Room Service', 'Bar', 'Spa', 'Transport')),
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled')),
    SubTotal DECIMAL(10,2) NOT NULL,
    TaxAmount DECIMAL(10,2) DEFAULT 0,
    TotalAmount DECIMAL(10,2) NOT NULL,
    StaffID INTEGER,
    DeliveryRoom TEXT,
    TableNumber TEXT,
    NumberOfGuests INTEGER,
    Notes TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID),
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

CREATE TABLE ServiceOrderItems (
    OrderItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    OrderID INTEGER NOT NULL,
    ServiceID INTEGER NOT NULL,
    Quantity INTEGER NOT NULL DEFAULT 1,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Notes TEXT,
    Status TEXT DEFAULT 'Pending',
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES ServiceOrders(OrderID),
    FOREIGN KEY (ServiceID) REFERENCES Services(ServiceID)
);

-- ============================================================
-- 8. HOUSEKEEPING
-- ============================================================

CREATE TABLE HousekeepingTasks (
    TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomID INTEGER NOT NULL,
    TaskType TEXT NOT NULL CHECK(TaskType IN ('Standard Clean', 'Deep Clean', 'Turnover', 'Inspection', 'Special Request')),
    AssignedStaffID INTEGER,
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'In Progress', 'Completed', 'Verified', 'Cancelled')),
    Priority TEXT DEFAULT 'Normal' CHECK(Priority IN ('Low', 'Normal', 'High', 'Urgent')),
    ScheduledDate DATE NOT NULL,
    ScheduledTime TEXT,
    StartTime DATETIME,
    EndTime DATETIME,
    Notes TEXT,
    CreatedBy INTEGER,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

CREATE TABLE HousekeepingStatus (
    StatusID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomID INTEGER NOT NULL,
    CleaningStatus TEXT NOT NULL CHECK(CleaningStatus IN ('Clean', 'Dirty', 'Cleaning', 'Inspected', 'Out of Order')),
    LastCleaned DATETIME,
    NextScheduledClean DATE,
    UpdatedBy INTEGER,
    UpdatedTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    Notes TEXT,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

CREATE TABLE CleaningLogs (
    LogID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomID INTEGER NOT NULL,
    StaffID INTEGER NOT NULL,
    TaskID INTEGER,
    CleaningType TEXT,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME,
    Status TEXT DEFAULT 'Completed',
    SuppliesUsed TEXT,
    Notes TEXT,
    Rating INTEGER,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID),
    FOREIGN KEY (StaffID) REFERENCES Employees(EmployeeID)
);

-- ============================================================
-- 9. MAINTENANCE
-- ============================================================

CREATE TABLE MaintenanceRequests (
    RequestID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomID INTEGER NOT NULL,
    RequestType TEXT NOT NULL CHECK(RequestType IN ('Plumbing', 'Electrical', 'Furniture', 'HVAC', 'Appliance', 'Structural', 'Other')),
    Priority TEXT DEFAULT 'Normal' CHECK(Priority IN ('Low', 'Normal', 'High', 'Emergency')),
    Description TEXT NOT NULL,
    ReportedBy INTEGER,
    ReportedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status TEXT DEFAULT 'Open' CHECK(Status IN ('Open', 'In Progress', 'Completed', 'Closed', 'Cancelled')),
    ScheduledDate DATE,
    EstimatedCost DECIMAL(10,2),
    ActualCost DECIMAL(10,2),
    Notes TEXT,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

CREATE TABLE MaintenanceTasks (
    TaskID INTEGER PRIMARY KEY AUTOINCREMENT,
    RequestID INTEGER NOT NULL,
    AssignedStaffID INTEGER,
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'In Progress', 'Completed', 'Verified', 'Cancelled')),
    StartDate DATETIME,
    CompletionDate DATETIME,
    Notes TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RequestID) REFERENCES MaintenanceRequests(RequestID)
);

CREATE TABLE MaintenanceHistory (
    HistoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    RequestID INTEGER NOT NULL,
    TaskID INTEGER,
    UpdateDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status TEXT NOT NULL,
    Notes TEXT,
    UpdatedBy INTEGER,
    FOREIGN KEY (RequestID) REFERENCES MaintenanceRequests(RequestID)
);

-- ============================================================
-- 10. STAFF & HR
-- ============================================================

CREATE TABLE Employees (
    EmployeeID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Email TEXT UNIQUE,
    Phone TEXT,
    PhotoURL TEXT,
    Position TEXT NOT NULL,
    DepartmentID INTEGER,
    HireDate DATE NOT NULL,
    EmploymentStatus TEXT DEFAULT 'Active' CHECK(EmploymentStatus IN ('Active', 'On Leave', 'Terminated', 'Resigned')),
    Salary DECIMAL(10,2),
    EmergencyContactName TEXT,
    EmergencyContactPhone TEXT,
    DateOfBirth DATE,
    Gender TEXT,
    Address TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

CREATE TABLE Departments (
    DepartmentID INTEGER PRIMARY KEY AUTOINCREMENT,
    DepartmentName TEXT NOT NULL UNIQUE,
    Description TEXT,
    ManagerID INTEGER,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EmployeeDepartments (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeID INTEGER NOT NULL,
    DepartmentID INTEGER NOT NULL,
    IsPrimary BOOLEAN DEFAULT 1,
    StartDate DATE DEFAULT CURRENT_DATE,
    EndDate DATE,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID),
    UNIQUE(EmployeeID, DepartmentID, IsPrimary)
);

CREATE TABLE EmployeeSchedules (
    ScheduleID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeID INTEGER NOT NULL,
    ShiftDate DATE NOT NULL,
    ShiftType TEXT NOT NULL CHECK(ShiftType IN ('Morning', 'Afternoon', 'Night', 'Split', 'On-Call')),
    StartTime TEXT NOT NULL,
    EndTime TEXT NOT NULL,
    BreakDuration INTEGER DEFAULT 60,
    Status TEXT DEFAULT 'Scheduled' CHECK(Status IN ('Scheduled', 'Completed', 'Absent', 'Cancelled')),
    Notes TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
    UNIQUE(EmployeeID, ShiftDate, ShiftType)
);

CREATE TABLE Attendance (
    AttendanceID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeID INTEGER NOT NULL,
    AttendanceDate DATE NOT NULL,
    CheckIn DATETIME,
    CheckOut DATETIME,
    WorkHours DECIMAL(5,2) DEFAULT 0,
    OvertimeHours DECIMAL(5,2) DEFAULT 0,
    Status TEXT DEFAULT 'Present' CHECK(Status IN ('Present', 'Absent', 'Late', 'Leave', 'Holiday')),
    LateMinutes INTEGER DEFAULT 0,
    Notes TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
    UNIQUE(EmployeeID, AttendanceDate)
);

-- ============================================================
-- 11. INVENTORY MANAGEMENT
-- ============================================================

CREATE TABLE InventoryItems (
    ItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    ItemName TEXT NOT NULL,
    SKU TEXT UNIQUE,
    CategoryID INTEGER,
    Description TEXT,
    UnitOfMeasure TEXT DEFAULT 'pcs',
    CurrentStock INTEGER DEFAULT 0,
    MinimumStock INTEGER DEFAULT 0,
    MaximumStock INTEGER DEFAULT 0,
    ReorderPoint INTEGER DEFAULT 0,
    UnitCost DECIMAL(10,2),
    UnitPrice DECIMAL(10,2),
    Location TEXT,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryID) REFERENCES InventoryCategories(CategoryID)
);

CREATE TABLE InventoryCategories (
    CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    CategoryName TEXT NOT NULL UNIQUE,
    Description TEXT,
    ParentCategoryID INTEGER,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ParentCategoryID) REFERENCES InventoryCategories(CategoryID)
);

CREATE TABLE InventoryTransactions (
    TransactionID INTEGER PRIMARY KEY AUTOINCREMENT,
    ItemID INTEGER NOT NULL,
    TransactionType TEXT NOT NULL CHECK(TransactionType IN ('Purchase', 'Sale', 'Adjustment', 'Transfer', 'Return', 'Damaged', 'Expired')),
    Quantity INTEGER NOT NULL,
    PreviousStock INTEGER NOT NULL,
    NewStock INTEGER NOT NULL,
    ReferenceID TEXT,
    ReferenceType TEXT,
    TransactionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Notes TEXT,
    PerformedBy INTEGER,
    FOREIGN KEY (ItemID) REFERENCES InventoryItems(ItemID)
);

CREATE TABLE Suppliers (
    SupplierID INTEGER PRIMARY KEY AUTOINCREMENT,
    SupplierName TEXT NOT NULL,
    ContactPerson TEXT,
    Email TEXT,
    Phone TEXT,
    Address TEXT,
    City TEXT,
    Country TEXT,
    TaxID TEXT,
    PaymentTerms TEXT,
    Notes TEXT,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PurchaseOrders (
    PurchaseID INTEGER PRIMARY KEY AUTOINCREMENT,
    SupplierID INTEGER NOT NULL,
    OrderDate DATE NOT NULL,
    ExpectedDeliveryDate DATE,
    ReceivedDate DATE,
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'Approved', 'Ordered', 'Received', 'Cancelled')),
    TotalAmount DECIMAL(10,2) DEFAULT 0,
    Notes TEXT,
    CreatedBy INTEGER,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

CREATE TABLE PurchaseOrderItems (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    PurchaseID INTEGER NOT NULL,
    ItemID INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    ReceivedQuantity INTEGER DEFAULT 0,
    Amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (PurchaseID) REFERENCES PurchaseOrders(PurchaseID),
    FOREIGN KEY (ItemID) REFERENCES InventoryItems(ItemID)
);

-- ============================================================
-- 12. REPORTING & ANALYTICS
-- ============================================================

CREATE TABLE DailyReports (
    ReportID INTEGER PRIMARY KEY AUTOINCREMENT,
    BranchID INTEGER NOT NULL,
    ReportDate DATE NOT NULL,
    TotalRevenue DECIMAL(10,2) DEFAULT 0,
    RoomRevenue DECIMAL(10,2) DEFAULT 0,
    FBRevenue DECIMAL(10,2) DEFAULT 0,
    OtherRevenue DECIMAL(10,2) DEFAULT 0,
    TotalRooms INTEGER DEFAULT 0,
    OccupiedRooms INTEGER DEFAULT 0,
    AvailableRooms INTEGER DEFAULT 0,
    CheckIns INTEGER DEFAULT 0,
    CheckOuts INTEGER DEFAULT 0,
    NoShows INTEGER DEFAULT 0,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BranchID) REFERENCES HotelBranches(BranchID),
    UNIQUE(BranchID, ReportDate)
);

CREATE TABLE OccupancyReports (
    ReportID INTEGER PRIMARY KEY AUTOINCREMENT,
    BranchID INTEGER NOT NULL,
    ReportDate DATE NOT NULL,
    OccupancyRate DECIMAL(5,2) DEFAULT 0,
    RoomTypeOccupancy TEXT,
    AverageDailyRate DECIMAL(10,2) DEFAULT 0,
    RevPAR DECIMAL(10,2) DEFAULT 0,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BranchID) REFERENCES HotelBranches(BranchID),
    UNIQUE(BranchID, ReportDate)
);

CREATE TABLE RevenueReports (
    ReportID INTEGER PRIMARY KEY AUTOINCREMENT,
    BranchID INTEGER NOT NULL,
    ReportDate DATE NOT NULL,
    RoomRevenue DECIMAL(10,2) DEFAULT 0,
    ServiceRevenue DECIMAL(10,2) DEFAULT 0,
    FBRevenue DECIMAL(10,2) DEFAULT 0,
    OtherRevenue DECIMAL(10,2) DEFAULT 0,
    TotalRevenue DECIMAL(10,2) DEFAULT 0,
    TotalTax DECIMAL(10,2) DEFAULT 0,
    TotalDiscount DECIMAL(10,2) DEFAULT 0,
    NetRevenue DECIMAL(10,2) DEFAULT 0,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BranchID) REFERENCES HotelBranches(BranchID),
    UNIQUE(BranchID, ReportDate)
);

-- ============================================================
-- 13. SECURITY & SYSTEM
-- ============================================================

CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeID INTEGER,
    GuestID INTEGER,
    Username TEXT UNIQUE NOT NULL,
    PasswordHash TEXT NOT NULL,
    RoleID INTEGER NOT NULL,
    IsActive BOOLEAN DEFAULT 1,
    LastLogin DATETIME,
    FailedLoginAttempts INTEGER DEFAULT 0,
    LockedUntil DATETIME,
    MustChangePassword BOOLEAN DEFAULT 0,
    PasswordChangedDate DATETIME,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
    FOREIGN KEY (GuestID) REFERENCES Guests(GuestID),
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

CREATE TABLE Roles (
    RoleID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoleName TEXT NOT NULL UNIQUE,
    RoleDescription TEXT,
    IsSystemRole BOOLEAN DEFAULT 0,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Permissions (
    PermissionID INTEGER PRIMARY KEY AUTOINCREMENT,
    PermissionName TEXT NOT NULL UNIQUE,
    PermissionCode TEXT NOT NULL UNIQUE,
    Module TEXT NOT NULL,
    Description TEXT,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RolePermissions (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoleID INTEGER NOT NULL,
    PermissionID INTEGER NOT NULL,
    IsGranted BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID),
    FOREIGN KEY (PermissionID) REFERENCES Permissions(PermissionID),
    UNIQUE(RoleID, PermissionID)
);

CREATE TABLE ActivityLogs (
    LogID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER,
    Action TEXT NOT NULL,
    Module TEXT,
    EntityType TEXT,
    EntityID TEXT,
    OldValue TEXT,
    NewValue TEXT,
    IPAddress TEXT,
    UserAgent TEXT,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ============================================================
-- 14. SETTINGS & CONFIGURATION
-- ============================================================

CREATE TABLE TaxRates (
    TaxRateID INTEGER PRIMARY KEY AUTOINCREMENT,
    TaxName TEXT NOT NULL,
    TaxCode TEXT,
    Rate DECIMAL(5,2) NOT NULL,
    TaxType TEXT DEFAULT 'Percentage' CHECK(TaxType IN ('Percentage', 'Fixed')),
    Country TEXT,
    IsActive BOOLEAN DEFAULT 1,
    IsDefault BOOLEAN DEFAULT 0,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Currencies (
    CurrencyID INTEGER PRIMARY KEY AUTOINCREMENT,
    CurrencyCode TEXT NOT NULL UNIQUE,
    CurrencyName TEXT NOT NULL,
    Symbol TEXT,
    ExchangeRate DECIMAL(10,4) DEFAULT 1,
    IsDefault BOOLEAN DEFAULT 0,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Languages (
    LanguageID INTEGER PRIMARY KEY AUTOINCREMENT,
    LanguageCode TEXT NOT NULL UNIQUE,
    LanguageName TEXT NOT NULL,
    NativeName TEXT,
    IsDefault BOOLEAN DEFAULT 0,
    IsActive BOOLEAN DEFAULT 1,
    SortOrder INTEGER DEFAULT 0,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PaymentGateways (
    GatewayID INTEGER PRIMARY KEY AUTOINCREMENT,
    GatewayName TEXT NOT NULL,
    GatewayType TEXT,
    ConfigJSON TEXT,
    IsActive BOOLEAN DEFAULT 0,
    IsTestMode BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 15. NOTIFICATIONS
-- ============================================================

CREATE TABLE Notifications (
    NotificationID INTEGER PRIMARY KEY AUTOINCREMENT,
    GuestID INTEGER,
    ReservationID INTEGER,
    Type TEXT NOT NULL CHECK(Type IN ('Email', 'SMS', 'Push', 'In-App')),
    Channel TEXT NOT NULL,
    Subject TEXT,
    Body TEXT NOT NULL,
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'Sent', 'Delivered', 'Failed', 'Cancelled')),
    SentDate DATETIME,
    ScheduledDate DATETIME,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (GuestID) REFERENCES Guests(GuestID),
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID)
);

CREATE TABLE EmailTemplates (
    TemplateID INTEGER PRIMARY KEY AUTOINCREMENT,
    TemplateName TEXT NOT NULL UNIQUE,
    TemplateType TEXT NOT NULL CHECK(TemplateType IN ('Reservation', 'Confirmation', 'CheckIn', 'CheckOut', 'Invoice', 'Payment', 'Marketing', 'System')),
    Subject TEXT NOT NULL,
    Body TEXT NOT NULL,
    Variables TEXT,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE SMSTemplates (
    TemplateID INTEGER PRIMARY KEY AUTOINCREMENT,
    TemplateName TEXT NOT NULL UNIQUE,
    TemplateType TEXT,
    Body TEXT NOT NULL,
    Variables TEXT,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 16. BOOKING SOURCES
-- ============================================================

CREATE TABLE BookingSources (
    SourceID INTEGER PRIMARY KEY AUTOINCREMENT,
    SourceName TEXT NOT NULL UNIQUE,
    SourceType TEXT CHECK(SourceType IN ('Direct', 'OTA', 'Corporate', 'Travel Agent', 'Wholesale')),
    CommissionRate DECIMAL(5,2) DEFAULT 0,
    IsActive BOOLEAN DEFAULT 1,
    ContactInfo TEXT,
    Notes TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 17. ADDITIONAL TABLES FOR PMS
-- ============================================================

-- Room images/gallery
CREATE TABLE RoomGalleries (
    GalleryID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomTypeID INTEGER NOT NULL,
    ImageURL TEXT NOT NULL,
    Caption TEXT,
    IsPrimary BOOLEAN DEFAULT 0,
    SortOrder INTEGER DEFAULT 0,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoomTypeID) REFERENCES RoomTypes(RoomTypeID)
);

-- Wake-up calls
CREATE TABLE WakeUpCalls (
    CallID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER,
    RoomID INTEGER NOT NULL,
    WakeUpTime DATETIME NOT NULL,
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'Completed', 'Cancelled')),
    Notes TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID),
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

-- Guest messages/requests
CREATE TABLE GuestRequests (
    RequestID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER,
    RoomID INTEGER NOT NULL,
    RequestType TEXT NOT NULL CHECK(RequestType IN ('Room Service', 'Housekeeping', 'Maintenance', 'Information', 'Taxi', 'Wake-up', 'Other')),
    Description TEXT NOT NULL,
    Priority TEXT DEFAULT 'Normal' CHECK(Priority IN ('Low', 'Normal', 'High', 'Urgent')),
    Status TEXT DEFAULT 'Pending' CHECK(Status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
    AssignedTo INTEGER,
    ResponseText TEXT,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    CompletedDate DATETIME,
    FOREIGN KEY (ReservationID) REFERENCES Reservations(ReservationID),
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

-- Rate plans
CREATE TABLE RatePlans (
    RatePlanID INTEGER PRIMARY KEY AUTOINCREMENT,
    RatePlanName TEXT NOT NULL,
    RoomTypeID INTEGER NOT NULL,
    BaseRate DECIMAL(10,2) NOT NULL,
    MealPlan TEXT,
    CancellationPolicy TEXT,
    PayAtProperty BOOLEAN DEFAULT 1,
    PrepaymentRequired BOOLEAN DEFAULT 0,
    IsActive BOOLEAN DEFAULT 1,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoomTypeID) REFERENCES RoomTypes(RoomTypeID)
);

-- ============================================================
-- SEED DATA (Initial Setup)
-- ============================================================

-- Insert default payment methods
INSERT INTO PaymentMethods (MethodName, MethodType) VALUES 
    ('Cash', 'Cash'),
    ('Credit Card', 'Card'),
    ('Debit Card', 'Card'),
    ('Bank Transfer', 'Transfer'),
    ('Cheque', 'Cheque'),
    ('Mobile Payment', 'Digital');

-- Insert default roles
INSERT INTO Roles (RoleName, RoleDescription, IsSystemRole) VALUES 
    ('Super Admin', 'Full system access', 1),
    ('Admin', 'Administrative access', 1),
    ('Manager', 'Management access', 1),
    ('Front Desk', 'Front desk operations', 1),
    ('Housekeeping', 'Housekeeping access', 1),
    ('Maintenance', 'Maintenance access', 1),
    ('Staff', 'General staff access', 1);

-- Insert default permissions
INSERT INTO Permissions (PermissionName, PermissionCode, Module) VALUES 
    ('View Dashboard', 'dashboard.view', 'Dashboard'),
    ('Manage Reservations', 'reservations.manage', 'Reservations'),
    ('View Reservations', 'reservations.view', 'Reservations'),
    ('Manage Guests', 'guests.manage', 'Guests'),
    ('View Guests', 'guests.view', 'Guests'),
    ('Manage Rooms', 'rooms.manage', 'Rooms'),
    ('View Rooms', 'rooms.view', 'Rooms'),
    ('Manage Check-in', 'checkin.manage', 'Check-in'),
    ('Manage Check-out', 'checkout.manage', 'Check-out'),
    ('Manage Billing', 'billing.manage', 'Billing'),
    ('View Billing', 'billing.view', 'Billing'),
    ('Manage Payments', 'payments.manage', 'Payments'),
    ('Manage Housekeeping', 'housekeeping.manage', 'Housekeeping'),
    ('Manage Maintenance', 'maintenance.manage', 'Maintenance'),
    ('Manage Staff', 'staff.manage', 'Staff'),
    ('Manage Inventory', 'inventory.manage', 'Inventory'),
    ('Manage Reports', 'reports.manage', 'Reports'),
    ('Manage Settings', 'settings.manage', 'Settings'),
    ('Manage Users', 'users.manage', 'Security'),
    ('Manage Roles', 'roles.manage', 'Security');

-- Insert default currencies
INSERT INTO Currencies (CurrencyCode, CurrencyName, Symbol, IsDefault) VALUES 
    ('USD', 'US Dollar', '$', 1),
    ('EUR', 'Euro', '€', 0),
    ('GBP', 'British Pound', '£', 0),
    ('THB', 'Thai Baht', '฿', 0);

-- Insert default languages
INSERT INTO Languages (LanguageCode, LanguageName, NativeName, IsDefault) VALUES 
    ('en', 'English', 'English', 1),
    ('es', 'Spanish', 'Español', 0),
    ('fr', 'French', 'Français', 0),
    ('zh', 'Chinese', '中文', 0);

-- Insert default booking sources
INSERT INTO BookingSources (SourceName, SourceType) VALUES 
    ('Direct', 'Direct'),
    ('Website', 'Direct'),
    ('Booking.com', 'OTA'),
    ('Expedia', 'OTA'),
    ('Agoda', 'OTA'),
    ('Phone', 'Direct'),
    ('Walk-in', 'Direct'),
    ('Corporate', 'Corporate');

-- Insert default departments
INSERT INTO Departments (DepartmentName) VALUES 
    ('Front Office'),
    ('Housekeeping'),
    ('Food & Beverage'),
    ('Maintenance'),
    ('Finance'),
    ('Human Resources'),
    ('Sales & Marketing'),
    ('IT'),
    ('Security');

-- Insert default room amenities
INSERT INTO RoomAmenities (AmenityName, AmenityType, Icon) VALUES 
    ('WiFi', 'Technology', 'wifi'),
    ('TV', 'Technology', 'tv'),
    ('Mini Bar', 'Room', 'wine'),
    ('Air Conditioning', 'Climate', 'wind'),
    ('Safe', 'Security', 'lock'),
    ('Telephone', 'Communication', 'phone'),
    ('Balcony', 'Room', 'sunset'),
    ('Ocean View', 'View', 'waves'),
    ('City View', 'View', 'building'),
    ('Kitchenette', 'Kitchen', 'utensils'),
    ('Jacuzzi', 'Bathroom', 'bath'),
    ('Private Pool', 'Pool', 'swimming'),
    ('Butler Service', 'Service', 'user-check'),
    ('Room Service', 'Service', 'bell'),
    ('Spa Access', 'Wellness', 'sparkles'),
    ('Gym Access', 'Wellness', 'dumbbell'),
    ('Breakfast Included', 'Dining', 'coffee');

-- Insert default hotel
INSERT INTO Hotels (HotelName, Address, City, Country, Phone, Email) VALUES 
    ('GrandView Hotel', '123 Main Street', 'Bangkok', 'Thailand', '+66 2 123 4567', 'info@grandview.com');

-- Insert default branch
INSERT INTO HotelBranches (HotelID, BranchName, Address, Phone) VALUES 
    (1, 'Main Branch', '123 Main Street, Bangkok', '+66 2 123 4567');

-- Insert floors
INSERT INTO Floors (BranchID, FloorNumber, FloorName) VALUES 
    (1, 1, 'First Floor'),
    (1, 2, 'Second Floor'),
    (1, 3, 'Third Floor'),
    (1, 4, 'Fourth Floor'),
    (1, 5, 'Fifth Floor');

-- Insert room types
INSERT INTO RoomTypes (TypeName, Description, Capacity, BasePrice, MaxOccupancy, BedType, SizeSqFt) VALUES 
    ('Standard', 'Comfortable room with essential amenities', 2, 150, 2, 'Queen', 300),
    ('Deluxe', 'Spacious room with premium amenities', 2, 280, 3, 'King', 450),
    ('Suite', 'Luxurious suite with living area', 3, 550, 4, 'King', 750),
    ('Penthouse', 'Top floor luxury with exclusive features', 4, 1200, 6, 'King', 1500);

-- Insert rooms
INSERT INTO Rooms (BranchID, RoomNumber, RoomTypeID, FloorID, Status) VALUES 
    (1, '101', 1, 1, 'Available'),
    (1, '102', 1, 1, 'Occupied'),
    (1, '103', 1, 1, 'Available'),
    (1, '104', 1, 1, 'Dirty'),
    (1, '105', 2, 1, 'Occupied'),
    (1, '201', 1, 2, 'Available'),
    (1, '202', 1, 2, 'Dirty'),
    (1, '203', 2, 2, 'Available'),
    (1, '204', 2, 2, 'Maintenance'),
    (1, '301', 3, 3, 'Available'),
    (1, '302', 3, 3, 'Reserved'),
    (1, '401', 3, 4, 'Occupied'),
    (1, '402', 3, 4, 'Occupied'),
    (1, '501', 4, 5, 'Available'),
    (1, '502', 4, 5, 'Available');

-- Insert default admin user (password: admin123)
INSERT INTO Employees (FirstName, LastName, Email, Phone, Position, DepartmentID, HireDate) VALUES 
    ('System', 'Administrator', 'admin@grandview.com', '+66 2 123 4567', 'System Administrator', 8, '2024-01-01');

INSERT INTO Users (EmployeeID, Username, PasswordHash, RoleID) VALUES 
    (1, 'admin', '$2a$10$8K1p/a0dL3.HKwHkqhIW4u1F96.GTYvLwZBJaj8j7P/Aj7qC5e3m', 1);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_reservations_guest ON Reservations(GuestID);
CREATE INDEX idx_reservations_dates ON Reservations(CheckInDate, CheckOutDate);
CREATE INDEX idx_reservations_status ON Reservations(Status);
CREATE INDEX idx_rooms_status ON Rooms(Status);
CREATE INDEX idx_rooms_floor ON Rooms(FloorID);
CREATE INDEX idx_payments_invoice ON Payments(InvoiceID);
CREATE INDEX idx_activity_logs_user ON ActivityLogs(UserID);
CREATE INDEX idx_activity_logs_timestamp ON ActivityLogs(Timestamp);
CREATE INDEX idx_inventory_items_category ON InventoryItems(CategoryID);

-- ============================================================
-- VIEW: Current Room Status
-- ============================================================

CREATE VIEW vw_CurrentRoomStatus AS
SELECT 
    r.RoomID,
    r.RoomNumber,
    rt.TypeName AS RoomType,
    f.FloorNumber,
    r.Status AS RoomStatus,
    r.CleaningStatus,
    res.CheckInDate,
    res.CheckOutDate,
    g.FirstName || ' ' || g.LastName AS CurrentGuest
FROM Rooms r
LEFT JOIN RoomTypes rt ON r.RoomTypeID = rt.RoomTypeID
LEFT JOIN Floors f ON r.FloorID = f.FloorID
LEFT JOIN Reservations res ON r.CurrentReservationID = res.ReservationID AND res.Status = 'Checked In'
LEFT JOIN Guests g ON res.GuestID = g.GuestID;

-- ============================================================
-- VIEW: Reservation Summary
-- ============================================================

CREATE VIEW vw_ReservationSummary AS
SELECT 
    res.ReservationID,
    res.ReservationCode,
    g.FirstName || ' ' || g.LastName AS GuestName,
    g.Email,
    g.Phone,
    res.CheckInDate,
    res.CheckOutDate,
    res.Status,
    res.BookingSource,
    res.TotalAmount,
    res.Adults + res.Children AS TotalGuests,
    rt.TypeName AS RoomType
FROM Reservations res
LEFT JOIN Guests g ON res.GuestID = g.GuestID
LEFT JOIN RoomTypes rt ON res.AssignedRoomID = rt.RoomTypeID;

-- ============================================================
-- VIEW: Daily Revenue Summary
-- ============================================================

CREATE VIEW vw_DailyRevenue AS
SELECT 
    DATE(p.PaymentDate) AS Date,
    COUNT(DISTINCT p.PaymentID) AS TransactionCount,
    SUM(p.Amount) AS TotalRevenue,
    COUNT(DISTINCT p.ReservationID) AS ReservationCount
FROM Payments p
WHERE p.Status = 'Completed'
GROUP BY DATE(p.PaymentDate);
