# Hotel PMS - Property Management System

A comprehensive Hotel Property Management System (PMS) built with React, TypeScript, and Tailwind CSS.

## Features

### Core Modules
- **Dashboard** - Main dashboard with KPIs, revenue, occupancy, and analytics
- **Reservations** - Booking management, calendar view, timeline
- **Room Management** - Room inventory, types, pricing, status board
- **Check-in/Check-out** - Guest arrival, departure processing
- **Guest Management** - Guest profiles, loyalty program, preferences
- **Housekeeping** - Cleaning tasks, staff scheduling, status tracking
- **Maintenance** - Task management, request tracking, history
- **Billing & Payments** - Invoices, payment processing, refunds
- **POS** - Restaurant orders, room service, billing
- **Inventory** - Stock management, alerts, transactions
- **Staff Management** - Employee directory, schedules, attendance
- **Reports** - Revenue, occupancy, guest statistics
- **Analytics** - Business insights, trends, demographics
- **Notifications** - Email/SMS templates, notifications
- **Settings** - Hotel info, taxes, currencies, payment gateways
- **Security** - User management, roles, permissions, audit logs

### Technical Features
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- React Query for data fetching & caching
- React Hook Form + Zod for form validation
- React Router for navigation
- Toast notifications (Sonner)
- Date picker components
- Modal/Dialog components
- DataTable with sorting, filtering, pagination
- Export functionality (CSV, JSON)
- Skeleton loading states
- Error boundaries
- Unit tests with Vitest

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| State/Data | React Query |
| Forms | React Hook Form + Zod |
| Routing | React Router DOM |
| Icons | Lucide React |
| Charts | Recharts |
| Build | Vite |
| Testing | Vitest + Testing Library |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file (optional - defaults are provided)
cp .env.example .env
```

### Running the App

```bash
# Development - Frontend only
npm run dev

# Development - Frontend + Backend
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev
```

The app will be available at **http://localhost:3000**

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API client and services
│   ├── client.ts     # Axios/fetch client
│   ├── hooks.ts      # React Query hooks
│   ├── auth.ts       # Auth endpoints
│   ├── reservations.ts
│   ├── rooms.ts
│   ├── guests.ts
│   ├── staff.ts
│   └── ...
├── components/       # Reusable components
│   ├── forms/       # Form components
│   ├── dashboard/   # Dashboard layout
│   ├── DataTable.tsx
│   ├── DatePicker.tsx
│   ├── Modal.tsx
│   ├── Skeleton.tsx
│   ├── Breadcrumb.tsx
│   ├── ErrorBoundary.tsx
│   └── ...
├── context/         # React Context
│   ├── AuthContext.tsx
│   └── AuthGuard.tsx
├── data/            # Mock data
├── lib/             # Utilities
│   ├── schemas.ts   # Zod validation schemas
│   ├── export.ts    # Export utilities
│   └── toast.ts     # Toast helpers
├── pages/           # Page components
│   ├── auth/
│   ├── dashboard/
│   ├── reservations/
│   ├── rooms/
│   ├── guests/
│   ├── staff/
│   └── ...
├── types/           # TypeScript types
│   └── database.ts
└── test/            # Test setup and samples
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:server` | Start backend server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run lint` | TypeScript check |

## API Integration

The frontend is configured to work with a backend API. By default, it points to:

```
http://localhost:3001/api
```

To change the API URL, update the `.env` file:

```env
VITE_API_URL=http://your-api-url/api
```

## Form Validation

The project uses Zod schemas for form validation. Example:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guestSchema, GuestFormData } from '@/lib/schemas';

const { register, handleSubmit } = useForm<GuestFormData>({
  resolver: zodResolver(guestSchema),
});
```

## Testing

```bash
# Run tests
npm run test

# Run with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License

## Screenshots

The application includes a comprehensive dashboard with:
- Revenue analytics
- Occupancy rates
- Booking trends
- Guest demographics
- Staff performance
- And much more...

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
