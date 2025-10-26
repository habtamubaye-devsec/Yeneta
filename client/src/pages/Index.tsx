import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from 'antd';
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { fetchCurrentUser } from '@/features/auth/authThunks'; // ✅ make sure this exists

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Read from Redux
  const { user, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // 🧠 On mount, check if token exists and fetch current user
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  console.log("🔥 Auth state in Index:", { user, isAuthenticated, loading });

  // 🕒 Optional loading state (when fetching user)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 🔹 Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap
                className="h-8 w-8 text-primary"
                style={{ color: 'hsl(221 83% 53%)' }}
              />
              <span className="text-2xl font-bold">LearnHub</span>
            </Link>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/courses">
                    <Button type="text">Browse Courses</Button>
                  </Link>
                  <Link to={`/${user?.role || 'student'}`}>
                    <Button type="primary">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button type="text">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button type="primary">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 🔹 Hero Section */}
      <section className="py-20 text-white"  style={{
    background: 'linear-gradient(135deg, hsl(221, 83%, 53%) 0%, hsl(265, 83%, 63%) 100%)',
  }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Future with Online Learning
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Access thousands of courses from expert instructors. Learn at your
              own pace, anywhere, anytime.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  size="large"
                  type="default"
                  className="text-lg px-8"
                  style={{ height: 'auto', padding: '12px 32px' }}
                >
                  Start Learning Today
                </Button>
              </Link>
              <Link to="/courses">
                <Button
                  size="large"
                  className="text-lg px-8"
                  style={{
                    height: 'auto',
                    padding: '12px 32px',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.2)',
                  }}
                >
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose LearnHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Expert-Led Courses',
                description:
                  'Learn from industry professionals with years of real-world experience',
              },
              {
                icon: Users,
                title: 'Active Community',
                description:
                  'Connect with fellow learners and instructors in course discussions',
              },
              {
                icon: Award,
                title: 'Certificates',
                description:
                  'Earn recognized certificates to showcase your achievements',
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="text-center hover:shadow-lg transition-all"
                hoverable
              >
                <div
                  className="inline-flex p-4 rounded-full mb-4"
                  style={{ background: 'hsla(221, 83%, 53%, 0.1)' }}
                >
                  <feature.icon
                    className="h-8 w-8"
                    style={{ color: 'hsl(221 83% 53%)' }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p
                  className="text-muted-foreground"
                  style={{ color: 'hsl(215 16% 47%)' }}
                >
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 Stats */}
      <section
        className="py-20 bg-muted"
        style={{ background: 'hsl(210 40% 96%)' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Students' },
              { value: '500+', label: 'Expert Instructors' },
              { value: '1000+', label: 'Online Courses' },
              { value: '50K+', label: 'Certificates Issued' },
            ].map((stat, i) => (
              <div key={i}>
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: 'hsl(221 83% 53%)' }}
                >
                  {stat.value}
                </div>
                <div style={{ color: 'hsl(215 16% 47%)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card
            className="bg-gradient-card"
            style={{
              background:
                'linear-gradient(to bottom right, hsl(0 0% 100%), hsl(221 83% 98%))',
            }}
          >
            <div className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Learning Journey?
              </h2>
              <p
                className="text-xl mb-8"
                style={{ color: 'hsl(215 16% 47%)' }}
              >
                Join thousands of students already learning on LearnHub
              </p>
              <Link to="/register">
                <Button
                  type="primary"
                  size="large"
                  className="text-lg px-8"
                  style={{ height: 'auto', padding: '12px 32px' }}
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer className="border-t py-8">
        <div
          className="container mx-auto px-4 text-center"
          style={{ color: 'hsl(215 16% 47%)' }}
        >
          <p>© 2024 LearnHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
