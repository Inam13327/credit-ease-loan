import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Store, 
  Users, 
  Plus, 
  IndianRupee, 
  TrendingUp, 
  Clock,
  Search,
  UserPlus,
  CreditCard,
  Banknote
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyShops, dummyCustomers, dummyTransactions } from '@/data/dummyData';
import { Shop, Customer, Transaction } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ShopkeeperDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter data for current user
  const userShops = dummyShops.filter(shop => shop.ownerId === user?.id);
  const userCustomers = dummyCustomers.filter(customer => 
    userShops.some(shop => shop.id === customer.shopId)
  );
  const userTransactions = dummyTransactions.filter(transaction => 
    userShops.some(shop => shop.id === transaction.shopId)
  );

  // Stats calculations
  const totalCustomers = userCustomers.length;
  const totalBalance = userCustomers.reduce((sum, customer) => sum + customer.totalBalance, 0);
  const todayTransactions = userTransactions.filter(txn => 
    new Date(txn.date).toDateString() === new Date().toDateString()
  ).length;

  const filteredCustomers = userCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentTransactions = userTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopkeeper Dashboard</h1>
          <p className="text-muted-foreground">Manage your shops, customers, and transactions</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="shops">Shops</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userShops.length}</div>
                  <p className="text-xs text-muted-foreground">Active shops</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">Registered customers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">₹{totalBalance.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total credit amount</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayTransactions}</div>
                  <p className="text-xs text-muted-foreground">Transactions today</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest customer transactions across all shops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => {
                    const customer = userCustomers.find(c => c.id === transaction.customerId);
                    const shop = userShops.find(s => s.id === transaction.shopId);
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'credit' ? 'bg-accent/10' : 'bg-success/10'
                          }`}>
                            {transaction.type === 'credit' ? 
                              <CreditCard className="w-5 h-5 text-accent" /> : 
                              <Banknote className="w-5 h-5 text-success" />
                            }
                          </div>
                          <div>
                            <div className="font-medium">{customer?.name}</div>
                            <div className="text-sm text-muted-foreground">{shop?.name}</div>
                            <div className="text-xs text-muted-foreground">{transaction.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${
                            transaction.type === 'credit' ? 'text-accent' : 'text-success'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>Create a new customer account for your shop</DialogDescription>
                  </DialogHeader>
                  <AddCustomerForm shops={userShops} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {filteredCustomers.map((customer) => {
                const shop = userShops.find(s => s.id === customer.shopId);
                return (
                  <Card key={customer.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{customer.name}</h3>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                            <p className="text-xs text-muted-foreground">{shop?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent">₹{customer.totalBalance.toFixed(2)}</div>
                          <Badge variant={customer.totalBalance > 0 ? "secondary" : "outline"}>
                            {customer.totalBalance > 0 ? 'Credit Due' : 'Paid'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Transaction Management</h2>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Credit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Credit Transaction</DialogTitle>
                      <DialogDescription>Record goods given to customer on credit</DialogDescription>
                    </DialogHeader>
                    <TransactionForm type="credit" customers={userCustomers} />
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Banknote className="w-4 h-4 mr-2" />
                      Add Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Payment</DialogTitle>
                      <DialogDescription>Record payment received from customer</DialogDescription>
                    </DialogHeader>
                    <TransactionForm type="payment" customers={userCustomers} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All transactions across your shops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userTransactions.map((transaction) => {
                    const customer = userCustomers.find(c => c.id === transaction.customerId);
                    const shop = userShops.find(s => s.id === transaction.shopId);
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'credit' ? 'bg-accent/10' : 'bg-success/10'
                          }`}>
                            {transaction.type === 'credit' ? 
                              <CreditCard className="w-5 h-5 text-accent" /> : 
                              <Banknote className="w-5 h-5 text-success" />
                            }
                          </div>
                          <div>
                            <div className="font-medium">{customer?.name}</div>
                            <div className="text-sm text-muted-foreground">{shop?.name}</div>
                            <div className="text-xs text-muted-foreground">{transaction.description}</div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(transaction.date).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-medium ${
                            transaction.type === 'credit' ? 'text-accent' : 'text-success'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                          </div>
                          <Badge variant={transaction.type === 'credit' ? "secondary" : "outline"}>
                            {transaction.type === 'credit' ? 'Credit' : 'Payment'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shops" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Shop Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Shop
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Shop</DialogTitle>
                    <DialogDescription>Create a new shop location</DialogDescription>
                  </DialogHeader>
                  <AddShopForm />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {userShops.map((shop) => {
                const shopCustomers = userCustomers.filter(c => c.shopId === shop.id);
                const shopBalance = shopCustomers.reduce((sum, customer) => sum + customer.totalBalance, 0);
                
                return (
                  <Card key={shop.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                            <Store className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle>{shop.name}</CardTitle>
                            <CardDescription>{shop.address}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent">₹{shopBalance.toFixed(2)}</div>
                          <p className="text-sm text-muted-foreground">Outstanding</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{shopCustomers.length}</div>
                          <p className="text-sm text-muted-foreground">Customers</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{shop.phone}</div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {new Date(shop.createdAt).getFullYear()}
                          </div>
                          <p className="text-sm text-muted-foreground">Est.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Add Customer Form Component
const AddCustomerForm = ({ shops }: { shops: Shop[] }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [shopId, setShopId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Customer added successfully!",
    });
    // Reset form
    setName(''); setEmail(''); setPhone(''); setAddress(''); setShopId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Customer Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="shop">Shop</Label>
        <Select value={shopId} onValueChange={setShopId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select shop" />
          </SelectTrigger>
          <SelectContent>
            {shops.map(shop => (
              <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Add Customer</Button>
    </form>
  );
};

// Transaction Form Component
const TransactionForm = ({ type, customers }: { type: 'credit' | 'payment'; customers: Customer[] }) => {
  const { toast } = useToast();
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: `${type === 'credit' ? 'Credit' : 'Payment'} transaction added successfully!`,
    });
    // Reset form
    setCustomerId(''); setAmount(''); setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="customer">Customer</Label>
        <Select value={customerId} onValueChange={setCustomerId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input 
          id="amount" 
          type="number" 
          step="0.01" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder={type === 'credit' ? 'Items purchased...' : 'Payment received...'}
          required 
        />
      </div>
      <Button type="submit" className="w-full">
        Add {type === 'credit' ? 'Credit' : 'Payment'}
      </Button>
    </form>
  );
};

// Add Shop Form Component
const AddShopForm = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Shop added successfully!",
    });
    // Reset form
    setName(''); setAddress(''); setPhone('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="shopName">Shop Name</Label>
        <Input id="shopName" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="shopAddress">Address</Label>
        <Textarea id="shopAddress" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="shopPhone">Phone</Label>
        <Input id="shopPhone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">Add Shop</Button>
    </form>
  );
};

export default ShopkeeperDashboard;