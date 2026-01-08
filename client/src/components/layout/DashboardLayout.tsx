import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Menu, Button, Avatar, Drawer, Dropdown } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  TrophyOutlined,
  MessageOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SafetyOutlined,
  UserSwitchOutlined,
  StarOutlined,
  FolderOpenOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { GraduationCap, Key } from "lucide-react";
import GeminiChatbot from "@/components/chatbot/GeminiChatbot";
import { logout } from "@/features/auth/authSlice";
import NotificationBell from "@/components/NotificationBell";

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const [collapsed, setCollapsed] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(220);

  const drawerBg = "hsl(222 47% 11%)"; // Dark uniform drawer bg

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleResize = () => {
    const width = window.innerWidth;
    setIsTablet(width <= 820);
    setIsMobile(width <= 500);
    setDrawerWidth(width < 500 ? 160 : 220);

    if (width <= 820) setCollapsed(true);
    else setCollapsed(false);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMenuItems = () => {
    const baseItems = [
      { key: `/${user?.role}`, icon: <DashboardOutlined />, label: "Dashboard" },
    ];
    switch (user?.role) {
      case "student":
        return [
          ...baseItems,
          { key: "/courses", icon: <BookOutlined />, label: "Browse Courses" },
          { key: "/student/my-courses", icon: <BookOutlined />, label: "My Courses" },
          { key: "/student/certificates", icon: <TrophyOutlined />, label: "Certificates" },
          { key: "/student/reviews", icon: <StarOutlined />, label: "My Reviews" },
        ];
      case "instructor":
        return [
          ...baseItems,
          { key: "/instructor/courses", icon: <BookOutlined />, label: "My Courses" },
          { key: "/instructor/create-course", icon: <FileTextOutlined />, label: "Create Course" },
          { key: "/instructor/feedback", icon: <MessageOutlined />, label: "Feedback" },
          { key: "/instructor/analytics", icon: <BarChartOutlined />, label: "Analytics" },
        ];
      case "admin":
        return [
          ...baseItems,
          { key: "/admin/users", icon: <TeamOutlined />, label: "User Management" },
          { key: "/admin/approve-instructor",icon: <CheckCircleOutlined />,label: "Approve Instructor"},
          { key: "/admin/courses", icon: <BookOutlined />, label: "Course Management" },
          { key: "/admin/reviews", icon: <StarOutlined />, label: "Review Moderation" },
          { key: "/admin/categories", icon: <FolderOpenOutlined />, label: "Categories" },
          { key: "/admin/notifications", icon: <BellOutlined />, label: "Notifications" },
        ];
      case "superadmin":
        return [
          ...baseItems,
          { key: "/admin/users", icon: <TeamOutlined />, label: "User Management" },
          { key: "/admin/approve-instructor",icon: <CheckCircleOutlined />,label: "Approve Instructor"},
          { key: "/admin/courses", icon: <BookOutlined />, label: "Course Management" },
          { key: "/admin/reviews", icon: <StarOutlined />, label: "Review Moderation" },
          { key: "/admin/categories", icon: <FolderOpenOutlined />, label: "Categories" },
          { key: "/admin/notifications", icon: <BellOutlined />, label: "Notifications" },
          { key: "/superadmin/roles", icon: <UserSwitchOutlined />, label: "Role Management" },
          { key: "/superadmin/settings", icon: <SafetyOutlined />, label: "System Settings" },
        ];
      default:
        return baseItems;
    }
  };

  const profileMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate(`/${user.role}/profile`),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
    { type: "divider" as const },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for tablet+ */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          style={{
            background: drawerBg,
            position: "fixed",
            height: "100vh",
            left: 0,
            zIndex: 100,
          }}
        >
          <div
            style={{
              padding: "20px 10px",
              margin: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "hsl(210 40% 98%)",
              }}
            >
              <GraduationCap size={28} style={{ color: "hsl(221 83% 53%)" }} />
              {!collapsed && (
                <span style={{ fontWeight: "bold", fontSize: 18 }}>LearnHub</span>
              )}
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[window.location.pathname]}
            items={getMenuItems()}
            onClick={({ key }) => navigate(key)}
            style={{ background: drawerBg, borderRight: 0 }}
          />
        </Sider>
      )}

      {/* Drawer for mobile */}
      {isMobile && (
        <Drawer
          placement="left"
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          closeIcon={false}
          width={220}
          bodyStyle={{ background: drawerBg, padding: "10px" }}
          headerStyle={{ background: drawerBg }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              borderBottom: "1px solid hsl(222 47% 20%)",
              paddingBottom: 10,
            }}
          >
            <GraduationCap size={26} style={{ color: "hsl(221 83% 53%)" }} />
            <span style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
              LearnHub
            </span>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[window.location.pathname]}
            items={getMenuItems()}
            onClick={({ key }) => {
              navigate(key);
              setDrawerVisible(false);
            }}
            style={{ background: drawerBg, borderRight: 0 }}
          />
        </Drawer>
      )}

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: !isMobile ? (collapsed ? 80 : 220) : 0,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          style={{
            background: "#ffffff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={
              <MenuOutlined
                style={{ color: "#1e293b"}}
              />
            }
            onClick={() =>
              isMobile ? setDrawerVisible(true) : setCollapsed(!collapsed)
            }
          />

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <NotificationBell />
            <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" trigger={["click"]}>
              <Avatar
                size="small"
                style={{
                  background: "hsl(221 83% 53%)",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {user?.name?.[0]?.toUpperCase() || <UserOutlined />}
              </Avatar>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: 24, minHeight: 280 }}>{children}</Content>
      </Layout>

      <GeminiChatbot />
    </Layout>
  );
};
