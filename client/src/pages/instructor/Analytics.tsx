import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, DollarSign, Star, BookOpen, Clock } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructorDashboard } from '@/features/dashboard/dashboardThunks';
import type { AppDispatch, RootState } from '@/app/store';

export default function Analytics() {
  const dispatch = useDispatch<AppDispatch>();
  const { instructor, loading } = useSelector((s: RootState) => s.dashboard);

  useEffect(() => {
    dispatch(fetchInstructorDashboard());
  }, [dispatch]);

  const formatMoney = (value: unknown) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return '$0';
    return `$${n.toLocaleString()}`;
  };

  const stats = useMemo(
    () => [
      {
        title: 'Total Students',
        value: String(instructor?.studentsCount ?? '0'),
        change: '',
        icon: Users,
        trend: 'up',
      },
      {
        title: 'Total Revenue',
        value: formatMoney(instructor?.totalEarnings ?? 0),
        change: '',
        icon: DollarSign,
        trend: 'up',
      },
      {
        title: 'Average Rating',
        value: String(instructor?.avgRating ?? '0.0'),
        change: '',
        icon: Star,
        trend: 'up',
      },
      {
        title: 'Active Courses',
        value: String(instructor?.totalCourses ?? '0'),
        change: '',
        icon: BookOpen,
        trend: 'up',
      },
    ],
    [instructor]
  );

  const fallbackEnrollmentData = [
    { month: 'Jan', students: 45 },
    { month: 'Feb', students: 52 },
    { month: 'Mar', students: 68 },
    { month: 'Apr', students: 85 },
    { month: 'May', students: 92 },
    { month: 'Jun', students: 110 },
  ];

  const fallbackRevenueData = [
    { month: 'Jan', revenue: 4500 },
    { month: 'Feb', revenue: 5200 },
    { month: 'Mar', revenue: 6800 },
    { month: 'Apr', revenue: 8500 },
    { month: 'May', revenue: 9200 },
    { month: 'Jun', revenue: 11000 },
  ];

  const fallbackCourseDistribution = [
    { name: 'React Fundamentals', value: 450, color: 'hsl(var(--primary))' },
    { name: 'Advanced TypeScript', value: 320, color: 'hsl(var(--secondary))' },
    { name: 'Node.js Basics', value: 280, color: 'hsl(var(--accent))' },
    { name: 'UI/UX Design', value: 184, color: 'hsl(var(--muted))' },
  ];

  const enrollmentData = (Array.isArray(instructor?.enrollmentByMonth) && instructor.enrollmentByMonth.length)
    ? instructor.enrollmentByMonth
    : fallbackEnrollmentData;

  const revenueData = (Array.isArray(instructor?.revenueByMonth) && instructor.revenueByMonth.length)
    ? instructor.revenueByMonth
    : fallbackRevenueData;

  const coursePerformance = (Array.isArray(instructor?.courseDistribution) && instructor.courseDistribution.length)
    ? instructor.courseDistribution
    : fallbackCourseDistribution;

  const topCourses = (Array.isArray(instructor?.topCourses) && instructor.topCourses.length)
    ? instructor.topCourses
    : [
      { title: 'React Fundamentals', students: 450, rating: 4.8, revenue: '$22,500', completion: 85 },
      { title: 'Advanced TypeScript', students: 320, rating: 4.9, revenue: '$19,200', completion: 78 },
      { title: 'Node.js Basics', students: 280, rating: 4.7, revenue: '$14,000', completion: 82 },
    ];

  const recentActivity = useMemo(() => {
    const activity: Array<{ action: string; course: string; student: string; time: string }> = [];

    const enrolls = Array.isArray(instructor?.recentEnrollments) ? instructor.recentEnrollments : [];
    for (const e of enrolls) {
      activity.push({
        action: 'New enrollment',
        course: e?.course?.title || 'Course',
        student: e?.user?.name || 'Student',
        time: e?.createdAt ? new Date(e.createdAt).toLocaleString() : '',
      });
    }

    const reviews = Array.isArray(instructor?.recentReviews) ? instructor.recentReviews : [];
    for (const r of reviews) {
      const rating = Number(r?.rating);
      const stars = Number.isFinite(rating) ? Math.max(0, Math.min(5, Math.round(rating))) : 0;
      activity.push({
        action: `New review (${stars} stars)`,
        course: r?.course?.title || 'Course',
        student: r?.user?.name || 'Learner',
        time: r?.createdAt ? new Date(r.createdAt).toLocaleString() : '',
      });
    }

    return activity.slice(0, 6);
  }, [instructor]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your teaching performance and insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                  {stat.change ? (
                    <span className="text-success text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {stat.change}
                    </span>
                  ) : null}
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading analytics…</div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Enrollment Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="students" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Student Distribution by Course</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={coursePerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const name = String(props?.name ?? '');
                      const percent = Number(props?.percent ?? 0);
                      return `${name}: ${(percent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {coursePerformance.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performing Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCourses.map((course: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {course.students}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {course.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{course.revenue}</div>
                        <div className="text-sm text-muted-foreground">{course.completion}% completion</div>
                      </div>
                    </div>
                    {i < topCourses.length - 1 && <div className="border-t" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(recentActivity.length ? recentActivity : [
                { action: 'New enrollment', course: 'React Fundamentals', student: 'John Doe', time: '5 minutes ago' },
                { action: 'Course completed', course: 'Advanced TypeScript', student: 'Jane Smith', time: '1 hour ago' },
                { action: 'New review (5 stars)', course: 'React Fundamentals', student: 'Mike Johnson', time: '2 hours ago' },
                { action: 'New enrollment', course: 'Node.js Basics', student: 'Sarah Williams', time: '3 hours ago' },
              ]).map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.course} • {activity.student}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
