import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Star, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

export default function InstructorDashboard() {
  const stats = [
    { label: 'Total Courses', value: '8', icon: BookOpen, color: 'text-primary', change: '+2 this month' },
    { label: 'Total Students', value: '1,234', icon: Users, color: 'text-secondary', change: '+123 this month' },
    { label: 'Average Rating', value: '4.8', icon: Star, color: 'text-warning', change: '+0.2 this month' },
    { label: 'Revenue', value: '$12,450', icon: DollarSign, color: 'text-success', change: '+15% this month' },
  ];

  const courses = [
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
                  <span className="text-success">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Overview of your top performing courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-smooth">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{course.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        course.status === 'published' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
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
                {['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'].map((name, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2h ago</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Alice Brown', rating: 5, comment: 'Excellent course!' },
                  { name: 'Bob Wilson', rating: 4, comment: 'Very helpful content' },
                  { name: 'Carol Martinez', rating: 5, comment: 'Best instructor!' },
                ].map((review, i) => (
                  <div key={i} className="py-2 border-b last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{review.name}</span>
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
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
