import { useState } from 'react';
import { format, parseISO, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Crown,
  Target,
  Wallet
} from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { haptics } from '@/lib/haptics';

// Weekly goal - can be made configurable later
const WEEKLY_GOAL = 10000; // ₺10,000 weekly goal

export function AdminDashboard() {
  const { 
    dashboardStats, 
    clients, 
    incomeEntries, 
    addIncome, 
    deleteIncome,
    toggleClientVIP,
    bookings
  } = useSalon();
  
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeNote, setIncomeNote] = useState('');
  const [incomeDate, setIncomeDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleAddIncome = () => {
    const amount = parseFloat(incomeAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    haptics.success();
    addIncome(amount, incomeNote || undefined, incomeDate);
    setIncomeAmount('');
    setIncomeNote('');
  };

  // Calculate progress percentage
  const weekProgress = Math.min((dashboardStats.weekEarnings / WEEKLY_GOAL) * 100, 100);

  // Get recent income entries (last 7 days)
  const recentIncome = incomeEntries
    .filter(e => parseISO(e.date) >= subDays(new Date(), 7))
    .sort((a, b) => b.date.localeCompare(a.date));

  // Get today's bookings
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayBookings = bookings.filter(b => b.date === todayStr);

  // Get VIP clients
  const vipClients = clients.filter(c => c.tags.includes('VIP'));

  // Stats cards data
  const statsCards = [
    {
      title: "Today's Earnings",
      value: `₺${dashboardStats.todayEarnings.toLocaleString()}`,
      icon: Wallet,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Week Earnings',
      value: `₺${dashboardStats.weekEarnings.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Month Earnings',
      value: `₺${dashboardStats.monthEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Clients',
      value: dashboardStats.totalClients.toString(),
      icon: Users,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      subtitle: `${dashboardStats.vipClients} VIP`
    },
    {
      title: 'Pending Bookings',
      value: dashboardStats.pendingBookings.toString(),
      icon: Clock,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Completed',
      value: dashboardStats.completedBookings.toString(),
      icon: CheckCircle2,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`${stat.bgColor} border-0 overflow-hidden`}>
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Goal Progress */}
      <Card className="bg-gradient-to-r from-primary/10 to-amber-500/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Weekly Goal</h3>
                <p className="text-sm text-muted-foreground">
                  {format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM d')} - {format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM d')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                ₺{dashboardStats.weekEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                of ₺{WEEKLY_GOAL.toLocaleString()} goal
              </p>
            </div>
          </div>
          <Progress value={weekProgress} className="h-4" />
          <p className="text-sm text-center mt-2 font-medium">
            {weekProgress >= 100 ? (
              <span className="text-green-600">🎉 Goal achieved! Great work!</span>
            ) : (
              <span className="text-muted-foreground">
                ₺{(WEEKLY_GOAL - dashboardStats.weekEarnings).toLocaleString()} more to reach your goal
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Income Section */}
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Plus className="w-5 h-5" />
              Add Today's Earnings
            </CardTitle>
            <CardDescription className="text-green-600">
              Record your income in Turkish Lira (₺)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="font-semibold">Amount (₺)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  className="h-12 text-xl font-bold text-center border-2"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Date</Label>
                <Input
                  type="date"
                  value={incomeDate}
                  onChange={(e) => setIncomeDate(e.target.value)}
                  className="h-12 border-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Note (optional)</Label>
              <Input
                placeholder="e.g., Box braids, Cash payment"
                value={incomeNote}
                onChange={(e) => setIncomeNote(e.target.value)}
                className="h-12 border-2"
              />
            </div>
            <Button 
              onClick={handleAddIncome}
              disabled={!incomeAmount || parseFloat(incomeAmount) <= 0}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add ₺{incomeAmount || '0'}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Income */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Earnings (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentIncome.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No earnings recorded yet</p>
                <p className="text-sm">Add your first income entry</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentIncome.map(entry => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted"
                  >
                    <div>
                      <p className="font-bold text-green-600 text-lg">
                        +₺{entry.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(entry.date), 'EEE, MMM d')}
                        {entry.note && ` • ${entry.note}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { haptics.light(); deleteIncome(entry.id); }}
                      className="text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Appointments
            </CardTitle>
            <CardDescription>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No appointments today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayBookings.map(booking => {
                  const client = clients.find(c => c.id === booking.clientId);
                  return (
                    <div
                      key={booking.id}
                      className={`p-3 rounded-lg border-2 ${
                        booking.status === 'pending' 
                          ? 'border-amber-300 bg-amber-50' 
                          : booking.status === 'confirmed'
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">{client?.name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                        <Badge variant={
                          booking.status === 'pending' ? 'secondary' :
                          booking.status === 'confirmed' ? 'default' : 'outline'
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* VIP Clients */}
        <Card className="border-2 border-amber-200">
          <CardHeader className="bg-amber-50">
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Crown className="w-5 h-5" />
              VIP Clients ({vipClients.length})
            </CardTitle>
            <CardDescription className="text-amber-600">
              Your loyal customers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {vipClients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No VIP clients yet</p>
                <p className="text-sm">Mark loyal clients as VIP in the Clients section</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {vipClients.map(client => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-100/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.phone}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { haptics.light(); toggleClientVIP(client.id); }}
                      className="text-amber-600"
                    >
                      Remove VIP
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">{dashboardStats.totalBookings}</p>
              <p className="text-slate-400 text-sm">Total Bookings</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{dashboardStats.totalClients}</p>
              <p className="text-slate-400 text-sm">Total Clients</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">{dashboardStats.vipClients}</p>
              <p className="text-slate-400 text-sm">VIP Clients</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">₺{dashboardStats.monthEarnings.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
