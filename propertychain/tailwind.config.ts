import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // Existing shadcn CSS variable colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Primary Blue Palette (Trust & Security)
        primary: {
          50: '#E6F2FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          DEFAULT: '#007BFF', // PRIMARY ACTION COLOR
          500: '#007BFF',
          600: '#0062CC',
          700: '#004A99',
          800: '#003166',
          900: '#001933',
          foreground: 'hsl(var(--primary-foreground))'
        },
        
        // Secondary colors (keeping shadcn compatibility)
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        
        // Destructive/Error Red Palette
        destructive: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          DEFAULT: '#DC3545', // ERROR PRIMARY
          500: '#DC3545',
          600: '#C62828',
          700: '#B71C1C',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        
        // Success Green Palette (Positive Metrics)
        success: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          DEFAULT: '#4CAF50', // SUCCESS PRIMARY
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20'
        },
        
        // Warning Orange Palette
        warning: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          DEFAULT: '#FF6347', // WARNING PRIMARY
          500: '#FF6347'
        },
        
        // Neutral Gray Palette
        neutral: {
          50: '#FAFAFA',   // Off-white background
          100: '#F5F5F5',  // Light gray for card backgrounds
          200: '#EEEEEE',  // Border gray lightest
          300: '#E0E0E0',  // Divider lines
          400: '#BDBDBD',  // Disabled text
          500: '#9E9E9E',  // Secondary text
          600: '#757575',  // Icon default color
          700: '#616161',  // Body text secondary
          800: '#424242',  // Body text primary
          900: '#212121',  // Heading text
        },
        
        // Muted colors (keeping shadcn compatibility)
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      
      fontSize: {
        // Display sizes
        'display-lg': ['60px', { lineHeight: '72px', letterSpacing: '-0.04em' }],
        'display': ['48px', { lineHeight: '56px', letterSpacing: '-0.03em' }],
        
        // Heading sizes (H1-H6)
        'h1': ['36px', { lineHeight: '44px', letterSpacing: '-0.03em', fontWeight: '700' }],
        'h2': ['30px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '30px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h5': ['18px', { lineHeight: '28px', letterSpacing: '0', fontWeight: '600' }],
        'h6': ['16px', { lineHeight: '24px', letterSpacing: '0', fontWeight: '600' }],
        
        // Body text sizes
        'body-lg': ['18px', { lineHeight: '28px', letterSpacing: '0' }],
        'body': ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.01em' }],
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.02em' }],
        'overline': ['11px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '600' }],
        
        // Financial data typography
        'value-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'value-md': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'value-sm': ['18px', { lineHeight: '24px', letterSpacing: '0', fontWeight: '600' }],
        'table-data': ['14px', { lineHeight: '20px', letterSpacing: '0', fontWeight: '500' }],
        'value-micro': ['12px', { lineHeight: '16px', letterSpacing: '0', fontWeight: '600' }],
      },
      
      spacing: {
        // 8px base unit spacing scale
        '0.5': '4px',   // micro spacing
        '1': '8px',     // tight spacing
        '1.5': '12px',  // compact spacing
        '2': '16px',    // default spacing
        '2.5': '20px',  // comfortable spacing
        '3': '24px',    // section spacing within cards
        '4': '32px',    // spacing between cards
        '5': '40px',    // major section spacing
        '6': '48px',    // large section breaks
        '8': '64px',    // page section spacing
        '10': '80px',   // major page sections
        '12': '96px',   // hero section padding
        '16': '128px',
        '20': '160px',
        '24': '192px',
        '32': '256px',
      },
      
      borderRadius: {
        'none': '0px',
        'subtle': '4px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'pill': '9999px',
        // Keep shadcn variable-based radius
        'radius': 'var(--radius)',
        'radius-md': 'calc(var(--radius) - 2px)',
        'radius-sm': 'calc(var(--radius) - 4px)'
      },
      
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        DEFAULT: '0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'md': '0 6px 10px -3px rgba(0, 0, 0, 0.04)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },
      
      transitionDuration: {
        '200': '200ms', // Standard duration
        '300': '300ms', // For larger elements
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
      },
      
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' }
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' }
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' }
        },
        'scale-in': {
          from: { transform: 'scale(0.95)' },
          to: { transform: 'scale(1)' }
        },
        'scale-out': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(0.95)' }
        },
        'spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        }
      },
      
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-in',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-in',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      
      zIndex: {
        'dropdown': '50',
        'sticky': '100',
        'overlay': '200',
        'modal': '300',
        'toast': '500',
      },
      
      minHeight: {
        'hero-mobile': '700px',
        'hero-desktop': '800px',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #E6F2FF, #FFFFFF, #E6F2FF)',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config