import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/dashboard/DashboardLayout';

import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import TwoFactorPage from './pages/auth/TwoFactorPage';
import AccountLockedPage from './pages/auth/AccountLockedPage';
import SessionTimeoutPage from './pages/auth/SessionTimeoutPage';

import MainDashboard from './pages/dashboard/MainDashboard';
import HotelPerformanceDashboard from './pages/dashboard/HotelPerformanceDashboard';
import RevenueDashboard from './pages/dashboard/RevenueDashboard';
import OccupancyDashboard from './pages/dashboard/OccupancyDashboard';
import TodaysActivityDashboard from './pages/dashboard/TodaysActivityDashboard';
import StaffActivityDashboard from './pages/dashboard/StaffActivityDashboard';
import BookingAnalyticsDashboard from './pages/dashboard/BookingAnalyticsDashboard';

import BookingListPage from './pages/reservations/BookingListPage';
import CreateReservationPage from './pages/reservations/CreateReservationPage';
import ReservationCalendarPage from './pages/reservations/ReservationCalendarPage';
import BookingTimelinePage from './pages/reservations/BookingTimelinePage';
import BookingSourceAnalyticsPage from './pages/reservations/BookingSourceAnalyticsPage';
import ReservationDetailsPage from './pages/reservations/ReservationDetailsPage';

import RoomListPage from './pages/rooms/RoomListPage';
import RoomDetailsPage from './pages/rooms/RoomDetailsPage';
import RoomStatusBoardPage from './pages/rooms/RoomStatusBoardPage';
import RoomMaintenancePage from './pages/rooms/RoomMaintenancePage';
import FloorManagementPage from './pages/rooms/FloorManagementPage';
import CreateRoomPage from './pages/rooms/CreateRoomPage';

import RoomTypeListPage from './pages/rooms/RoomTypeListPage';
import RoomTypePricingPage from './pages/rooms/RoomTypePricingPage';
import RoomTypeGalleryPage from './pages/rooms/RoomTypeGalleryPage';
import CreateRoomTypePage from './pages/rooms/CreateRoomTypePage';

import CheckinDashboardPage from './pages/checkin/CheckinDashboardPage';
import ArrivalsListPage from './pages/checkin/ArrivalsListPage';
import CheckinProcessPage from './pages/checkin/CheckinProcessPage';
import GroupCheckinPage from './pages/checkin/GroupCheckinPage';
import KeyCardManagementPage from './pages/checkin/KeyCardManagementPage';
import WalkinReservationPage from './pages/checkin/WalkinReservationPage';

import CheckoutDashboardPage from './pages/checkout/CheckoutDashboardPage';
import CheckoutProcessPage from './pages/checkout/CheckoutProcessPage';
import DeparturesListPage from './pages/checkout/DeparturesListPage';
import GroupCheckoutPage from './pages/checkout/GroupCheckoutPage';
import ExpressCheckoutPage from './pages/checkout/ExpressCheckoutPage';
import PrintAllInvoicesPage from './pages/checkout/PrintAllInvoicesPage';
import LateCheckoutRequestsPage from './pages/checkout/LateCheckoutRequestsPage';

import GuestListPage from './pages/guests/GuestListPage';
import GuestProfilePage from './pages/guests/GuestProfilePage';
import AddGuestPage from './pages/guests/AddGuestPage';
import EditGuestPage from './pages/guests/EditGuestPage';
import GuestAnalyticsPage from './pages/guests/GuestAnalyticsPage';

import HousekeepingDashboard from './pages/housekeeping/HousekeepingDashboard';
import RoomCleaningTaskList from './pages/housekeeping/RoomCleaningTaskList';
import AssignCleaningTaskPage from './pages/housekeeping/AssignCleaningTaskPage';
import HousekeepingStaffSchedule from './pages/housekeeping/HousekeepingStaffSchedule';
import CleaningStatusBoard from './pages/housekeeping/CleaningStatusBoard';
import CleaningTaskDetailsPage from './pages/housekeeping/CleaningTaskDetailsPage';
import HousekeepingReportsPage from './pages/housekeeping/HousekeepingReportsPage';
import HousekeepingMobileView from './pages/housekeeping/HousekeepingMobileView';
import CreateTaskPage from './pages/housekeeping/CreateTaskPage';

