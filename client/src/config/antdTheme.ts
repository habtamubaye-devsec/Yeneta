import type { ThemeConfig } from 'antd';

// Convert HSL to RGB for antd
const hslToRgb = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `rgb(${Math.round(255 * f(0))}, ${Math.round(255 * f(8))}, ${Math.round(255 * f(4))})`;
};

export const antdTheme: ThemeConfig = {
  token: {
    // Colors from design system
    colorPrimary: hslToRgb(221, 83, 53),
    colorSuccess: hslToRgb(142, 71, 45),
    colorWarning: hslToRgb(38, 92, 50),
    colorError: hslToRgb(0, 84, 60),
    colorInfo: hslToRgb(221, 83, 53),

    // Background and text
    colorBgBase: hslToRgb(0, 0, 100),
    colorTextBase: hslToRgb(222, 47, 11),

    // Border and radius
    borderRadius: 12,
    colorBorder: hslToRgb(214, 32, 91),

    // Font
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: 6,
      primaryShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)',
    },
    Input: {
      controlHeight: 40,
      borderRadius: 6,
    },
    Card: {
      borderRadius: 12,
      boxShadowTertiary: '0 1px 2px 0 rgba(59, 130, 246, 0.05)',
    },
    Select: {
      controlHeight: 40,
      borderRadius: 6,
    },
    Table: {
      borderRadius: 12,
    },
    Modal: {
      borderRadius: 12,
    },
  },
};

export const darkTheme: ThemeConfig = {
  ...antdTheme,
  token: {
    ...antdTheme.token,
    colorBgBase: hslToRgb(222, 47, 11),
    colorTextBase: hslToRgb(210, 40, 98),
    colorBorder: hslToRgb(217, 33, 17),
  },
};
