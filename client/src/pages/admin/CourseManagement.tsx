import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseManagement() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'React Fundamentals',
      instructor: 'Sarah Johnson',
      status: 'pending',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      students: 0,
      date: '2024-03-15'
    },
    {
      id: 2,
      title: 'Advanced TypeScript',
      instructor: 'Mike Chen',
      status: 'approved',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
      students: 289,
      date: '2024-03-10'
    },
    {
      id: 3,
      title: 'Python for Data Science',
      instructor: 'Emma Davis',
      status: 'pending',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
      students: 0,
      date: '2024-03-14'
    },
  ]);

  const approveCourse = (id: number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    toast.success('Course approved');
  };

  const rejectCourse = (id: number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    toast.error('Course rejected');
  };

  const deleteCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id));
    toast.success('Course deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Course Management</h1>
          <p className="text-muted-foreground">Approve, reject, or delete courses</p>
        </div>

        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-32 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {course.date} • {course.students} students
                        </p>
                      </div>
                      <Badge variant={
                        course.status === 'approved' ? 'default' :
                        course.status === 'pending' ? 'secondary' :
                        'destructive'
                      }>
                        {course.status}
                      </Badge>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {course.status === 'pending' && (
                        <>
                          <Button 
                            variant="success"
                            onClick={() => approveCourse(course.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => rejectCourse(course.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="destructive"
                        onClick={() => deleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
