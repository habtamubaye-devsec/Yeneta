import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, ShoppingCart, DollarSign, TrendingUp, AlertCircle, UserPlus, FileText, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboard } from '@/features/dashboard/dashboardThunks';
import { RootState, AppDispatch } from '@/app/store';

export default function AdminDashboard() {
  // small avatar helper: renders image when available, otherwise initials
  function Avatar({ name, src, size = 36 }: { name?: string; src?: string; size?: number }) {
    const [failed, setFailed] = useState(false);
    const initials = (name || 'U').split(' ').map((p) => p[0] || '').join('').slice(0, 2).toUpperCase();

    if (!src || failed) {
      return (
        <div
          style={{ width: size, height: size }}
          className="rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary"
          aria-hidden
        >
          {initials}
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={name ?? 'User avatar'}
        className="h-9 w-9 rounded-full object-cover"
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    );
  }
  const dispatch = useDispatch<AppDispatch>();
  const { admin, loading } = useSelector((s: RootState) => s.dashboard);

  useEffect(() => {
    // server-side admin dashboards may not exist yet; this will attempt to fetch if available
    dispatch(fetchAdminDashboard());
  }, [dispatch]);
  const statsFromServer = admin || {};
   const stats = [
    { label: 'Total Users', value: String(statsFromServer.totalUsers ?? '12,456'), icon: Users, color: 'bg-blue-100 text-blue-600', change: '+12%' },
    { label: 'Total Courses', value: String(statsFromServer.totalCourses ?? '248'), icon: BookOpen, color: 'bg-purple-100 text-purple-600', change: '+5%' },
    { label: 'Total Enrollments', value: String(statsFromServer.totalEnrollments ?? '45,678'), icon: ShoppingCart, color: 'bg-green-100 text-green-600', change: '+18%' },
    { label: 'Total Revenue', value: typeof statsFromServer.totalRevenue === 'number' ? `$${statsFromServer.totalRevenue}` : String(statsFromServer.totalRevenue ?? '$156,789'), icon: DollarSign, color: 'bg-yellow-100 text-yellow-600', change: '+23%' },
  ];

  const navigate = useNavigate();

  const pendingActions = [
    { type: 'Instructor Request', count: statsFromServer.instructorRequests ?? 0, color: 'bg-warning', icon: UserPlus, route: '/admin/approve-instructor' },
    { type: 'Course Approval', count: statsFromServer.awaitingCourseApproval ?? 0, color: 'bg-primary', icon: FileText, route: '/admin/courses' },
    { type: 'Review Reports', count: statsFromServer.reviewReports ?? 0, color: 'bg-destructive', icon: Star, route: '/admin/reviews' },
  ];

  const recentUsers: { name: string; email: string; role?: string; status?: string; profileImage?: string; createdAt?: string }[] = statsFromServer.recentUsers?.map((u: any) => ({
    name: u.name,
    email: u.email,
    role: u.role,
    profileImage: u.profileImage,
    status: u.status,
    createdAt: u.createdAt,
  })) ?? [
    { name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active', createdAt: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'instructor', status: 'pending', createdAt: '2024-01-14' },
    { name: 'Mike Johnson', email: 'mike@example.com', role: 'student', status: 'active', createdAt: '2024-01-14' },
  ];

  // server-side admin dashboards may not exist — we attempt to fetch via thunk above

  if (loading) return (
    <DashboardLayout>
      <div className="p-8">Loading...</div>
    </DashboardLayout>
  );

  // values are already applied into the stats array above

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
                <div key={action.type} className="p-4 border-2 border-gray-200 shadow rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{action.type}</h3>
                    <Badge className={action.color}>{action.count}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      // route according to action type
                      if (action.type === 'Instructor Request') navigate('/admin/approve-instructor');
                      else if (action.type === 'Course Approval') navigate('/admin/courses');
                      else if (action.type === 'Review Reports') navigate('/admin/reviews');
                      else navigate('/admin');
                    }}
                  >
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
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border-2 border-gray-300 shadow rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => navigate(`/admin/users?q=${encodeURIComponent(user.email || user.name || '')}`)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} src={user.profileImage} size={36} />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'secondary' : 'secondary'}>
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
                {(
                  statsFromServer.platformActivity
                    ? [
                        // Use server totals as the progress max where available
                        { label: 'New Enrollments Today', value: statsFromServer.platformActivity.newEnrollmentsToday ?? 0, max: Math.max(statsFromServer.totalEnrollments ?? 100, statsFromServer.platformActivity.newEnrollmentsToday ?? 100) },
                        { label: 'Active Users (30d)', value: statsFromServer.platformActivity.activeUsers30d ?? 0, max: Math.max(statsFromServer.totalUsers ?? 1000, statsFromServer.platformActivity.activeUsers30d ?? 1000) },
                        { label: 'Course Completions', value: statsFromServer.platformActivity.courseCompletions ?? 0, max: Math.max(statsFromServer.totalEnrollments ?? 50, statsFromServer.platformActivity.courseCompletions ?? 50) },
                      ]
                    : [
                        { label: 'New Enrollments Today', value: 45, max: statsFromServer.totalEnrollments ?? 100 },
                        { label: 'Active Users', value: 1234, max: statsFromServer.totalUsers ?? 2000 },
                        { label: 'Course Completions', value: 23, max: statsFromServer.totalEnrollments ?? 50 },
                      ]
                ).map((item: any, i: number) => (
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
                        style={{ width: `${Math.min(100, Math.round((item.value / (item.max||1)) * 100))}%` }}
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
