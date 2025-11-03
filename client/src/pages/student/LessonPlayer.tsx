import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, FileText, PlayCircle } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

type Lesson = any;
type Course = any;

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        // fetch course
        const courseRes = await axios.get(`http://localhost:8000/api/courses/${courseId}`);
        const fetchedCourse = courseRes.data.data ?? courseRes.data.course ?? courseRes.data;

        // fetch enrollment progress (completed lessons)
        let completed: string[] = [];
        try {
          const progRes = await axios.get(`http://localhost:8000/api/enrollment/${courseId}/progress`, { withCredentials: true });
          completed = progRes.data.data || [];
        } catch (err) {
          // ignore — user might not be enrolled yet or not authenticated
          completed = [];
        }

        if (!mounted) return;
        setCourse(fetchedCourse);
        setCompletedLessons(completed.map((c: any) => c._id ? String(c._id) : String(c)));
      } catch (err: any) {
        console.error('Failed to load course or progress', err);
        if (mounted) setError(err.response?.data?.message || 'Failed to load course');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [courseId]);

  if (loading) return (
    <DashboardLayout>
      <div style={{ padding: 32 }}>Loading course...</div>
    </DashboardLayout>
  );

  if (error || !course) return (
    <DashboardLayout>
      <div style={{ padding: 32, color: 'red' }}>{error || 'Course not found'}</div>
    </DashboardLayout>
  );

  const lessons: Lesson[] = course.lessons || [];
  const currentLessonIndex = lessons.findIndex((l: any) => String(l._id ?? l.id) === String(lessonId));
  const currentLesson: Lesson | undefined = currentLessonIndex >= 0 ? lessons[currentLessonIndex] : lessons[0];
  const progress = lessons.length ? Math.round((completedLessons.length / lessons.length) * 100) : 0;

  const markComplete = async () => {
    if (!currentLesson) return;
    const lessonIdStr = String(currentLesson._id ?? currentLesson.id);
    if (completedLessons.includes(lessonIdStr)) return;

    try {
      await axios.patch(`http://localhost:8000/api/enrollment/${courseId}/progress`, { lessonId: lessonIdStr }, { withCredentials: true });
      setCompletedLessons(prev => [...prev, lessonIdStr]);
    } catch (err: any) {
      console.error('Failed to mark lesson complete', err);
      // If 401, navigate to login
      if (err.response?.status === 401) navigate('/login');
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
