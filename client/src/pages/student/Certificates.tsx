import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import { fetchCertificates } from "../../features/certificate/certificateSlice";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2 } from "lucide-react";

export default function Certificates() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- initialize navigate
  
  const { items: certificates = [], loading, error } = useSelector(
    (state: any) => state.certificates
  );

  useEffect(() => {
    dispatch(fetchCertificates());
  }, [dispatch]);

  // Navigate to certificate view/download page
  const handleDownloadAndView = (userId: string, courseId: string) => {
    navigate(`/student/certificates/${userId}/${courseId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
          <p className="text-muted-foreground">Download and share your achievements</p>
        </div>

        {loading && <p>Loading certificates...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert: any) => (
            <Card key={cert._id || cert.courseId} className="overflow-hidden">
              <div className="relative">
                <img
                  src={cert.thumbnailUrl || "https://via.placeholder.com/400x200"}
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
                  <p className="text-muted-foreground">Instructor: {cert.instructor || "N/A"}</p>
                  <p className="text-muted-foreground">
                    Completed: {new Date(cert.completionDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleDownloadAndView(cert.userId, cert.courseId)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    View / Download
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && certificates.length === 0 && (
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
