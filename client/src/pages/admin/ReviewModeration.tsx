import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Trash2, Flag } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewModeration() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      course: 'React Fundamentals',
      student: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      rating: 5,
      comment: 'Excellent course! Very helpful.',
      date: '2024-03-15',
      flagged: false
    },
    {
      id: 2,
      course: 'Advanced TypeScript',
      student: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      rating: 1,
      comment: 'This is inappropriate content that should be removed.',
      date: '2024-03-14',
      flagged: true
    },
  ]);

  const deleteReview = (id: number) => {
    setReviews(reviews.filter(r => r.id !== id));
    toast.success('Review deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Review Moderation</h1>
          <p className="text-muted-foreground">Monitor and moderate course reviews</p>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className={review.flagged ? 'border-destructive' : ''}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback>{review.student[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{review.student}</h4>
                          {review.flagged && (
                            <Flag className="h-4 w-4 text-destructive" />
                          )}
                        </div>
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
                    <p className="text-muted-foreground mb-4">{review.comment}</p>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteReview(review.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
