import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { BookOpen, Users, Star, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructorDashboard } from '@/features/dashboard/dashboardThunks';
import type { RootState, AppDispatch } from '@/app/store';

export default function InstructorDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { instructor, loading } = useSelector((s: RootState) => s.dashboard);

  useEffect(() => {
    dispatch(fetchInstructorDashboard());
  }, [dispatch]);
  const colorClasses: Record<string, string> = {
    primary: 'text-blue-500',
    secondary: 'text-purple-500',
    warning: 'text-yellow-400',
    success: 'text-green-500',
  };

  // derive stats from the server-provided instructor summary (fallback to defaults)
  const [stats] = useState(() => [
    { label: 'Total Courses', value: '0', icon: BookOpen, color: 'primary', change: '' },
    { label: 'Total Students', value: '0', icon: Users, color: 'secondary', change: '' },
    { label: 'Average Rating', value: '0.0', icon: Star, color: 'warning', change: '' },
    { label: 'Revenue', value: '$0', icon: DollarSign, color: 'success', change: '' },
  ]);

  // Prefer course summaries from server; fallback to sample demo data
  const courses = (instructor?.topCourses && instructor.topCourses.length)
    ? instructor.topCourses
    : [
      {
        id: 1,
        title: 'React Fundamentals',
        students: 456,
        rating: 4.9,
        revenue: '$4,560',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        status: 'published'
      },
      {
        id: 2,
        title: 'Advanced TypeScript',
        students: 289,
        rating: 4.7,
        revenue: '$2,890',
        thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
        status: 'published'
      },
      {
        id: 3,
        title: 'Node.js Masterclass',
        students: 234,
        rating: 4.8,
        revenue: '$2,340',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
        status: 'draft'
      },
    ];

  const statusClasses: Record<string, string> = {
    published: 'bg-green-100 text-green-600',
    draft: 'bg-yellow-100 text-yellow-600',
  };

  // instructor dashboard is loaded via Redux thunk (fetchInstructorDashboard)

  if (loading) return (
    <DashboardLayout>
      <div className="p-8">Loading...</div>
    </DashboardLayout>
  );

  // use the instructor payload (numbers are provided by server)
  // const totalCourses = instructor?.totalCourses ?? Number(stats[0].value);
  // const studentsCount = instructor?.studentsCount ?? Number(stats[1].value);
  // const totalReviews = instructor?.totalReviews ?? stats[2].value;
  // const totalEarnings = instructor?.totalEarnings ?? stats[3].value;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses and track performance</p>
          </div>
          <Link to="/instructor/create-course">
            <Button size="lg">
              <BookOpen className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, _idx) => {
            // pick values from backend if available
            let displayValue = stat.value;
            if (instructor) {
              if (stat.label === 'Total Courses') displayValue = String(instructor.totalCourses ?? stat.value);
              if (stat.label === 'Total Students') displayValue = String(instructor.studentsCount ?? stat.value);
              if (stat.label === 'Average Rating') displayValue = String(instructor.avgRating ?? stat.value);
              if (stat.label === 'Revenue') displayValue = typeof instructor.totalEarnings === 'number' ? `$${instructor.totalEarnings}` : stat.value;
            }
            return (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{displayValue}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${colorClasses[stat.color]}`} />
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className={`h-4 w-4 mr-1 ${colorClasses.success}`} />
                    <span className={`text-sm ${colorClasses.success}`}>{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Overview of your top performing courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course: any) => (
                <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-smooth">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{course.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${statusClasses[course.status]}`}>
                        {course.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {course.revenue}
                      </span>
                    </div>
                  </div>
                  <Link to={`/instructor/courses/${course.id}`}>
                    <Button variant="outline">Manage</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(instructor?.recentEnrollments && instructor.recentEnrollments.length)
                  ? instructor.recentEnrollments.map((enroll: any) => (
                    <div key={enroll._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="font-medium">{enroll.user?.name || 'Student'}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{new Date(enroll.createdAt).toLocaleString()}</span>
                    </div>
                  )) : (
                    <div className="text-sm text-muted-foreground">No recent enrollments</div>
                  )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(instructor?.recentReviews && instructor.recentReviews.length)
                  ? instructor.recentReviews.map((review: any) => (
                    <div key={review._id} className="py-2 border-b last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{review.user?.name || 'Learner'}</span>
                        <div className="flex">
                          {Array.from({ length: Math.max(0, Math.min(5, Math.round(review.rating || 0))) }).map((_, j) => (
                            <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment || ''}</p>
                    </div>
                  )) : (
                    <div className="text-sm text-muted-foreground">No recent reviews</div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}


