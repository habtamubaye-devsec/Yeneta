import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '12,456', icon: Users, color: 'text-primary', change: '+12%' },
    { label: 'Total Courses', value: '248', icon: BookOpen, color: 'text-secondary', change: '+5%' },
    { label: 'Total Enrollments', value: '45,678', icon: ShoppingCart, color: 'text-success', change: '+18%' },
    { label: 'Total Revenue', value: '$156,789', icon: DollarSign, color: 'text-warning', change: '+23%' },
  ];

  const pendingActions = [
    { type: 'Instructor Request', count: 12, color: 'bg-warning' },
    { type: 'Course Approval', count: 8, color: 'bg-primary' },
    { type: 'Review Reports', count: 5, color: 'bg-destructive' },
  ];

  const recentUsers = [
    { name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active', date: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'instructor', status: 'pending', date: '2024-01-14' },
    { name: 'Mike Johnson', email: 'mike@example.com', role: 'student', status: 'active', date: '2024-01-14' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <span className="text-success">{stat.change} from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Actions */}
        <Card className="border-warning">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <CardTitle>Pending Actions</CardTitle>
            </div>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingActions.map((action) => (
                <div key={action.type} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{action.type}</h3>
                    <Badge className={action.color}>{action.count}</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'New Enrollments Today', value: 45, max: 100 },
                  { label: 'Active Users', value: 1234, max: 2000 },
                  { label: 'Course Completions', value: 23, max: 50 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.value} / {item.max}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(item.value / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
