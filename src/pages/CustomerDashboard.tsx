import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/ui/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Store, 
  IndianRupee, 
  Clock,
  Search,
  CreditCard,
  Banknote,
  Calendar,
  FileText,
  TrendingDown,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { dummyShops, dummyCustomers, dummyTransactions } from '@/data/dummyData';
import { Shop, Customer, Transaction } from '@/types';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Find customer data for current user
  const customerData = dummyCustomers.find(customer => customer.email === user?.email);
  
  // Get all shops where customer has accounts (in real app, this would be from a junction table)
  const customerShops = dummyShops.filter(shop => 
    dummyCustomers.some(customer => 
      customer.email === user?.email && customer.shopId === shop.id
    )
  );
  
  // Get customer records for each shop
  const customerRecords = customerShops.map(shop => {
    const customerRecord = dummyCustomers.find(c => 
      c.email === user?.email && c.shopId === shop.id
    );
    return {
      shop,
      customer: customerRecord,
      balance: customerRecord?.totalBalance || 0
    };
  });

  // Get transactions for this customer
  const customerTransactions = dummyTransactions.filter(transaction => {
    const customer = dummyCustomers.find(c => 
      c.id === transaction.customerId && c.email === user?.email
    );
    return !!customer;
  });

  // Filter transactions based on search
  const filteredTransactions = customerTransactions.filter(transaction => {
    const shop = dummyShops.find(s => s.id === transaction.shopId);
    return (
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate totals
  const totalBalance = customerRecords.reduce((sum, record) => sum + record.balance, 0);
  const totalShops = customerShops.length;
  const recentTransactions = customerTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Monthly summary
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = customerTransactions.filter(txn => {
    const txnDate = new Date(txn.date);
    return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
  });
  const monthlyCredits = monthlyTransactions
    .filter(txn => txn.type === 'credit')
    .reduce((sum, txn) => sum + txn.amount, 0);
  const monthlyPayments = monthlyTransactions
    .filter(txn => txn.type === 'payment')
    .reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Track your credit balances and transaction history</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shops">My Shops</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Connected Shops</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalShops}</div>
                  <p className="text-xs text-muted-foreground">Active accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalBalance > 0 ? 'text-accent' : 'text-success'}`}>
                    ₹{totalBalance.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalBalance > 0 ? 'Amount due' : 'All paid'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month Credits</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">₹{monthlyCredits.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Credits taken</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month Payments</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">₹{monthlyPayments.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Payments made</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Shop Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Shop Balances</CardTitle>
                <CardDescription>Your current balance with each shop</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerRecords.map((record) => (
                    <div key={record.shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{record.shop.name}</h3>
                          <p className="text-sm text-muted-foreground">{record.shop.address}</p>
                          <p className="text-xs text-muted-foreground">{record.shop.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          record.balance > 0 ? 'text-accent' : 'text-success'
                        }`}>
                          ₹{record.balance.toFixed(2)}
                        </div>
                        <Badge variant={record.balance > 0 ? "secondary" : "outline"}>
                          {record.balance > 0 ? 'Amount Due' : 'Paid'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {customerRecords.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No shop accounts found. Contact shopkeepers to add you as a customer.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => {
                    const shop = dummyShops.find(s => s.id === transaction.shopId);
                    
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
                            <div className="font-medium">{shop?.name}</div>
                            <div className="text-sm text-muted-foreground">{transaction.description}</div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${
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
                  
                  {recentTransactions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shops" className="space-y-6">
            <div className="grid gap-6">
              {customerRecords.map((record) => {
                const shopTransactions = customerTransactions.filter(txn => txn.shopId === record.shop.id);
                const shopCredits = shopTransactions
                  .filter(txn => txn.type === 'credit')
                  .reduce((sum, txn) => sum + txn.amount, 0);
                const shopPayments = shopTransactions
                  .filter(txn => txn.type === 'payment')
                  .reduce((sum, txn) => sum + txn.amount, 0);
                
                return (
                  <Card key={record.shop.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                            <Store className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{record.shop.name}</CardTitle>
                            <CardDescription>{record.shop.address}</CardDescription>
                            <p className="text-sm text-muted-foreground mt-1">{record.shop.phone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${
                            record.balance > 0 ? 'text-accent' : 'text-success'
                          }`}>
                            ₹{record.balance.toFixed(2)}
                          </div>
                          <Badge variant={record.balance > 0 ? "secondary" : "outline"} className="mt-2">
                            {record.balance > 0 ? 'Amount Due' : 'All Paid'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-accent">₹{shopCredits.toFixed(2)}</div>
                          <p className="text-sm text-muted-foreground">Total Credits</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-success">₹{shopPayments.toFixed(2)}</div>
                          <p className="text-sm text-muted-foreground">Total Payments</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold">{shopTransactions.length}</div>
                          <p className="text-sm text-muted-foreground">Transactions</p>
                        </div>
                      </div>
                      
                      {/* Recent transactions for this shop */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-4">Recent Transactions</h4>
                        <div className="space-y-3">
                          {shopTransactions
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 3)
                            .map((transaction) => (
                              <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    transaction.type === 'credit' ? 'bg-accent/10' : 'bg-success/10'
                                  }`}>
                                    {transaction.type === 'credit' ? 
                                      <CreditCard className="w-4 h-4 text-accent" /> : 
                                      <Banknote className="w-4 h-4 text-success" />
                                    }
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{transaction.description}</div>
                                    <div className="text-xs text-muted-foreground flex items-center">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {new Date(transaction.date).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div className={`font-medium ${
                                  transaction.type === 'credit' ? 'text-accent' : 'text-success'
                                }`}>
                                  {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {customerRecords.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Connected Shops</h3>
                    <p className="text-muted-foreground mb-4">
                      Contact your local shopkeepers to add you as a customer in their UdharTrack system.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Complete history of all your transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => {
                    const shop = dummyShops.find(s => s.id === transaction.shopId);
                    
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            transaction.type === 'credit' ? 'bg-accent/10' : 'bg-success/10'
                          }`}>
                            {transaction.type === 'credit' ? 
                              <CreditCard className="w-6 h-6 text-accent" /> : 
                              <Banknote className="w-6 h-6 text-success" />
                            }
                          </div>
                          <div>
                            <div className="font-semibold">{shop?.name}</div>
                            <div className="text-sm text-muted-foreground">{transaction.description}</div>
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(transaction.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${
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
                  
                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
                      <p>
                        {searchTerm ? 'Try adjusting your search terms.' : 'No transactions to display.'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;