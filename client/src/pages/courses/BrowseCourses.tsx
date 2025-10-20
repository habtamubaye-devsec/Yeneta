import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Input, Select, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { CourseCard } from '@/components/course/CourseCard';

const { Title, Text } = Typography;

export default function BrowseCourses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and more',
      instructor: 'Sarah Johnson',
      category: 'Web Development',
      level: 'Beginner',
      price: 49.99,
      rating: 4.8,
      students: 12345,
      duration: '40 hours',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts and patterns',
      instructor: 'Mike Chen',
      category: 'Frontend',
      level: 'Advanced',
      price: 79.99,
      rating: 4.9,
      students: 8765,
      duration: '25 hours',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      description: 'Create beautiful and intuitive user interfaces',
      instructor: 'Emma Davis',
      category: 'Design',
      level: 'Beginner',
      price: 39.99,
      rating: 4.7,
      students: 6543,
      duration: '30 hours',
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400',
    },
    {
      id: 4,
      title: 'Python for Data Science',
      description: 'Master Python programming for data analysis',
      instructor: 'John Smith',
      category: 'Data Science',
      level: 'Intermediate',
      price: 59.99,
      rating: 4.6,
      students: 9876,
      duration: '35 hours',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    },
    {
      id: 5,
      title: 'Mobile App Development with React Native',
      description: 'Build native mobile apps for iOS and Android',
      instructor: 'Lisa Anderson',
      category: 'Mobile Development',
      level: 'Intermediate',
      price: 69.99,
      rating: 4.8,
      students: 5432,
      duration: '45 hours',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    },
    {
      id: 6,
      title: 'Machine Learning A-Z',
      description: 'Complete hands-on machine learning tutorial',
      instructor: 'David Brown',
      category: 'Data Science',
      level: 'Advanced',
      price: 89.99,
      rating: 4.9,
      students: 11234,
      duration: '50 hours',
      thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Title level={2}>Browse Courses</Title>
          <Text type="secondary">Discover your next learning adventure</Text>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
            />
            
            <Select 
              value={categoryFilter} 
              onChange={setCategoryFilter}
              size="large"
              style={{ width: '100%' }}
            >
              <Select.Option value="all">All Categories</Select.Option>
              <Select.Option value="web">Web Development</Select.Option>
              <Select.Option value="mobile">Mobile Development</Select.Option>
              <Select.Option value="design">Design</Select.Option>
              <Select.Option value="data">Data Science</Select.Option>
            </Select>

            <Select 
              value={levelFilter} 
              onChange={setLevelFilter}
              size="large"
              style={{ width: '100%' }}
            >
              <Select.Option value="all">All Levels</Select.Option>
              <Select.Option value="beginner">Beginner</Select.Option>
              <Select.Option value="intermediate">Intermediate</Select.Option>
              <Select.Option value="advanced">Advanced</Select.Option>
            </Select>

            <Select 
              value={priceFilter} 
              onChange={setPriceFilter}
              size="large"
              style={{ width: '100%' }}
            >
              <Select.Option value="all">All Prices</Select.Option>
              <Select.Option value="free">Free</Select.Option>
              <Select.Option value="paid">Paid</Select.Option>
            </Select>
          </div>
        </Card>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
