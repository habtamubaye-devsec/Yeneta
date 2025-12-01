// src/pages/student/ViewCertificate.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { downloadCertificate, downloadCertificateFile, fetchCertificates } from "../../features/certificate/certificateSlice";

export default function ViewCertificate() {
  const { courseId } = useParams<{ courseId: string }>();
  const dispatch = useDispatch<any>();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { loading } = useSelector((state: any) => state.certificates);
  const certificates = useSelector((state: any) => state.certificates.items || []);

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

    // ensure we have certificate metadata in store — fetch if not present
    if (!certificates || certificates.length === 0) {
      dispatch(fetchCertificates() as any).catch(() => {});
    }

    return () => {
      if (pdfUrl) window.URL.revokeObjectURL(pdfUrl);
    };
  }, [courseId]);

  // Try to find the certificate metadata (id, date) from the certificates list
  const certMeta = certificates.find((c: any) => String(c.courseId) === String(courseId));

  

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Certificate Preview</h1>
            <p className="text-sm text-muted-foreground mt-1">High-quality, one-page certificate. View in the browser or download when ready.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right text-sm text-muted-foreground mr-4">
              <div className="font-medium">{certMeta?.userName ?? 'Recipient'}</div>
              <div className="text-xs">{certMeta?.courseTitle ?? 'Course'}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.open(`/student/certificates`, '_self')}>Back</Button>
              <Button onClick={() => {
                // Build a friendly filename: <user>_<course>_Yeneta.pdf
                const user = certMeta?.userName ?? 'recipient';
                const course = certMeta?.courseTitle ?? 'course';
                const makeSafe = (s: string) => s.replace(/[^a-z0-9\-_.]/gi, '_').slice(0, 80);
                const filename = `${makeSafe(user)}_${makeSafe(course)}_Yeneta.pdf`;
                dispatch(downloadCertificateFile({ courseId: courseId!, filename }));
              }}>Download</Button>
            </div>
          </div>
        </div>

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
            <div className="w-full h-[680px] border rounded overflow-hidden">
              <iframe src={pdfUrl} className="w-full h-full" title="Certificate PDF" />
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="text-sm text-muted-foreground">
                <div><strong>Certificate ID:</strong> {certMeta ? `YEN-CERT-${String(certMeta._id).slice(-8).toUpperCase()}` : '—'}</div>
                <div><strong>Issued:</strong> {certMeta ? new Date(certMeta.completionDate).toLocaleDateString() : '—'}</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => window.open(pdfUrl, '_blank')}>Open</Button>
                <Button onClick={() => window.open(pdfUrl, '_blank')}>Print</Button>
                <Button variant="outline" onClick={() => window.open(`https://yeneta.local/verify?cert=${certMeta?._id}`, '_blank')}>Verify</Button>
              </div>
            </div>
          
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
