import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  DollarSign, 
  Users, 
  Calendar, 
  Activity, 
  PieChart, 
  Bell, 
  Search, 
  Menu, 
  X, 
  Hotel,
  LogOut,
  ChevronRight,
  ChevronDown,
  User,
  ClipboardList,
  PlusCircle,
  CalendarDays,
  GanttChartSquare,
  Globe,
  DoorOpen,
  LayoutGrid,
  Wrench,
  Layers,
  LogIn,
  UserPlus,
  Sparkles,
  History,
  CreditCard,
  FileText,
  Settings,
  Tag,
  ShoppingBag,
  Utensils,
  Coffee,
  Boxes,
  Package,
  RefreshCw,
  AlertTriangle,
  Truck,
  Shield,
  Clock,
  PieChart as PieChartIcon,
  TrendingUp,
  Award,
  Smartphone,
  Building2,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: any;
}

interface NavSection {
  title: string;
  icon: any;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Dashboards',
    icon: LayoutDashboard,
    items: [
      { name: 'Main Dashboard', path: '/dashboard/main', icon: LayoutDashboard },
      { name: 'Hotel Performance', path: '/dashboard/performance', icon: BarChart3 },
      { name: 'Revenue Analytics', path: '/dashboard/revenue', icon: DollarSign },
      { name: 'Occupancy', path: '/dashboard/occupancy', icon: Users },
      { name: "Today's Activity", path: '/dashboard/today', icon: Activity },
      { name: 'Staff Activity', path: '/dashboard/staff', icon: Calendar },
      { name: 'Booking Analytics', path: '/dashboard/booking', icon: PieChart },
    ]
  },
  {
    title: 'Reservations',
    icon: CalendarDays,
    items: [
      { name: 'Booking List', path: '/reservations/list', icon: ClipboardList },
      { name: 'New Reservation', path: '/reservations/create', icon: PlusCircle },
      { name: 'Calendar View', path: '/reservations/calendar', icon: CalendarDays },
      { name: 'Timeline View', path: '/reservations/timeline', icon: GanttChartSquare },
      { name: 'Booking Sources', path: '/reservations/sources', icon: Globe },
    ]
  },
  {
    title: 'Rooms',
    icon: DoorOpen,
    items: [
      { name: 'Room List', path: '/rooms/list', icon: DoorOpen },
      { name: 'Room Types', path: '/rooms/types', icon: Layers },
      { name: 'Status Board', path: '/rooms/status', icon: LayoutGrid },
      { name: 'Maintenance', path: '/rooms/maintenance', icon: Wrench },
      { name: 'Floor Management', path: '/rooms/floors', icon: Layers },
    ]
  },
  {
    title: 'Front Desk',
    icon: LogIn,
    items: [
      { name: 'Check-in', path: '/checkin', icon: LogIn },
      { name: 'Check-out', path: '/checkout', icon: LogOut },
      { name: 'Arrivals', path: '/checkin/arrivals', icon: Users },
    ]
  },
  {
    title: 'Guest Management',
    icon: Users,
    items: [
      { name: 'Guest Directory', path: '/guests', icon: Users },
      { name: 'Add New Guest', path: '/guests/add', icon: UserPlus },
    ]
  },
  {
    title: 'Housekeeping',
    icon: Sparkles,
    items: [
      { name: 'Dashboard', path: '/housekeeping', icon: LayoutDashboard },
      { name: 'Cleaning Tasks', path: '/housekeeping/tasks', icon: ClipboardList },
      { name: 'Status Board', path: '/housekeeping/status', icon: Sparkles },
      { name: 'Staff Schedule', path: '/housekeeping/schedule', icon: Calendar },
      { name: 'Reports', path: '/housekeeping/reports', icon: BarChart3 },
    ]
  },
  {
    title: 'Maintenance',
    icon: Wrench,
    items: [
      { name: 'Dashboard', path: '/maintenance', icon: LayoutDashboard },
      { name: 'New Request', path: '/maintenance/request', icon: PlusCircle },
      { name: 'Task Assignment', path: '/maintenance/assign', icon: UserPlus },
      { name: 'Task List', path: '/maintenance/tasks', icon: ClipboardList },
      { name: 'History', path: '/maintenance/history', icon: History },
    ]
  },
  {
    title: 'Billing & Finance',
    icon: CreditCard,
    items: [
      { name: 'Invoices', path: '/billing/invoices', icon: FileText },
      { name: 'Create Invoice', path: '/billing/create', icon: PlusCircle },
    ]
  },
  {
    title: 'Payments',
    icon: DollarSign,
    items: [
      { name: 'Transactions', path: '/payments/list', icon: CreditCard },
      { name: 'Record Payment', path: '/payments/record', icon: PlusCircle },
      { name: 'History', path: '/payments/history', icon: History },
      { name: 'Settings', path: '/payments/settings', icon: Settings },
    ]
  },
  {
    title: 'Services',
    icon: Tag,
    items: [
      { name: 'Service List', path: '/services/list', icon: ClipboardList },
      { name: 'Categories', path: '/services/categories', icon: Layers },
      { name: 'Usage Reports', path: '/services/reports', icon: BarChart3 },
    ]
  },
  {
    title: 'POS',
    icon: ShoppingBag,
    items: [
      { name: 'Dashboard', path: '/pos/dashboard', icon: LayoutDashboard },
      { name: 'Restaurant', path: '/pos/restaurant', icon: Utensils },
      { name: 'Room Service', path: '/pos/room-service', icon: Coffee },
    ]
  },
  {
    title: 'Inventory',
    icon: Boxes,
    items: [
      { name: 'Dashboard', path: '/inventory/dashboard', icon: LayoutDashboard },
      { name: 'Item List', path: '/inventory/items', icon: Package },
      { name: 'Suppliers', path: '/suppliers/list', icon: Truck },
      { name: 'Stock Adjustment', path: '/inventory/adjustment', icon: RefreshCw },
      { name: 'Alerts', path: '/inventory/alerts', icon: AlertTriangle },
    ]
  },
  {
    title: 'Staff Management',
    icon: Users,
    items: [
      { name: 'Staff Directory', path: '/staff/list', icon: Users },
      { name: 'Role Assignment', path: '/staff/roles', icon: Shield },
      { name: 'Schedules', path: '/staff/schedule', icon: Calendar },
      { name: 'Attendance', path: '/staff/attendance', icon: Clock },
    ]
  },
  {
    title: 'Analytics',
    icon: Activity,
    items: [
      { name: 'Business Analytics', path: '/analytics/business', icon: LayoutDashboard },
      { name: 'Customer Demographics', path: '/analytics/demographics', icon: Users },
      { name: 'Booking Trends', path: '/analytics/trends', icon: TrendingUp },
      { name: 'Seasonal Revenue', path: '/analytics/seasonal', icon: Calendar },
    ]
  },
  {
    title: 'Reports',
    icon: BarChart3,
    items: [
      { name: 'Revenue', path: '/reports/revenue', icon: TrendingUp },
      { name: 'Occupancy', path: '/reports/occupancy', icon: PieChartIcon },
      { name: 'Availability', path: '/reports/availability', icon: Boxes },
      { name: 'Guest Stats', path: '/reports/guests', icon: Users },
      { name: 'Staff Performance', path: '/reports/staff', icon: Award },
      { name: 'Payments', path: '/reports/payments', icon: DollarSign },
      { name: 'Bookings', path: '/reports/bookings', icon: FileText },
    ]
  },
  {
    title: 'Notification System',
    icon: Bell,
    items: [
      { name: 'Notification List', path: '/notifications/list', icon: ClipboardList },
      { name: 'Send Notification', path: '/notifications/send', icon: PlusCircle },
      { name: 'Email Templates', path: '/notifications/email-templates', icon: FileText },
      { name: 'SMS Templates', path: '/notifications/sms-templates', icon: Smartphone },
    ]
  },
  {
    title: 'System Settings',
    icon: Settings,
    items: [
      { name: 'Hotel Information', path: '/settings/hotel', icon: Building2 },
      { name: 'System Config', path: '/settings/config', icon: Settings },
      { name: 'Currency Settings', path: '/settings/currency', icon: DollarSign },
      { name: 'Language Settings', path: '/settings/language', icon: Globe },
      { name: 'Tax Settings', path: '/settings/tax', icon: Percent },
      { name: 'Payment Gateways', path: '/settings/payment-gateways', icon: CreditCard },
    ]
  },
  {
    title: 'Security Management',
    icon: Shield,
    items: [
      { name: 'User Management', path: '/security/users', icon: Users },
      { name: 'Role Management', path: '/security/roles', icon: Shield },
      { name: 'Permission Settings', path: '/security/permissions', icon: Lock },
      { name: 'Activity Log', path: '/security/activity-log', icon: Activity },
      { name: 'Login History', path: '/security/login-history', icon: History },
    ]
  }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  // Auto-open section if current path is within it
  React.useEffect(() => {
    const activeSection = navSections.find(section => 
      section.items.some(item => item.path === location.pathname)
    );
    if (activeSection && isSidebarOpen) {
      setOpenSection(activeSection.title);
    }
  }, [location.pathname, isSidebarOpen]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-[#1a1a1a]">
      {/* Sidebar */}
      <aside 
        className={`bg-[#1a1a1a] text-white transition-all duration-300 ease-in-out flex flex-col z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center shrink-0">
            <Hotel className="w-4 h-4 text-[#f5f2ed]" />
          </div>
          {isSidebarOpen && (
            <span className="text-sm font-serif tracking-widest uppercase truncate">GrandView</span>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {navSections.map((section) => {
            const isOpen = openSection === section.title;
            const hasActiveItem = section.items.some(item => item.path === location.pathname);
            const SectionIcon = section.icon;

            return (
              <div key={section.title} className="space-y-1">
                <button
                  onClick={() => isSidebarOpen ? toggleSection(section.title) : setIsSidebarOpen(true)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    isOpen || hasActiveItem 
                      ? 'bg-white/5 text-white' 
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <SectionIcon className={`w-4.5 h-4.5 shrink-0 ${isOpen || hasActiveItem ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} />
                  {isSidebarOpen && (
                    <>
                      <span className="text-sm font-medium whitespace-nowrap flex-1 text-left">{section.title}</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                      />
                    </>
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && isSidebarOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
                        {section.items.map((item) => {
                          const isActive = location.pathname === item.path;
                          const ItemIcon = item.icon;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                                isActive 
                                  ? 'bg-white/10 text-white' 
                                  : 'text-white/40 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`} />
                              <span className="text-xs font-medium whitespace-nowrap">{item.name}</span>
                              {isActive && (
                                <motion.div 
                                  layoutId="activeNav"
                                  className="ml-auto w-1 h-3 bg-white rounded-full"
                                />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => navigate('/auth/login')}
            className="flex items-center gap-3 w-full px-3 py-3 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
          >
            <LogOut className="w-5 h-5 shrink-0 text-white/40 group-hover:text-white/70" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#1a1a1a]/5 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">
              <span>GrandView PMS</span>
              <ChevronRight size={12} />
              <span className="text-[#1a1a1a]">
                {navSections.flatMap(s => s.items).find(i => i.path === location.pathname)?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-full px-4 py-1.5 gap-2 w-64">
              <Search size={16} className="text-[#1a1a1a]/30" />
              <input 
                type="text" 
                placeholder="Search reservations..." 
                className="bg-transparent border-none focus:outline-none text-sm w-full font-light"
              />
            </div>
            
            <button className="relative p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors">
              <Bell size={20} className="text-[#1a1a1a]/60" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-[#1a1a1a]/10 mx-2"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none mb-1">Alexander Wright</p>
                <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-semibold">General Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white font-serif italic border-2 border-white shadow-sm">
                AW
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
