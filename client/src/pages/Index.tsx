import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Collapse, Divider } from 'antd';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Compass,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Rocket,
} from 'lucide-react';
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
  }, [dispatch, isAuthenticated]);

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
              {user && isAuthenticated ? (
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
      <section
        className="py-20 text-white relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, hsl(221, 83%, 53%) 0%, hsl(265, 83%, 63%) 100%)',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(600px 240px at 15% 20%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%), radial-gradient(520px 240px at 85% 30%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 55%), radial-gradient(700px 320px at 50% 100%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)',
          }}
        />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Learn faster. Build real skills.</span>
            </div>

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

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Verified learning',
                  desc: 'Secure accounts + verified email onboarding.',
                },
                {
                  icon: MessageSquare,
                  title: 'Community support',
                  desc: 'Ask questions and learn together.',
                },
                {
                  icon: Rocket,
                  title: 'Career momentum',
                  desc: 'Projects, certificates, and growth.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl px-4 py-4"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.14)' }}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold">{item.title}</div>
                      <div className="text-sm text-white/85">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
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

      {/* 🔹 How It Works */}
      <section
        className="py-20"
        style={{ background: 'hsl(210 40% 98%)' }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold">A simple path to progress</h2>
            <p
              className="text-lg mt-3"
              style={{ color: 'hsl(215 16% 47%)' }}
            >
              Create an account, verify your email, then start learning and tracking your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: 'Pick a course',
                description: 'Browse topics, preview details, and enroll in minutes.',
              },
              {
                icon: BookOpen,
                title: 'Learn by doing',
                description: 'Lessons, practice, and discussions that keep you moving.',
              },
              {
                icon: Award,
                title: 'Show your results',
                description: 'Earn certificates and build a portfolio you can share.',
              },
            ].map((step, i) => (
              <Card key={i} className="hover:shadow-lg transition-all" hoverable>
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: 'hsla(221, 83%, 53%, 0.1)' }}
                  >
                    <step.icon
                      className="h-6 w-6"
                      style={{ color: 'hsl(221 83% 53%)' }}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{step.title}</div>
                    <div style={{ color: 'hsl(215 16% 47%)' }}>{step.description}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 Popular Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold">Popular categories</h2>
              <p className="mt-2" style={{ color: 'hsl(215 16% 47%)' }}>
                Start with what you need now—then grow into what you want next.
              </p>
            </div>
            <Link to="/courses">
              <Button type="primary">Browse all courses</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Web Development', blurb: 'Frontend, backend, full-stack', icon: Rocket },
              { title: 'UI/UX Design', blurb: 'Design systems and prototyping', icon: Sparkles },
              { title: 'Data & Analytics', blurb: 'Dashboards, insights, decisions', icon: Compass },
              { title: 'Career Skills', blurb: 'Interview prep, communication', icon: Users },
            ].map((cat, i) => (
              <Card key={i} hoverable className="hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ background: 'hsla(221, 83%, 53%, 0.1)' }}
                  >
                    <cat.icon className="h-5 w-5" style={{ color: 'hsl(221 83% 53%)' }} />
                  </div>
                  <div className="font-bold">{cat.title}</div>
                </div>
                <div style={{ color: 'hsl(215 16% 47%)' }}>{cat.blurb}</div>
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

      {/* 🔹 Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold">Loved by learners</h2>
            <p className="mt-3 text-lg" style={{ color: 'hsl(215 16% 47%)' }}>
              Real stories from people who turned learning into momentum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Amina',
                role: 'Student',
                quote:
                  'The lessons are clear, the community is helpful, and the progress feels real. I stayed consistent for the first time.',
              },
              {
                name: 'Samuel',
                role: 'Instructor',
                quote:
                  'Publishing courses is smooth and students actually engage in discussion. It feels like teaching with feedback loops.',
              },
              {
                name: 'Liya',
                role: 'Career switcher',
                quote:
                  'I used the certificates + projects to explain my skills in interviews. That confidence made the difference.',
              },
            ].map((t, i) => (
              <Card key={i} hoverable className="hover:shadow-lg transition-all">
                <div className="text-sm" style={{ color: 'hsl(215 16% 47%)' }}>
                  “{t.quote}”
                </div>
                <Divider style={{ margin: '16px 0' }} />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm" style={{ color: 'hsl(215 16% 47%)' }}>
                      {t.role}
                    </div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'hsla(221, 83%, 53%, 0.1)', color: 'hsl(221 83% 53%)' }}
                  >
                    Verified
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 FAQ */}
      <section
        className="py-20"
        style={{ background: 'hsl(210 40% 98%)' }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold">Frequently asked questions</h2>
            <p className="mt-3 text-lg" style={{ color: 'hsl(215 16% 47%)' }}>
              Quick answers to help you get started.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Collapse
              items={[
                {
                  key: '1',
                  label: 'Do I need to verify my email?'
                  ,
                  children: (
                    <div style={{ color: 'hsl(215 16% 47%)' }}>
                      Yes. Email verification helps secure your account and ensures you receive important updates.
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: 'Can I learn at my own pace?'
                  ,
                  children: (
                    <div style={{ color: 'hsl(215 16% 47%)' }}>
                      Absolutely. LearnHub is designed for flexible learning—anytime, anywhere.
                    </div>
                  ),
                },
                {
                  key: '3',
                  label: 'What do I get after completing a course?'
                  ,
                  children: (
                    <div style={{ color: 'hsl(215 16% 47%)' }}>
                      You can earn a certificate (when available) and use it to showcase your learning progress.
                    </div>
                  ),
                },
              ]}
            />
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
          <p>© {new Date().getFullYear()} LearnHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
