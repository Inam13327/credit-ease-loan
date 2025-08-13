export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  ownerId: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  shopId: string;
  totalBalance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  shopId: string;
  type: 'credit' | 'payment';
  amount: number;
  description: string;
  date: string;
  createdBy: string;
}

export interface ShopCustomer extends Customer {
  shopName: string;
}