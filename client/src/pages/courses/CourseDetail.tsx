import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Button, Badge, Tabs, Avatar, Typography } from 'antd';
import { StarFilled, UserOutlined, ClockCircleOutlined, PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { DiscussionThread } from '@/components/discussion/DiscussionThread';

const { Title, Text, Paragraph } = Typography;

export default function CourseDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const course = {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and everything you need to become a professional web developer',
    instructor: {
      name: 'Sarah Johnson',
      title: 'Senior Web Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      bio: '10+ years of experience in web development. Taught over 50,000 students.',
    },
    category: 'Web Development',
    level: 'Beginner',
    price: 49.99,
    rating: 4.8,
    students: 12345,
    duration: '40 hours',
    lessons: 156,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    enrolled: false,
  };

  const lessons = [
    { id: 1, title: 'Introduction to Web Development', duration: '15:30', type: 'video', free: true },
    { id: 2, title: 'Setting Up Your Development Environment', duration: '22:45', type: 'video', free: true },
    { id: 3, title: 'HTML Fundamentals', duration: '35:20', type: 'video', free: false },
    { id: 4, title: 'CSS Styling Basics', duration: '42:15', type: 'video', free: false },
    { id: 5, title: 'JavaScript Introduction', duration: '38:50', type: 'video', free: false },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="relative h-80 rounded-lg overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-background/20" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge count={course.category} style={{ background: 'hsl(221 83% 53%)' }} className="mb-4" />
            <Title level={1} style={{ color: 'white', marginBottom: 8 }}>{course.title}</Title>
            <Paragraph style={{ color: 'white', fontSize: 16, marginBottom: 16 }}>{course.description}</Paragraph>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1" style={{ color: 'white' }}>
                <StarFilled style={{ color: '#faad14' }} />
                <span className="font-medium">{course.rating}</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: 'white' }}>
                <UserOutlined />
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: 'white' }}>
                <ClockCircleOutlined />
                <span>{course.duration}</span>
              </div>
              <Badge count={course.level} style={{ background: 'transparent', border: '1px solid white' }} />
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
                          {[
                            'Build responsive websites with HTML, CSS, and JavaScript',
                            'Master modern React and component-based development',
                            'Create full-stack applications with Node.js and Express',
                            'Work with databases and REST APIs',
                            'Deploy your applications to production',
                          ].map((item, i) => (
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
                          <Avatar size={64} src={course.instructor.avatar} />
                          <div>
                            <Title level={5} style={{ marginBottom: 4 }}>{course.instructor.name}</Title>
                            <Text type="secondary">{course.instructor.title}</Text>
                            <Paragraph style={{ marginTop: 8 }}>{course.instructor.bio}</Paragraph>
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
                        {lessons.map((lesson, i) => (
                          <div 
                            key={lesson.id}
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
                                  <Text type="secondary">{lesson.duration}</Text>
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
                  children: <DiscussionThread courseId={Number(id)} />,
                },
              ]}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <div className="text-center">
                <Title level={2} style={{ color: 'hsl(221 83% 53%)', marginBottom: 8 }}>
                  ${course.price}
                </Title>
                <Text type="secondary">One-time purchase</Text>
              </div>
              
              <div className="mt-4">
                {course.enrolled ? (
                  <Button type="primary" block size="large">Continue Learning</Button>
                ) : (
                  <Button type="primary" block size="large">Buy Now</Button>
                )}
              </div>
              
              <div className="pt-4 mt-4 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Lessons</Text>
                  <Text strong>{course.lessons}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Duration</Text>
                  <Text strong>{course.duration}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Level</Text>
                  <Text strong>{course.level}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Certificate</Text>
                  <Text strong>Yes</Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
