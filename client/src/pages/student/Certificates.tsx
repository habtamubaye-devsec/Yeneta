import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Share2 } from 'lucide-react';

export default function Certificates() {
  const certificates = [
    {
      id: 1,
      courseTitle: 'Full Stack Web Development',
      instructor: 'Sarah Johnson',
      completionDate: '2024-01-15',
      certificateUrl: '#',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
    },
    {
      id: 2,
      courseTitle: 'Advanced JavaScript Patterns',
      instructor: 'Mike Chen',
      completionDate: '2024-02-20',
      certificateUrl: '#',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'
    },
    {
      id: 3,
      courseTitle: 'UI/UX Design Principles',
      instructor: 'Emma Davis',
      completionDate: '2024-03-10',
      certificateUrl: '#',
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
          <p className="text-muted-foreground">Download and share your achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={cert.thumbnail} 
                  alt={cert.courseTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <Award className="h-8 w-8 mb-2" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{cert.courseTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">Instructor: {cert.instructor}</p>
                  <p className="text-muted-foreground">Completed: {new Date(cert.completionDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {certificates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
              <p className="text-muted-foreground">Complete courses to earn certificates</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