import MaintenanceDashboard from './pages/maintenance/MaintenanceDashboard';
import MaintenanceRequestPage from './pages/maintenance/MaintenanceRequestPage';
import MaintenanceTaskAssignmentPage from './pages/maintenance/MaintenanceTaskAssignmentPage';
import MaintenanceTaskListPage from './pages/maintenance/MaintenanceTaskListPage';
import MaintenanceTaskDetailsPage from './pages/maintenance/MaintenanceTaskDetailsPage';
import MaintenanceHistoryPage from './pages/maintenance/MaintenanceHistoryPage';

import InvoiceListPage from './pages/billing/InvoiceListPage';
import InvoiceDetailsPage from './pages/billing/InvoiceDetailsPage';
import CreateInvoicePage from './pages/billing/CreateInvoicePage';
import EditInvoicePage from './pages/billing/EditInvoicePage';
import InvoicePrintPage from './pages/billing/InvoicePrintPage';
import InvoiceEmailPage from './pages/billing/InvoiceEmailPage';
import InvoiceAdjustmentPage from './pages/billing/InvoiceAdjustmentPage';

import PaymentListPage from './pages/payments/PaymentListPage';
import PaymentDetailsPage from './pages/payments/PaymentDetailsPage';
import RecordPaymentPage from './pages/payments/RecordPaymentPage';
import PaymentRefundPage from './pages/payments/PaymentRefundPage';
import PaymentHistoryPage from './pages/payments/PaymentHistoryPage';
import PaymentMethodSettingsPage from './pages/payments/PaymentMethodSettingsPage';

import ServiceListPage from './pages/services/ServiceListPage';
import AddServicePage from './pages/services/AddServicePage';
import EditServicePage from './pages/services/EditServicePage';
import ServicePricingPage from './pages/services/ServicePricingPage';
import ServiceCategoryPage from './pages/services/ServiceCategoryPage';
import ServiceUsageReportPage from './pages/services/ServiceUsageReportPage';

import POSDashboardPage from './pages/pos/POSDashboardPage';
import RestaurantOrderPage from './pages/pos/RestaurantOrderPage';
import RoomServiceOrderPage from './pages/pos/RoomServiceOrderPage';
import OrderDetailsPage from './pages/pos/OrderDetailsPage';
import OrderBillingPage from './pages/pos/OrderBillingPage';
import POSPaymentPage from './pages/pos/POSPaymentPage';

import InventoryDashboardPage from './pages/inventory/InventoryDashboardPage';
import InventoryItemListPage from './pages/inventory/InventoryItemListPage';
import AddInventoryItemPage from './pages/inventory/AddInventoryItemPage';
import EditInventoryItemPage from './pages/inventory/EditInventoryItemPage';
import StockAdjustmentPage from './pages/inventory/StockAdjustmentPage';
import InventoryTransactionHistoryPage from './pages/inventory/InventoryTransactionHistoryPage';
import LowStockAlertPage from './pages/inventory/LowStockAlertPage';

import SupplierListPage from './pages/suppliers/SupplierListPage';
import AddSupplierPage from './pages/suppliers/AddSupplierPage';
import EditSupplierPage from './pages/suppliers/EditSupplierPage';
import SupplierDetailsPage from './pages/suppliers/SupplierDetailsPage';
import SupplierPurchaseHistoryPage from './pages/suppliers/SupplierPurchaseHistoryPage';

import StaffListPage from './pages/staff/StaffListPage';
import StaffProfilePage from './pages/staff/StaffProfilePage';
import AddStaffPage from './pages/staff/AddStaffPage';
import EditStaffPage from './pages/staff/EditStaffPage';
import StaffRoleAssignmentPage from './pages/staff/StaffRoleAssignmentPage';
import StaffSchedulePage from './pages/staff/StaffSchedulePage';
import StaffAttendancePage from './pages/staff/StaffAttendancePage';

import RevenueReportPage from './pages/reports/RevenueReportPage';
import OccupancyReportPage from './pages/reports/OccupancyReportPage';
import RoomAvailabilityReportPage from './pages/reports/RoomAvailabilityReportPage';
import GuestStatisticsReportPage from './pages/reports/GuestStatisticsReportPage';
import StaffPerformanceReportPage from './pages/reports/StaffPerformanceReportPage';
import PaymentReportPage from './pages/reports/PaymentReportPage';
import BookingReportPage from './pages/reports/BookingReportPage';

