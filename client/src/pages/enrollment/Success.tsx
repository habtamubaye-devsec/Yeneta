import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Spin, Typography, Alert } from 'antd';
import { api } from '@/api';

const { Text } = Typography;

export default function EnrollmentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('courseId');
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('Missing courseId');
      setLoading(false);
      return;
    }

    let cancelled = false;

    // If Stripe session_id is present, try to finalize enrollment immediately by calling
    // the protected webhook-test helper. This lets us avoid waiting for Stripe webhook
    // delivery in local/dev environments. We ignore errors and fall back to polling.
    const tryFinalizeFromSession = async () => {
      if (!sessionId) return;
      try {
        await api.post('/api/enrollment/webhook-test', { sessionId });
        // proceed — polling below will detect the created enrollment quickly
      } catch (err) {
        // ignore; polling will still run
      }
    };

    tryFinalizeFromSession();

    // Poll for enrollment existence for up to ~30s
    const checkEnrollment = async () => {
      const start = Date.now();
      const timeout = 30000; // 30s
      while (!cancelled && Date.now() - start < timeout) {
        try {
          const res = await api.get('/api/enrollment/my');
          const enrollments = res.data.data || [];
          const found = enrollments.find((e: any) => (e.course && (e.course._id === courseId || e.course === courseId)) || (e.course?._id === courseId));
          if (found) {
            // enrollment exists — fetch the course to get first lesson
            try {
              const courseResp = await api.get(`/api/courses/${courseId}`);
              const course = courseResp.data.data ?? courseResp.data.course ?? courseResp.data;
              const firstLesson = (course.lessons && course.lessons[0]) || null;
              if (firstLesson && firstLesson._id) {
                // redirect to lesson player route if available
                navigate(`/courses/${courseId}/lesson/${firstLesson._id}`);
                return;
              }
              // fallback to course page
              navigate(`/courses/${courseId}`);
              return;
            } catch (err) {
              // couldn't fetch course — fallback
              navigate(`/courses/${courseId}`);
              return;
            }
          }
        } catch (err) {
          // ignore and retry
        }

        // wait 1s then retry
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 1000));
      }

      if (!cancelled) {
        setError('Enrollment not found yet. If you completed payment, please wait a moment and refresh.');
        setLoading(false);
      }
    };

    checkEnrollment();

    return () => { cancelled = true; };
  }, [courseId, navigate]);

  if (loading) return (
    <DashboardLayout>
      <div style={{ padding: 32 }}>
        <Spin />
        <div style={{ marginTop: 12 }}><Text>Finalizing your enrollment — please wait...</Text></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div style={{ padding: 32 }}>
        {error ? <Alert type="warning" message={error} /> : <Text>Enrollment complete. Redirecting...</Text>}
      </div>
    </DashboardLayout>
  );
}
