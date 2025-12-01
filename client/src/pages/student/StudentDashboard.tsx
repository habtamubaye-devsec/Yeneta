import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Progress, Button, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { fetchMyEnrollments } from '@/features/enrollment/enrollmentThunks';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentDashboard } from '@/features/dashboard/dashboardThunks';
import { RootState, AppDispatch } from '@/app/store';
import { BookOutlined, TrophyOutlined, ClockCircleOutlined, RiseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { student, loading } = useSelector((s: RootState) => s.dashboard);

  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const { enrollments } = useSelector((s: RootState) => s.enrollment);

  useEffect(() => {
    // Fetch dashboard summary from backend
    dispatch(fetchStudentDashboard());

    // keep local enrolledCourses fallback as before; we'll prefer server enrollments when available
    setEnrolledCourses([
      { id: 1, title: 'React Fundamentals', progress: 75, instructor: 'Sarah Johnson', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400' },
      { id: 2, title: 'Advanced TypeScript', progress: 45, instructor: 'Mike Chen', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400' },
      { id: 3, title: 'UI/UX Design Principles', progress: 30, instructor: 'Emma Davis', thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400' },
    ]);
    // load enrollments for rendering enrolled courses
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  // when enrollments arrive from store, map them to UI cards
  useEffect(() => {
    if (!enrollments || enrollments.length === 0) return;
    const mapped = enrollments.map((e: any) => ({
      // prefer the course id for links; fallback to enrollment id
      id: e.course?._id ?? e.course?._id ?? e._id,
      title: e.course?.title ?? e.course?.name ?? 'Untitled',
      instructor: e.course?.instructor?.name ?? e.course?.instructor ?? 'Unknown',
      thumbnail: e.course?.thumbnailUrl ?? e.course?.thumbnail ?? undefined,
      progress: typeof e.progress === 'number' ? e.progress : (e.progress ?? 0),
      courseId: e.course?._id ?? e.course,
    }));
    setEnrolledCourses(mapped);
  }, [enrollments]);

  const enrolledCoursesFallback = [
    { id: 1, title: 'React Fundamentals', progress: 75, instructor: 'Sarah Johnson', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400' },
    { id: 2, title: 'Advanced TypeScript', progress: 45, instructor: 'Mike Chen', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400' },
    { id: 3, title: 'UI/UX Design Principles', progress: 30, instructor: 'Emma Davis', thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400' },
  ];

  const [stats, setStats] = useState(() => [
    { label: 'Enrolled Courses', value: '3', icon: <BookOutlined style={{ fontSize: '32px', color: 'hsl(221 83% 53%)' }} /> },
    { label: 'Completed Courses', value: '0', icon: <TrophyOutlined style={{ fontSize: '32px', color: 'hsl(142 71% 45%)' }} /> },
    { label: 'Total Spend', value: '$0', icon: <ClockCircleOutlined style={{ fontSize: '32px', color: 'hsl(262 52% 47%)' }} /> },
    { label: 'Current Streak', value: '7 days', icon: <RiseOutlined style={{ fontSize: '32px', color: 'hsl(38 92% 50%)' }} /> },
  ])

  // update stats when server student summary arrives
  useEffect(() => {
    if (!student) return;
    setStats((prev) => [
      { ...prev[0], value: String(student.enrollmentCount ?? prev[0].value) },
      { ...prev[1], value: String(student.completedCourse ?? prev[1].value) },
      { ...prev[2], value: typeof student.totalSpendMoney === 'number' ? `$${student.totalSpendMoney}` : String(student.totalSpendMoney ?? prev[2].value) },
      prev[3],
    ]);
  }, [student]);

  if (loading) return (
    <DashboardLayout>
      <div style={{ padding: 32, textAlign: 'center' }}><Spin /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>Welcome back!</h1>
          <p style={{ color: 'hsl(215 16% 47%)' }}>Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: 'hsl(215 16% 47%)', marginBottom: '8px' }}>{stat.label}</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </Card>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Continue Learning</h2>
            <Link to="/student/my-courses">
              <Button type="text">View All</Button>
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {(enrolledCourses.length ? enrolledCourses : enrolledCoursesFallback).map((course) => (
              <Card key={course.id} hoverable cover={<img alt={course.title} src={course.thumbnail} style={{ height: '192px', objectFit: 'cover' }} />}>
                <Card.Meta 
                  title={course.title} 
                  description={course.instructor}
                  style={{ marginBottom: '16px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                  <span style={{ color: 'hsl(215 16% 47%)' }}>Progress</span>
                  <span style={{ fontWeight: 500 }}>{course.progress}%</span>
                </div>
                <Progress percent={course.progress} size="small" />
                <Link to={`/courses/${course.id}`}>
                  <Button type="primary" block style={{ marginTop: '16px' }}>Continue Learning</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Recommended for You</h2>
          <Card style={{ background: 'linear-gradient(to bottom right, hsl(0 0% 100%), hsl(221 83% 98%))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>Master Full-Stack Development</h3>
                <p style={{ color: 'hsl(215 16% 47%)', marginBottom: '16px' }}>
                  Learn the complete web development stack with hands-on projects
                </p>
                <Link to="/courses">
                  <Button type="primary">Explore Courses</Button>
                </Link>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300" 
                alt="Coding"
                style={{ width: '192px', height: '128px', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
              />
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
