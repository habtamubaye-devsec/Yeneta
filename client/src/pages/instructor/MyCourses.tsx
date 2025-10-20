import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Star, Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function MyCourses() {
  const courses = [
    {
      id: 1,
      title: 'React Fundamentals',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      students: 456,
      rating: 4.9,
      status: 'published',
      lessons: 24,
      revenue: '$4,560'
    },
    {
      id: 2,
      title: 'Advanced TypeScript',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
      students: 289,
      rating: 4.7,
      status: 'published',
      lessons: 18,
      revenue: '$2,890'
    },
    {
      id: 3,
      title: 'Node.js Masterclass',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
      students: 0,
      rating: 0,
      status: 'draft',
      lessons: 12,
      revenue: '$0'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground">Manage all your courses</p>
          </div>
          <Link to="/instructor/create-course">
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <div className="flex gap-4 p-6">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-32 h-24 object-cover rounded"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{course.title}</h3>
                      <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                        {course.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students} students
                    </span>
                    {course.status === 'published' && (
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        {course.rating}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Link to={`/instructor/courses/${course.id}/lessons`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Manage Lessons
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
