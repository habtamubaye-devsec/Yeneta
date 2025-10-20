import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Progress, Button, Tag } from 'antd';
import { Link } from 'react-router-dom';

export default function MyCourses() {
  const courses = [
    { id: 1, title: 'React Fundamentals', progress: 75, instructor: 'Sarah Johnson', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', status: 'in-progress' },
    { id: 2, title: 'Advanced TypeScript', progress: 45, instructor: 'Mike Chen', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400', status: 'in-progress' },
    { id: 3, title: 'UI/UX Design Principles', progress: 30, instructor: 'Emma Davis', thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400', status: 'in-progress' },
    { id: 4, title: 'JavaScript Basics', progress: 100, instructor: 'John Smith', thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400', status: 'completed' },
    { id: 5, title: 'CSS Mastery', progress: 100, instructor: 'Lisa Anderson', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', status: 'completed' },
  ];

  const inProgress = courses.filter(c => c.status === 'in-progress');
  const completed = courses.filter(c => c.status === 'completed');

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
            {inProgress.map((course) => (
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

        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Completed ({completed.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {completed.map((course) => (
              <Card key={course.id} hoverable cover={<img alt={course.title} src={course.thumbnail} style={{ height: '192px', objectFit: 'cover' }} />}>
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <Card.Meta 
                    title={course.title} 
                    description={course.instructor}
                  />
                  <Tag color="success">Completed</Tag>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/courses/${course.id}`} style={{ flex: 1 }}>
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
