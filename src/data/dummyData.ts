import { Shop, Customer, Transaction } from '@/types';

export const dummyShops: Shop[] = [
  {
    id: 'shop1',
    name: 'Raj General Store',
    address: '123 Main Street, Delhi',
    phone: '+91 98765 43210',
    ownerId: '1',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'shop2',
    name: 'Amit Electronics',
    address: '456 Market Road, Mumbai',
    phone: '+91 87654 32109',
    ownerId: '3',
    createdAt: '2024-02-01T10:00:00Z'
  }
];

export const dummyCustomers: Customer[] = [
  {
    id: 'cust1',
    name: 'Priya Sharma',
    email: 'priya@email.com',
    phone: '+91 99999 11111',
    address: '789 Park Lane, Delhi',
    shopId: 'shop1',
    totalBalance: 1250.00,
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'cust2',
    name: 'Sunita Gupta',
    email: 'sunita@email.com',
    phone: '+91 88888 22222',
    address: '321 Garden Street, Delhi',
    shopId: 'shop1',
    totalBalance: 850.50,
    createdAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 'cust3',
    name: 'Vikash Patel',
    email: 'vikash@email.com',
    phone: '+91 77777 33333',
    address: '654 Highway, Mumbai',
    shopId: 'shop2',
    totalBalance: 2100.75,
    createdAt: '2024-02-05T10:00:00Z'
  },
  {
    id: 'cust4',
    name: 'Meera Singh',
    email: 'meera@email.com',
    phone: '+91 66666 44444',
    address: '987 Colony Road, Delhi',
    shopId: 'shop1',
    totalBalance: 0,
    createdAt: '2024-02-10T10:00:00Z'
  }
];

export const dummyTransactions: Transaction[] = [
  {
    id: 'txn1',
    customerId: 'cust1',
    shopId: 'shop1',
    type: 'credit',
    amount: 500.00,
    description: 'Groceries - Rice, Dal, Oil',
    date: '2024-08-10T14:30:00Z',
    createdBy: '1'
  },
  {
    id: 'txn2',
    customerId: 'cust1',
    shopId: 'shop1',
    type: 'credit',
    amount: 750.00,
    description: 'Household items - Soap, Shampoo',
    date: '2024-08-11T16:00:00Z',
    createdBy: '1'
  },
  {
    id: 'txn3',
    customerId: 'cust2',
    shopId: 'shop1',
    type: 'credit',
    amount: 1200.00,
    description: 'Monthly groceries',
    date: '2024-08-09T11:00:00Z',
    createdBy: '1'
  },
  {
    id: 'txn4',
    customerId: 'cust2',
    shopId: 'shop1',
    type: 'payment',
    amount: 350.50,
    description: 'Partial payment',
    date: '2024-08-12T09:30:00Z',
    createdBy: '1'
  },
  {
    id: 'txn5',
    customerId: 'cust3',
    shopId: 'shop2',
    type: 'credit',
    amount: 2100.75,
    description: 'Mobile phone and accessories',
    date: '2024-08-08T13:00:00Z',
    createdBy: '3'
  }
];