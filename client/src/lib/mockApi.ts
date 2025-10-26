// Mock API utilities for LearnHub
// In production, replace these with actual API calls

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  price: number;
  rating: number;
  students: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  lessons: number;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  isCompleted?: boolean;
  videoUrl?: string;
  content?: string;
}

export const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Complete React Development Bootcamp',
    description: 'Master React from basics to advanced concepts',
    instructor: 'Sarah Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    price: 49.99,
    rating: 4.8,
    students: 15234,
    duration: '12 hours',
    level: 'Intermediate',
    category: 'Web Development',
    lessons: 48,
  },
  {
    id: 2,
    title: 'Python for Data Science & Machine Learning',
    description: 'Complete data science course with Python',
    instructor: 'Mike Chen',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
    price: 59.99,
    rating: 4.9,
    students: 23456,
    duration: '18 hours',
    level: 'Beginner',
    category: 'Data Science',
    lessons: 72,
  },
  {
    id: 3,
    title: 'UI/UX Design Masterclass',
    description: 'Learn professional UI/UX design principles',
    instructor: 'Emma Davis',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    price: 39.99,
    rating: 4.7,
    students: 8901,
    duration: '10 hours',
    level: 'Beginner',
    category: 'Design',
    lessons: 36,
  },
  {
    id: 4,
    title: 'Advanced TypeScript Patterns',
    description: 'Deep dive into TypeScript best practices',
    instructor: 'John Smith',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    price: 44.99,
    rating: 4.6,
    students: 5678,
    duration: '8 hours',
    level: 'Advanced',
    category: 'Programming',
    lessons: 32,
  },
];

export const mockLessons: Lesson[] = [
  {
    id: 1,
    courseId: 1,
    title: 'Introduction to React',
    duration: '15:30',
    type: 'video',
    videoUrl: 'https://example.com/video1.mp4',
  },
  {
    id: 2,
    courseId: 1,
    title: 'Understanding JSX',
    duration: '20:15',
    type: 'video',
    videoUrl: 'https://example.com/video2.mp4',
  },
  {
    id: 3,
    courseId: 1,
    title: 'Components and Props',
    duration: '25:45',
    type: 'video',
    videoUrl: 'https://example.com/video3.mp4',
  },
  {
    id: 4,
    courseId: 1,
    title: 'State Management Quiz',
    duration: '10:00',
    type: 'quiz',
  },
];

export const getCourses = async (): Promise<Course[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCourses;
};

export const getCourseById = async (id: number): Promise<Course | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCourses.find((course) => course.id === id);
};

export const getLessonsByCourseId = async (courseId: number): Promise<Lesson[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockLessons.filter((lesson) => lesson.courseId === courseId);
};

export const searchCourses = async (query: string): Promise<Course[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCourses.filter((course) =>
    course.title.toLowerCase().includes(query.toLowerCase()) ||
    course.description.toLowerCase().includes(query.toLowerCase())
  );
};

export const filterCourses = async (filters: {
  category?: string;
  level?: string;
  priceRange?: string;
}): Promise<Course[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return mockCourses.filter((course) => {
    if (filters.category && filters.category !== 'all' && course.category !== filters.category) {
      return false;
    }
    if (filters.level && filters.level !== 'all' && course.level !== filters.level) {
      return false;
    }
    if (filters.priceRange === 'free' && course.price !== 0) {
      return false;
    }
    if (filters.priceRange === 'paid' && course.price === 0) {
      return false;
    }
    return true;
  });
};
