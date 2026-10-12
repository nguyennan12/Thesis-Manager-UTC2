import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Hệ màu thương hiệu chuẩn UTC2 (Trích xuất từ https://utc2.edu.vn)
        utc2: {
          primary: '#0f62fe',       // Blue 60 (Màu xanh chủ đạo IBM Carbon / UTC2)
          dark: '#0043ce',          // Blue 70 (Xanh đậm Header & Hover)
          accent: '#4589ff',        // Blue 50 (Xanh sáng tương tác)
          light: '#78a9ff',         // Blue 40 (Highlight)
          surface: '#f4f4f4',       // Nền trang xám sáng sạch sẽ
          card: '#ffffff',          // Nền Card trắng phẳng
          text: {
            main: '#161616',        // Gray 100 (Đen than sang trọng, dễ đọc)
            muted: '#525252',       // Gray 70 (Chữ phụ, nhãn nhỏ)
            subtle: '#8d8d8d',      // Gray 50 (Gợi ý, placeholder)
          },
          border: {
            DEFAULT: '#e0e0e0',     // Viền chuẩn
            light: '#e8e8e8',       // Viền nhẹ
            dark: '#c6c6c6',        // Viền đậm
          },
          status: {
            success: '#24a148',     // Green 60 (Đạt, Được duyệt, Hoàn thành)
            'success-bg': '#defbe6',
            warning: '#f1c21b',     // Yellow 30 (Chờ duyệt, Cảnh báo chậm tiến độ)
            'warning-bg': '#fcf4d6',
            danger: '#da1e28',      // Red 60 (Từ chối, Trượt, Đạo văn > 25%)
            'danger-bg': '#ffebee',
            info: '#0043ce',        // Blue 70 (Thông tin hệ thống)
            'info-bg': '#edf5ff',
          },
        },
      },
      boxShadow: {
        'utc2-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'utc2-card': '0 2px 6px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'utc2-hover': '0 8px 16px 0 rgba(15, 98, 254, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        utc2: '8px',
      },
    },
  },
  plugins: [],
};

export default config;
