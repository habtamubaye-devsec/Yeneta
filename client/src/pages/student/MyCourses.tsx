import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Progress, Button, Tag, Spin, Empty } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8000/api/enrollment/my', { withCredentials: true });
        if (!mounted) return;
        setEnrollments(res.data.data || []);
      } catch (err: any) {
        console.error('Failed to fetch enrollments', err);
        setError(err.response?.data?.message || 'Failed to load enrollments');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div style={{ padding: 32, textAlign: 'center' }}><Spin /></div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div style={{ padding: 32 }}><p style={{ color: 'red' }}>{error}</p></div>
    </DashboardLayout>
  );

  if (!enrollments.length) return (
    <DashboardLayout>
      <div style={{ padding: 32 }}><Empty description="You have no courses yet" /></div>
    </DashboardLayout>
  );

  // Map enrollments to courses and progress
  const mapped = enrollments.map((e) => {
    const course = e.course || e.courseId || {};
    const lessonsCount = (course.lessons && course.lessons.length) || 0;
    const completed = (e.completedLessons && e.completedLessons.length) || 0;
    const progress = lessonsCount ? Math.round((completed / lessonsCount) * 100) : 0;
    return { enrollment: e, course, progress };
  });

  const inProgress = mapped.filter(m => m.progress < 100);
  const completed = mapped.filter(m => m.progress >= 100);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>My Courses</h1>
          <p style={{ color: 'hsl(215 16% 47%)' }}>Track your learning progress</p>
        </div>

        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>In Progress ({inProgress.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {inProgress.map(({ course, progress }) => (
              <Card key={course._id || course.id} hoverable cover={<img alt={course.title} src={course.thumbnailUrl || course.thumbnail || ''} style={{ height: '192px', objectFit: 'cover' }} />}>
                <Card.Meta 
                  title={course.title} 
                  description={course.instructor?.name || course.instructor || ''}
                  style={{ marginBottom: '16px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                  <span style={{ color: 'hsl(215 16% 47%)' }}>Progress</span>
                  <span style={{ fontWeight: 500 }}>{progress}%</span>
                </div>
                <Progress percent={progress} size="small" />
                <div style={{ marginTop: 16 }}>
                  {course.lessons && course.lessons.length > 0 ? (
                    <Button type="primary" block onClick={() => navigate(`/courses/${course._id || course.id}/lesson/${course.lessons[0]._id || course.lessons[0].id}`)}>Continue Learning</Button>
                  ) : (
                    <Link to={`/courses/${course._id || course.id}`}>
                      <Button type="primary" block>View Course</Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Completed ({completed.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {completed.map(({ course }) => (
              <Card key={course._id || course.id} hoverable cover={<img alt={course.title} src={course.thumbnailUrl || course.thumbnail || ''} style={{ height: '192px', objectFit: 'cover' }} />}>
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <Card.Meta 
                    title={course.title} 
                    description={course.instructor?.name || course.instructor || ''}
                  />
                  <Tag color="success">Completed</Tag>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/courses/${course._id || course.id}`} style={{ flex: 1 }}>
                    <Button block>Review</Button>
                  </Link>
                  <Link to="/student/certificates" style={{ flex: 1 }}>
                    <Button type="primary" block>Certificate</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
