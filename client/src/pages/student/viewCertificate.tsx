// src/pages/student/ViewCertificate.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download, Share2, RefreshCcw } from "lucide-react";
import { downloadCertificate } from "../../features/certificate/certificateSlice";

export default function ViewCertificate() {
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useDispatch<any>();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { loading } = useSelector((state: any) => state.certificates);

  // Fetch and view certificate using Redux thunk
  const fetchCertificate = async () => {
    try {
      setError(null);

      // downloadCertificate thunk returns { courseId, url }
      const result = await dispatch(downloadCertificate(courseId!)).unwrap();
      setPdfUrl(result.url);
    } catch (err: any) {
      setError(err || "Failed to load certificate");
    }
  };

  useEffect(() => {
    fetchCertificate();

    return () => {
      if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
    };
  }, [courseId]);

  const handleShare = () => {
    if (!pdfUrl) return;
    navigator.clipboard.writeText(window.location.href);
    alert("Certificate link copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Certificate</h1>

        {loading && <p>Loading certificate...</p>}

        {!loading && error && (
          <div className="space-y-2 text-center">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" onClick={fetchCertificate}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {!loading && pdfUrl && (
          <div className="space-y-4">
            <div className="w-full h-[600px] border rounded overflow-hidden">
              <iframe src={pdfUrl} className="w-full h-full" title="Certificate PDF" />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => window.open(pdfUrl, "_blank")}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button className="flex-1" variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
