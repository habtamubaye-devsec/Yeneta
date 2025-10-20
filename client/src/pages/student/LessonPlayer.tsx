import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, FileText, PlayCircle } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2]);

  const course = {
    id: courseId,
    title: 'React Fundamentals',
    lessons: [
      { id: 1, title: 'Introduction to React', type: 'video', duration: '15:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'JSX and Components', type: 'video', duration: '20:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, title: 'Props and State', type: 'video', duration: '18:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 4, title: 'Hooks Overview', type: 'article', duration: '10 min read' },
      { id: 5, title: 'Building a Todo App', type: 'video', duration: '25:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ]
  };

  const currentLessonIndex = course.lessons.findIndex(l => l.id === Number(lessonId));
  const currentLesson = course.lessons[currentLessonIndex];
  const progress = (completedLessons.length / course.lessons.length) * 100;

  const markComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={`/courses/${courseId}`}>
            <Button variant="ghost">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={progress} className="h-2 flex-1 max-w-xs" />
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-0">
                {currentLesson.type === 'video' ? (
                  <div className="aspect-video bg-black">
                    <iframe
                      src={currentLesson.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{currentLesson.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration: {currentLesson.duration}</span>
                  <Button 
                    onClick={markComplete}
                    variant={completedLessons.includes(currentLesson.id) ? 'success' : 'default'}
                  >
                    {completedLessons.includes(currentLesson.id) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      'Mark as Complete'
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  {currentLessonIndex > 0 && (
                    <Link to={`/courses/${courseId}/lesson/${course.lessons[currentLessonIndex - 1].id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous Lesson
                      </Button>
                    </Link>
                  )}
                  {currentLessonIndex < course.lessons.length - 1 && (
                    <Link to={`/courses/${courseId}/lesson/${course.lessons[currentLessonIndex + 1].id}`} className="flex-1">
                      <Button className="w-full">
                        Next Lesson
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson List Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <Link key={lesson.id} to={`/courses/${courseId}/lesson/${lesson.id}`}>
                    <div className={`flex items-start gap-3 p-3 rounded-lg transition-smooth ${
                      lesson.id === currentLesson.id ? 'bg-primary/10' : 'hover:bg-accent'
                    }`}>
                      {completedLessons.includes(lesson.id) ? (
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {lesson.type === 'video' ? (
                            <PlayCircle className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium truncate">{lesson.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{lesson.duration}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
