import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Feedback() {
  const reviews = [
    {
      id: 1,
      course: 'React Fundamentals',
      student: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      rating: 5,
      comment: 'Excellent course! Very clear explanations and practical examples. The instructor made complex topics easy to understand.',
      date: '2024-03-15'
    },
    {
      id: 2,
      course: 'Advanced TypeScript',
      student: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      rating: 4,
      comment: 'Great content overall. Would love to see more advanced examples in future updates.',
      date: '2024-03-14'
    },
    {
      id: 3,
      course: 'React Fundamentals',
      student: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      rating: 5,
      comment: 'Best React course I\'ve taken! The projects are very practical and helped me land my dream job.',
      date: '2024-03-13'
    },
  ];

  const discussions = [
    {
      id: 1,
      course: 'React Fundamentals',
      student: 'Alice Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      question: 'How do I properly handle async operations in useEffect?',
      replies: 3,
      date: '2 hours ago'
    },
    {
      id: 2,
      course: 'Advanced TypeScript',
      student: 'Bob Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      question: 'Can you explain the difference between type and interface?',
      replies: 5,
      date: '5 hours ago'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Feedback</h1>
          <p className="text-muted-foreground">Reviews and discussions from your students</p>
        </div>

        <Tabs defaultValue="reviews">
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-4 mt-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback>{review.student[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.student}</h4>
                          <p className="text-sm text-muted-foreground">{review.course}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="discussions" className="space-y-4 mt-6">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-lg transition-smooth cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={discussion.avatar} />
                      <AvatarFallback>{discussion.student[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{discussion.student}</h4>
                          <p className="text-sm text-muted-foreground">{discussion.course}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{discussion.date}</span>
                      </div>
                      <p className="font-medium mb-2">{discussion.question}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.replies} replies</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
