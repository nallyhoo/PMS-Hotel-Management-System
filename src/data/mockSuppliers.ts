export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'active' | 'inactive';
  rating: number;
  lastOrderDate: string;
}

export const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Global Food Solutions',
    contactPerson: 'John Miller',
    email: 'john@globalfood.com',
    phone: '+1 (555) 123-4567',
    address: '123 Logistics Way, Chicago, IL',
    category: 'Food & Beverage',
    status: 'active',
    rating: 4.8,
    lastOrderDate: '2024-03-01',
  },
  {
    id: 'SUP-002',
    name: 'Linen & Co.',
    contactPerson: 'Sarah Jenkins',
    email: 'sarah@linenco.com',
    phone: '+1 (555) 987-6543',
    address: '456 Textile Ave, Atlanta, GA',
    category: 'Housekeeping',
    status: 'active',
    rating: 4.5,
    lastOrderDate: '2024-02-15',
  },
  {
    id: 'SUP-003',
    name: 'TechPro Hospitality',
    contactPerson: 'Michael Chen',
    email: 'm.chen@techpro.com',
    phone: '+1 (555) 246-8135',
    address: '789 Innovation Dr, San Jose, CA',
    category: 'Maintenance & IT',
    status: 'active',
    rating: 4.9,
    lastOrderDate: '2024-03-05',
  },
  {
    id: 'SUP-004',
    name: 'EcoClean Supplies',
    contactPerson: 'Emily White',
    email: 'emily@ecoclean.com',
    phone: '+1 (555) 369-2580',
    address: '321 Green St, Portland, OR',
    category: 'Housekeeping',
    status: 'inactive',
    rating: 3.2,
    lastOrderDate: '2023-11-20',
  },
  {
    id: 'SUP-005',
    name: 'Premium Spirits Ltd.',
    contactPerson: 'Robert Brown',
    email: 'robert@premiumspirits.com',
    phone: '+1 (555) 147-2589',
    address: '555 Distillery Rd, Louisville, KY',
    category: 'Food & Beverage',
    status: 'active',
    rating: 4.7,
    lastOrderDate: '2024-03-08',
  },
];

export interface PurchaseHistory {
  id: string;
  supplierId: string;
  orderDate: string;
  amount: number;
  status: 'delivered' | 'pending' | 'cancelled';
  items: number;
}

export const mockPurchaseHistory: PurchaseHistory[] = [
  {
    id: 'PO-1001',
    supplierId: 'SUP-001',
    orderDate: '2024-03-01',
    amount: 1250.00,
    status: 'delivered',
    items: 15,
  },
  {
    id: 'PO-1005',
    supplierId: 'SUP-001',
    orderDate: '2024-02-10',
    amount: 850.50,
    status: 'delivered',
    items: 8,
  },
  {
    id: 'PO-1010',
    supplierId: 'SUP-002',
    orderDate: '2024-02-15',
    amount: 3400.00,
    status: 'delivered',
    items: 120,
  },
  {
    id: 'PO-1015',
    supplierId: 'SUP-003',
    orderDate: '2024-03-05',
    amount: 560.00,
    status: 'pending',
    items: 3,
  },
  {
    id: 'PO-1020',
    supplierId: 'SUP-005',
    orderDate: '2024-03-08',
    amount: 2100.00,
    status: 'pending',
    items: 24,
  },
];