import BusinessAnalytics from './pages/analytics/BusinessAnalytics';
import CustomerDemographics from './pages/analytics/CustomerDemographics';
import BookingTrends from './pages/analytics/BookingTrends';
import SeasonalRevenue from './pages/analytics/SeasonalRevenue';

import NotificationListPage from './pages/notifications/NotificationListPage';
import SendNotificationPage from './pages/notifications/SendNotificationPage';
import EmailTemplatePage from './pages/notifications/EmailTemplatePage';
import SMSTemplatePage from './pages/notifications/SMSTemplatePage';

import HotelInformationSettingsPage from './pages/settings/HotelInformationSettingsPage';
import SystemConfigurationPage from './pages/settings/SystemConfigurationPage';
import CurrencySettingsPage from './pages/settings/CurrencySettingsPage';
import LanguageSettingsPage from './pages/settings/LanguageSettingsPage';
import TaxSettingsPage from './pages/settings/TaxSettingsPage';
import PaymentGatewaySettingsPage from './pages/settings/PaymentGatewaySettingsPage';

import UserManagementPage from './pages/security/UserManagement';
import RoleManagementPage from './pages/security/RoleManagement';
import PermissionSettingsPage from './pages/security/PermissionSettings';
import ActivityLogPage from './pages/security/ActivityLog';
import LoginHistoryPage from './pages/security/LoginHistory';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/2fa" element={<TwoFactorPage />} />
        <Route path="/auth/locked" element={<AccountLockedPage />} />
        <Route path="/auth/timeout" element={<SessionTimeoutPage />} />

        <Route path="/dashboard" element={<DashboardLayout><Navigate to="/dashboard/main" replace /></DashboardLayout>} />
        <Route path="/dashboard/main" element={<DashboardLayout><MainDashboard /></DashboardLayout>} />
        <Route path="/dashboard/performance" element={<DashboardLayout><HotelPerformanceDashboard /></DashboardLayout>} />
        <Route path="/dashboard/revenue" element={<DashboardLayout><RevenueDashboard /></DashboardLayout>} />
        <Route path="/dashboard/occupancy" element={<DashboardLayout><OccupancyDashboard /></DashboardLayout>} />
        <Route path="/dashboard/today" element={<DashboardLayout><TodaysActivityDashboard /></DashboardLayout>} />
        <Route path="/dashboard/staff" element={<DashboardLayout><StaffActivityDashboard /></DashboardLayout>} />
        <Route path="/dashboard/booking" element={<DashboardLayout><BookingAnalyticsDashboard /></DashboardLayout>} />

        <Route path="/reservations/list" element={<DashboardLayout><BookingListPage /></DashboardLayout>} />
        <Route path="/reservations/create" element={<DashboardLayout><CreateReservationPage /></DashboardLayout>} />
        <Route path="/reservations/edit/:id" element={<DashboardLayout><CreateReservationPage isEdit /></DashboardLayout>} />
        <Route path="/reservations/calendar" element={<DashboardLayout><ReservationCalendarPage /></DashboardLayout>} />
        <Route path="/reservations/timeline" element={<DashboardLayout><BookingTimelinePage /></DashboardLayout>} />
        <Route path="/reservations/sources" element={<DashboardLayout><BookingSourceAnalyticsPage /></DashboardLayout>} />
        <Route path="/reservations/details/:id" element={<DashboardLayout><ReservationDetailsPage /></DashboardLayout>} />

        <Route path="/rooms/list" element={<DashboardLayout><RoomListPage /></DashboardLayout>} />
        <Route path="/rooms/create" element={<DashboardLayout><CreateRoomPage /></DashboardLayout>} />
        <Route path="/rooms/edit/:id" element={<DashboardLayout><CreateRoomPage /></DashboardLayout>} />
        <Route path="/rooms/details/:id" element={<DashboardLayout><RoomDetailsPage /></DashboardLayout>} />
        <Route path="/rooms/status" element={<DashboardLayout><RoomStatusBoardPage /></DashboardLayout>} />
        <Route path="/rooms/maintenance" element={<DashboardLayout><RoomMaintenancePage /></DashboardLayout>} />
        <Route path="/rooms/floors" element={<DashboardLayout><FloorManagementPage /></DashboardLayout>} />

        <Route path="/rooms/types" element={<DashboardLayout><RoomTypeListPage /></DashboardLayout>} />
        <Route path="/rooms/types/create" element={<DashboardLayout><CreateRoomTypePage /></DashboardLayout>} />
        <Route path="/rooms/types/edit/:id" element={<DashboardLayout><CreateRoomTypePage /></DashboardLayout>} />
        <Route path="/rooms/types/pricing/:id" element={<DashboardLayout><RoomTypePricingPage /></DashboardLayout>} />
        <Route path="/rooms/types/gallery/:id" element={<DashboardLayout><RoomTypeGalleryPage /></DashboardLayout>} />

        <Route path="/checkin" element={<DashboardLayout><CheckinDashboardPage /></DashboardLayout>} />
        <Route path="/checkin/walkin" element={<DashboardLayout><WalkinReservationPage /></DashboardLayout>} />
        <Route path="/checkin/arrivals" element={<DashboardLayout><ArrivalsListPage /></DashboardLayout>} />
        <Route path="/checkin/process/:id" element={<DashboardLayout><CheckinProcessPage /></DashboardLayout>} />
        <Route path="/checkin/group" element={<DashboardLayout><GroupCheckinPage /></DashboardLayout>} />
        <Route path="/checkin/keycards" element={<DashboardLayout><KeyCardManagementPage /></DashboardLayout>} />

        <Route path="/checkout" element={<DashboardLayout><CheckoutDashboardPage /></DashboardLayout>} />
        <Route path="/checkout/departures" element={<DashboardLayout><DeparturesListPage /></DashboardLayout>} />
        <Route path="/checkout/process/:id" element={<DashboardLayout><CheckoutProcessPage /></DashboardLayout>} />
        <Route path="/checkout/group" element={<DashboardLayout><GroupCheckoutPage /></DashboardLayout>} />
        <Route path="/checkout/express" element={<DashboardLayout><ExpressCheckoutPage /></DashboardLayout>} />
        <Route path="/checkout/print-invoices" element={<DashboardLayout><PrintAllInvoicesPage /></DashboardLayout>} />
        <Route path="/checkout/late-checkout" element={<DashboardLayout><LateCheckoutRequestsPage /></DashboardLayout>} />

        <Route path="/guests" element={<DashboardLayout><GuestListPage /></DashboardLayout>} />
        <Route path="/guests/analytics" element={<DashboardLayout><GuestAnalyticsPage /></DashboardLayout>} />
        <Route path="/guests/profile/:id" element={<DashboardLayout><GuestProfilePage /></DashboardLayout>} />
        <Route path="/guests/add" element={<DashboardLayout><AddGuestPage /></DashboardLayout>} />
        <Route path="/guests/edit/:id" element={<DashboardLayout><EditGuestPage /></DashboardLayout>} />

        <Route path="/housekeeping" element={<DashboardLayout><HousekeepingDashboard /></DashboardLayout>} />
        <Route path="/housekeeping/tasks" element={<DashboardLayout><RoomCleaningTaskList /></DashboardLayout>} />
        <Route path="/housekeeping/assign" element={<DashboardLayout><AssignCleaningTaskPage /></DashboardLayout>} />
        <Route path="/housekeeping/schedule" element={<DashboardLayout><HousekeepingStaffSchedule /></DashboardLayout>} />
        <Route path="/housekeeping/status" element={<DashboardLayout><CleaningStatusBoard /></DashboardLayout>} />
        <Route path="/housekeeping/tasks/new" element={<DashboardLayout><CreateTaskPage /></DashboardLayout>} />
        <Route path="/housekeeping/tasks/:id" element={<DashboardLayout><CleaningTaskDetailsPage /></DashboardLayout>} />
        <Route path="/housekeeping/reports" element={<DashboardLayout><HousekeepingReportsPage /></DashboardLayout>} />
        <Route path="/housekeeping/mobile" element={<HousekeepingMobileView />} />

        <Route path="/maintenance" element={<DashboardLayout><MaintenanceDashboard /></DashboardLayout>} />
        <Route path="/maintenance/request" element={<DashboardLayout><MaintenanceRequestPage /></DashboardLayout>} />
        <Route path="/maintenance/assign" element={<DashboardLayout><MaintenanceTaskAssignmentPage /></DashboardLayout>} />
        <Route path="/maintenance/tasks" element={<DashboardLayout><MaintenanceTaskListPage /></DashboardLayout>} />
        <Route path="/maintenance/tasks/:id" element={<DashboardLayout><MaintenanceTaskDetailsPage /></DashboardLayout>} />
        <Route path="/maintenance/history" element={<DashboardLayout><MaintenanceHistoryPage /></DashboardLayout>} />

        <Route path="/billing/invoices" element={<DashboardLayout><InvoiceListPage /></DashboardLayout>} />
        <Route path="/billing/details/:id" element={<DashboardLayout><InvoiceDetailsPage /></DashboardLayout>} />
        <Route path="/billing/create" element={<DashboardLayout><CreateInvoicePage /></DashboardLayout>} />
        <Route path="/billing/edit/:id" element={<DashboardLayout><EditInvoicePage /></DashboardLayout>} />
        <Route path="/billing/print/:id" element={<InvoicePrintPage />} />
        <Route path="/billing/email/:id" element={<DashboardLayout><InvoiceEmailPage /></DashboardLayout>} />
        <Route path="/billing/adjust/:id" element={<DashboardLayout><InvoiceAdjustmentPage /></DashboardLayout>} />

        <Route path="/payments/list" element={<DashboardLayout><PaymentListPage /></DashboardLayout>} />
        <Route path="/payments/details/:id" element={<DashboardLayout><PaymentDetailsPage /></DashboardLayout>} />
        <Route path="/payments/record" element={<DashboardLayout><RecordPaymentPage /></DashboardLayout>} />
        <Route path="/payments/refund/:id" element={<DashboardLayout><PaymentRefundPage /></DashboardLayout>} />
        <Route path="/payments/history" element={<DashboardLayout><PaymentHistoryPage /></DashboardLayout>} />
        <Route path="/payments/settings" element={<DashboardLayout><PaymentMethodSettingsPage /></DashboardLayout>} />

        <Route path="/services/list" element={<DashboardLayout><ServiceListPage /></DashboardLayout>} />
        <Route path="/services/add" element={<DashboardLayout><AddServicePage /></DashboardLayout>} />
        <Route path="/services/edit/:id" element={<DashboardLayout><EditServicePage /></DashboardLayout>} />
        <Route path="/services/pricing/:id" element={<DashboardLayout><ServicePricingPage /></DashboardLayout>} />
        <Route path="/services/categories" element={<DashboardLayout><ServiceCategoryPage /></DashboardLayout>} />
        <Route path="/services/reports" element={<DashboardLayout><ServiceUsageReportPage /></DashboardLayout>} />

        <Route path="/pos/dashboard" element={<DashboardLayout><POSDashboardPage /></DashboardLayout>} />
        <Route path="/pos/restaurant" element={<DashboardLayout><RestaurantOrderPage /></DashboardLayout>} />
        <Route path="/pos/room-service" element={<DashboardLayout><RoomServiceOrderPage /></DashboardLayout>} />
        <Route path="/pos/order/:id" element={<DashboardLayout><OrderDetailsPage /></DashboardLayout>} />
        <Route path="/pos/billing/:id" element={<DashboardLayout><OrderBillingPage /></DashboardLayout>} />
        <Route path="/pos/payment/:id" element={<DashboardLayout><POSPaymentPage /></DashboardLayout>} />

        <Route path="/inventory/dashboard" element={<DashboardLayout><InventoryDashboardPage /></DashboardLayout>} />
        <Route path="/inventory/items" element={<DashboardLayout><InventoryItemListPage /></DashboardLayout>} />
        <Route path="/inventory/items/add" element={<DashboardLayout><AddInventoryItemPage /></DashboardLayout>} />
        <Route path="/inventory/items/edit/:id" element={<DashboardLayout><EditInventoryItemPage /></DashboardLayout>} />
        <Route path="/inventory/adjustment" element={<DashboardLayout><StockAdjustmentPage /></DashboardLayout>} />
        <Route path="/inventory/history" element={<DashboardLayout><InventoryTransactionHistoryPage /></DashboardLayout>} />
        <Route path="/inventory/alerts" element={<DashboardLayout><LowStockAlertPage /></DashboardLayout>} />

        <Route path="/suppliers/list" element={<DashboardLayout><SupplierListPage /></DashboardLayout>} />
        <Route path="/suppliers/add" element={<DashboardLayout><AddSupplierPage /></DashboardLayout>} />
        <Route path="/suppliers/edit/:id" element={<DashboardLayout><EditSupplierPage /></DashboardLayout>} />
        <Route path="/suppliers/details/:id" element={<DashboardLayout><SupplierDetailsPage /></DashboardLayout>} />
        <Route path="/suppliers/history/:id" element={<DashboardLayout><SupplierPurchaseHistoryPage /></DashboardLayout>} />

        <Route path="/staff/list" element={<DashboardLayout><StaffListPage /></DashboardLayout>} />
        <Route path="/staff/profile/:id" element={<DashboardLayout><StaffProfilePage /></DashboardLayout>} />
        <Route path="/staff/add" element={<DashboardLayout><AddStaffPage /></DashboardLayout>} />
        <Route path="/staff/edit/:id" element={<DashboardLayout><EditStaffPage /></DashboardLayout>} />
        <Route path="/staff/roles" element={<DashboardLayout><StaffRoleAssignmentPage /></DashboardLayout>} />
        <Route path="/staff/schedule" element={<DashboardLayout><StaffSchedulePage /></DashboardLayout>} />
        <Route path="/staff/schedule/:id" element={<DashboardLayout><StaffSchedulePage /></DashboardLayout>} />
        <Route path="/staff/attendance" element={<DashboardLayout><StaffAttendancePage /></DashboardLayout>} />

        <Route path="/reports/revenue" element={<DashboardLayout><RevenueReportPage /></DashboardLayout>} />
        <Route path="/reports/occupancy" element={<DashboardLayout><OccupancyReportPage /></DashboardLayout>} />
        <Route path="/reports/availability" element={<DashboardLayout><RoomAvailabilityReportPage /></DashboardLayout>} />
        <Route path="/reports/guests" element={<DashboardLayout><GuestStatisticsReportPage /></DashboardLayout>} />
        <Route path="/reports/staff" element={<DashboardLayout><StaffPerformanceReportPage /></DashboardLayout>} />
        <Route path="/reports/payments" element={<DashboardLayout><PaymentReportPage /></DashboardLayout>} />
        <Route path="/reports/bookings" element={<DashboardLayout><BookingReportPage /></DashboardLayout>} />

        <Route path="/analytics/business" element={<DashboardLayout><BusinessAnalytics /></DashboardLayout>} />
        <Route path="/analytics/demographics" element={<DashboardLayout><CustomerDemographics /></DashboardLayout>} />
        <Route path="/analytics/trends" element={<DashboardLayout><BookingTrends /></DashboardLayout>} />
        <Route path="/analytics/seasonal" element={<DashboardLayout><SeasonalRevenue /></DashboardLayout>} />

        <Route path="/notifications/list" element={<DashboardLayout><NotificationListPage /></DashboardLayout>} />
        <Route path="/notifications/send" element={<DashboardLayout><SendNotificationPage /></DashboardLayout>} />
        <Route path="/notifications/email-templates" element={<DashboardLayout><EmailTemplatePage /></DashboardLayout>} />
        <Route path="/notifications/sms-templates" element={<DashboardLayout><SMSTemplatePage /></DashboardLayout>} />

        <Route path="/settings/hotel" element={<DashboardLayout><HotelInformationSettingsPage /></DashboardLayout>} />
        <Route path="/settings/config" element={<DashboardLayout><SystemConfigurationPage /></DashboardLayout>} />
        <Route path="/settings/currency" element={<DashboardLayout><CurrencySettingsPage /></DashboardLayout>} />
        <Route path="/settings/language" element={<DashboardLayout><LanguageSettingsPage /></DashboardLayout>} />
        <Route path="/settings/tax" element={<DashboardLayout><TaxSettingsPage /></DashboardLayout>} />
        <Route path="/settings/payment-gateways" element={<DashboardLayout><PaymentGatewaySettingsPage /></DashboardLayout>} />

        <Route path="/security/users" element={<DashboardLayout><UserManagementPage /></DashboardLayout>} />
        <Route path="/security/roles" element={<DashboardLayout><RoleManagementPage /></DashboardLayout>} />
        <Route path="/security/permissions" element={<DashboardLayout><PermissionSettingsPage /></DashboardLayout>} />
        <Route path="/security/activity-log" element={<DashboardLayout><ActivityLogPage /></DashboardLayout>} />
        <Route path="/security/login-history" element={<DashboardLayout><LoginHistoryPage /></DashboardLayout>} />

        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
}
