import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Reviews() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      courseTitle: 'React Fundamentals',
      rating: 5,
      comment: 'Excellent course! Very clear explanations and practical examples.',
      date: '2024-01-15',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
    },
    {
      id: 2,
      courseTitle: 'Advanced TypeScript',
      rating: 4,
      comment: 'Great content, but could use more advanced examples.',
      date: '2024-02-20',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'
    },
  ]);

  const [editingReview, setEditingReview] = useState<any>(null);

  const deleteReview = (id: number) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
          <p className="text-muted-foreground">Manage your course reviews</p>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <img 
                    src={review.thumbnail} 
                    alt={review.courseTitle}
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{review.courseTitle}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingReview(review)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Review</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Rating</label>
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="h-6 w-6 fill-warning text-warning cursor-pointer" />
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Comment</label>
                                <Textarea defaultValue={review.comment} rows={4} />
                              </div>
                              <Button className="w-full">Update Review</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteReview(review.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reviews.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground">Write reviews for courses you've completed</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
