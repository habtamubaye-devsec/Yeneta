import { Link, useLocation } from 'react-router-dom';
import { Layout, Button, theme } from 'antd';
import { GraduationCap } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

const { Header, Content, Footer } = Layout;
const { useToken } = theme;

interface PublicLayoutProps {
    children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
    const { token } = useToken();
    const location = useLocation();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    background: token.colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    height: 64,
                }}
            >
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: token.colorPrimary,
                        color: "white"
                    }}>
                        <GraduationCap size={20} />
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 700, color: token.colorTextHeading }}>
                        LearnHub
                    </span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {isAuthenticated ? (
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
            </Header>

            <Content style={{ background: token.colorBgBase }}>
                {children}
            </Content>

            <Footer style={{ textAlign: 'center', background: token.colorBgLayout }}>
                <p style={{ color: token.colorTextSecondary }}>
                    © {new Date().getFullYear()} LearnHub. All rights reserved.
                </p>
            </Footer>
        </Layout>
    );
};
