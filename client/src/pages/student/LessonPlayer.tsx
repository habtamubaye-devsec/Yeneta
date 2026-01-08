import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  FileText,
  PlayCircle,
} from "lucide-react";
import { fetchLessons } from "@/features/lesson/lessonThunks";
import { getCourseById } from "@/features/courses/courseThunks";
import {
  updateLessonProgress,
  fetchMyEnrollments,
} from "@/features/enrollment/enrollmentThunks";
import axios from "axios";

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [canComplete, setCanComplete] = useState(false);
  const maxAllowedTimeRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Redux states
  const {
    selectedCourse: course,
    loading: courseLoading,
    error: courseError,
  } = useSelector((state: RootState) => state.courses);

  const {
    lessons,
    loading: lessonLoading,
    error: lessonError,
  } = useSelector((state: RootState) => state.lessons);

  const lessonsList = (lessons as any[]) || [];
  const courseLessons = ((course as any)?.lessons as any[]) || [];

  // Load course, lessons, and progress
  useEffect(() => {
    if (!courseId) return;

    dispatch(getCourseById(courseId));
    dispatch(fetchLessons(courseId));

    const loadProgress = async () => {
      try {
        const progRes = await axios.get(
          `http://localhost:8000/api/enrollment/${courseId}/progress`,
          { withCredentials: true }
        );
        const completed = progRes.data.data || [];
        setCompletedLessons(completed.map((c: any) => String(c._id ?? c)));
      } catch {
        setCompletedLessons([]);
      }
    };

    loadProgress();
  }, [courseId, dispatch]);

  const loading = courseLoading || lessonLoading;
  const error = courseError || lessonError;

  const currentLessonIndex = useMemo(() => {
    return lessonsList.findIndex(
      (l: any) => String(l._id ?? l.id) === String(lessonId)
    );
  }, [lessonsList, lessonId]);

  const currentLesson =
    currentLessonIndex >= 0 ? lessonsList[currentLessonIndex] : lessonsList[0];

  const activeLessonId = useMemo(() => {
    const fromRoute = lessonId ? String(lessonId) : "";
    if (fromRoute) return fromRoute;
    return String(currentLesson?._id ?? currentLesson?.id ?? "");
  }, [lessonId, currentLesson]);

  // Reset playback guards when switching lessons
  useEffect(() => {
    setCanComplete(false);
    maxAllowedTimeRef.current = 0;

    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
      } catch {
        // ignore
      }
    }
  }, [lessonId]);

  const progress = lessonsList.length
    ? Math.round((completedLessons.length / lessonsList.length) * 100)
    : 0;

  // Video playback handlers
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;

    // Prevent skipping ahead
    if (current > maxAllowedTimeRef.current + 0.5) {
      videoRef.current.currentTime = maxAllowedTimeRef.current;
    } else {
      maxAllowedTimeRef.current = current;
    }
  };

  const handleSeeking = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;

    if (current > maxAllowedTimeRef.current + 0.5) {
      videoRef.current.currentTime = maxAllowedTimeRef.current;
    }
  };

  const handleVideoEnded = () => {
    setCanComplete(true);
  };

  // Mark lesson as complete
  const markComplete = async () => {
    if (!currentLesson || !courseId) return;
    const lessonIdStr = String(currentLesson._id ?? currentLesson.id);
    if (completedLessons.includes(lessonIdStr)) return;

    try {
      await dispatch(
        updateLessonProgress({ courseId, lessonId: lessonIdStr })
      ).unwrap();

      setCompletedLessons((prev) => [...prev, lessonIdStr]);
      dispatch(fetchMyEnrollments());
    } catch (err: any) {
      console.error("❌ Failed to update lesson progress:", err);
      if (err?.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-8">Loading course...</div>
      </DashboardLayout>
    );

  if (error || !course)
    return (
      <DashboardLayout>
        <div className="p-8 text-red-600">{error || "Course not found"}</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col w-full space-y-3">
          <div className="flex items-center justify-between gap-4 w-full">
            <Link to={`/courses/${courseId}`}>
              <Button variant="ghost" className="flex items-center">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
            </Link>

            <div className="flex items-center gap-2 w-full max-w-xs">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {progress}% Complete
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold">{course.title}</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video & Lesson Info */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-0">
                {currentLesson?.videoUrl ? (
                  <video
                    key={String(currentLesson?._id ?? currentLesson?.id)}
                    ref={videoRef}
                    controls
                    className="w-full aspect-video rounded-lg bg-black"
                    onTimeUpdate={handleTimeUpdate}
                    onSeeking={handleSeeking}
                    onEnded={handleVideoEnded}
                  >
                    <source src={currentLesson.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="text-gray-600">Lesson</span>{" "}
                  <span className="text-gray-600">
                    {currentLessonIndex >= 0 ? currentLessonIndex + 1 : 1}:
                  </span>{" "}
                  {currentLesson?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-gray-600">
                    {currentLesson?.description}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Duration:{" "}
                      {currentLesson?.videoDuration
                        ? `${Math.round(currentLesson.videoDuration)} sec`
                        : "N/A"}
                    </span>
                    <Button
                      onClick={markComplete}
                      variant={
                        completedLessons.includes(
                          String(currentLesson?._id ?? currentLesson?.id)
                        )
                          ? "success"
                          : "default"
                      }
                      disabled={
                        !canComplete &&
                        !completedLessons.includes(
                          String(currentLesson?._id ?? currentLesson?.id)
                        )
                      }
                    >
                      {completedLessons.includes(
                        String(currentLesson?._id ?? currentLesson?.id)
                      ) ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : !canComplete ? (
                        "Finish Video to Complete"
                      ) : (
                        "Mark as Complete"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  {currentLessonIndex > 0 && (
                    <Link
                      to={`/courses/${courseId}/lesson/${
                        lessons[currentLessonIndex - 1]._id
                      }`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous Lesson
                      </Button>
                    </Link>
                  )}
                  {currentLessonIndex < lessons.length - 1 && (
                    <Link
                      to={`/courses/${courseId}/lesson/${
                        lessonsList[currentLessonIndex + 1]._id
                      }`}
                      className="flex-1"
                    >
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

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {courseLessons.map((lesson: any, idx: number) => {
                  const lessonIdStr = String(lesson._id ?? lesson.id);
                  const isActive = lessonIdStr === activeLessonId;
                  const isCompleted = completedLessons.includes(lessonIdStr);

                  return (
                  <Link
                    key={lesson._id ?? lesson.id}
                    to={`/courses/${courseId}/lesson/${
                      lesson._id ?? lesson.id
                    }`}
                  >
                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary/10"
                          : "hover:bg-accent"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {lesson.videoUrl ? (
                            <PlayCircle className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={`text-sm font-medium truncate ${isActive ? "text-primary" : ""}`}>
                            Lesson {idx + 1}: {lesson.title}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {lesson.videoDuration
                            ? `${Math.round(lesson.videoDuration)}s`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
