import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Button, Badge, Tabs, Avatar, Typography, Spin, Alert } from 'antd';
import { StarFilled, UserOutlined, ClockCircleOutlined, PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { DiscussionThread } from '@/components/discussion/DiscussionThread';
import { getCourseById } from '@/features/courses/courseThunks';
import { createCheckoutSession, enrollInCourse } from '@/features/enrollment/enrollmentThunks';
import { message } from 'antd';

const { Title, Text, Paragraph } = Typography;

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('overview');

  const { selectedCourse, loading, error } = useSelector((s: RootState) => s.courses as any);

  useEffect(() => {
    if (id) dispatch(getCourseById(id));
  }, [dispatch, id]);

  if (loading) return (
    <DashboardLayout>
      <div style={{ padding: 32 }}>
        <Spin />
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div style={{ padding: 32 }}>
        <Alert type="error" message={String(error)} />
      </div>
    </DashboardLayout>
  );

  const course: any = selectedCourse;

  if (!course) return (
    <DashboardLayout>
      <div style={{ padding: 32 }}>
        <Text>Course not found.</Text>
      </div>
    </DashboardLayout>
  );

  const lessons = Array.isArray(course.lessons) ? course.lessons : [];

  const handleBuy = async () => {
    if (!course) return;
    try {
      // free course -> enroll directly
      if (!course.price || Number(course.price) === 0) {
        await dispatch(enrollInCourse(course._id)).unwrap();
        message.success('Enrolled successfully');
        return;
      }

      const url = await dispatch(createCheckoutSession(course._id)).unwrap();
      if (url) {
        // redirect to stripe checkout
        window.location.href = url;
      }
    } catch (err: any) {
      console.error('Checkout/enroll error', err);
      message.error(err?.message || String(err) || 'Payment failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="relative h-80 rounded-lg overflow-hidden">
          <img 
            src={course.thumbnailUrl || course.thumbnail || '/placeholder.png'}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-background/20" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge count={course.category?.name || course.category} style={{ background: 'hsl(221 83% 53%)' }} className="mb-4" />
            <Title level={1} style={{ color: 'white', marginBottom: 8 }}>{course.title}</Title>
            <Paragraph style={{ color: 'white', fontSize: 16, marginBottom: 16 }}>{course.description}</Paragraph>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1" style={{ color: 'white' }}>
                <StarFilled style={{ color: '#faad14' }} />
                <span className="font-medium">{course.rating || 0}</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: 'white' }}>
                <UserOutlined />
                <span>{(course.students && course.students.length) ?? course.enrolledCount ?? 0} students</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: 'white' }}>
                <ClockCircleOutlined />
                <span>{course.duration || '0h'}</span>
              </div>
              <Badge count={course.level || 'Beginner'} style={{ background: 'transparent', border: '1px solid white' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'overview',
                  label: 'Overview',
                  children: (
                    <div className="space-y-4">
                      <Card>
                        <Title level={4}>What you'll learn</Title>
                        <ul className="space-y-2 mt-4">
                          {(course.whatYouWillLearn || []).map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <TrophyOutlined style={{ color: 'hsl(142 76% 36%)', marginTop: 4 }} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>

                      <Card>
                        <Title level={4}>About the instructor</Title>
                        <div className="flex items-start gap-4 mt-4">
                          <Avatar size={64} src={course.instructor?.avatar || course.instructor?.photo} />
                          <div>
                            <Title level={5} style={{ marginBottom: 4 }}>{course.instructor?.name || 'Instructor'}</Title>
                            <Text type="secondary">{course.instructor?.title}</Text>
                            <Paragraph style={{ marginTop: 8 }}>{course.instructor?.bio}</Paragraph>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ),
                },
                {
                  key: 'curriculum',
                  label: 'Curriculum',
                  children: (
                    <Card>
                      <Title level={4}>Course Curriculum</Title>
                      <div className="space-y-2 mt-4">
                        {lessons.map((lesson: any, i: number) => (
                          <div 
                            key={lesson._id || lesson.id || i}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-smooth"
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                                style={{ background: 'hsla(221, 83%, 53%, 0.2)', color: 'hsl(221 83% 53%)' }}
                              >
                                {i + 1}
                              </div>
                              <div>
                                <Text strong>{lesson.title}</Text>
                                <div className="flex items-center gap-2 text-sm">
                                  <PlayCircleOutlined />
                                  <Text type="secondary">{lesson.duration || '0:00'}</Text>
                                  {lesson.free && <Badge count="Free" style={{ background: 'hsl(215 28% 17%)' }} />}
                                </div>
                              </div>
                            </div>
                            {lesson.free && (
                              <Button type="text" size="small">Preview</Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ),
                },
                {
                  key: 'discussion',
                  label: 'Discussion',
                  children: <DiscussionThread courseId={course._id || id} />,
                },
              ]}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <div className="text-center">
                <Title level={2} style={{ color: 'hsl(221 83% 53%)', marginBottom: 8 }}>
                  ${course.price ?? 0}
                </Title>
                <Text type="secondary">One-time purchase</Text>
              </div>
              
              <div className="mt-4">
                {course.enrolled ? (
                  <Button type="primary" block size="large">Continue Learning</Button>
                ) : (
                  <Button type="primary" block size="large" onClick={handleBuy}>Buy Now</Button>
                )}
              </div>
              
              <div className="pt-4 mt-4 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Lessons</Text>
                  <Text strong>{lessons.length}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Duration</Text>
                  <Text strong>{course.duration || '0h'}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Level</Text>
                  <Text strong>{course.level || 'Beginner'}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Certificate</Text>
                  <Text strong>{course.certificate ? 'Yes' : 'Yes'}</Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
