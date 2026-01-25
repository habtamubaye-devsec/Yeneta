import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Settings, Activity, Server, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuperAdminDashboard } from '@/features/dashboard/dashboardThunks';
import type { RootState, AppDispatch } from '@/app/store';
// axios fetch removed — we use the dashboard thunk (fetchSuperAdminDashboard)

export default function SuperAdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { superAdmin, loading } = useSelector((s: RootState) => s.dashboard);

  useEffect(() => {
    dispatch(fetchSuperAdminDashboard());
  }, [dispatch]);

  const systemData = superAdmin || {};

  const systemStats = [
    { label: 'System Status', value: systemData.systemStatus ?? 'Operational', icon: Server, color: 'text-success', status: 'success' },
    { label: 'Database Size', value: systemData.databaseSize ?? '24.5 GB', icon: Database, color: 'text-primary', status: 'info' },
    { label: 'Active Sessions', value: systemData.activeSessions ?? '1,234', icon: Activity, color: 'text-warning', status: 'warning' },
    { label: 'Security Alerts', value: systemData.securityAlerts ?? '0', icon: Shield, color: 'text-destructive', status: 'success' },
  ];

  const systemHealth = systemData.systemHealth ?? [
    { name: 'API Response Time', value: '125ms', status: 'good', percentage: 95 },
    { name: 'Database Load', value: '34%', status: 'good', percentage: 34 },
    { name: 'Storage Usage', value: '67%', status: 'warning', percentage: 67 },
    { name: 'CPU Usage', value: '42%', status: 'good', percentage: 42 },
  ];

  const recentActions = systemData.recentActions ?? [
    { action: 'User role updated', user: 'admin@learnhub.com', time: '5 minutes ago', type: 'info' },
    { action: 'System backup completed', user: 'System', time: '1 hour ago', type: 'success' },
    { action: 'Failed login attempt', user: 'unknown@email.com', time: '2 hours ago', type: 'warning' },
    { action: 'Database optimized', user: 'System', time: '3 hours ago', type: 'success' },
  ];

  // const [roleCounts, setRoleCounts] = useState<any[]>([]);

  // useEffect(() => {
  //   if (superAdmin?.roleCounts) setRoleCounts(superAdmin.roleCounts || []);
  // }, [superAdmin]);

  if (loading) return (
    <DashboardLayout>
      <div className="p-8">Loading...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">System administration and oversight</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats.map((stat) => (
            <Card key={stat.label} className={stat.status === 'warning' ? 'border-warning' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time system performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((metric: any) => (
                <div key={metric.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <span className="text-sm">
                      <Badge variant={metric.status === 'good' ? 'default' : 'secondary'}>
                        {metric.value}
                      </Badge>
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${metric.status === 'good' ? 'bg-success' : 'bg-warning'
                        }`}
                      style={{ width: `${metric.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>System management tools</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Database className="h-5 w-5" />
                <span className="text-xs">Backup Database</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Settings className="h-5 w-5" />
                <span className="text-xs">System Settings</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-xs">Security Scan</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Activity className="h-5 w-5" />
                <span className="text-xs">View Logs</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
              <CardDescription>Latest administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActions.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${item.type === 'success' ? 'bg-success/20' :
                      item.type === 'warning' ? 'bg-warning/20' :
                        'bg-primary/20'
                      }`}>
                      {item.type === 'success' ? <Shield className="h-4 w-4 text-success" /> :
                        item.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-warning" /> :
                          <Activity className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {item.time}
                    </span>
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
