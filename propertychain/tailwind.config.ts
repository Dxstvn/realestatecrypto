import type { Config } from "tailwindcss"
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, ANIMATION, SHADOWS } from "./src/lib/design-system/constants"

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
        // CSS variable colors for shadcn compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Design System Colors - Phase 1.2 Enhanced
        // Background colors
        'bg-primary': COLORS.background.primary,
        'bg-secondary': COLORS.background.secondary,
        'bg-tertiary': COLORS.background.tertiary,
        'bg-glass': COLORS.background.glass,
        'bg-overlay': COLORS.background.overlay,
        
        // Text colors with WCAG AAA compliance
        'text-primary': COLORS.text.primary,
        'text-secondary': COLORS.text.secondary,
        'text-tertiary': COLORS.text.tertiary,
        'text-inverse': COLORS.text.inverse,
        'text-disabled': COLORS.text.disabled,
        
        // Brand colors
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: COLORS.brand.primary,
          DEFAULT: COLORS.brand.primary,
          600: COLORS.brand.primaryDark,
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
          foreground: 'hsl(var(--primary-foreground))'
        },
        
        // Secondary purple
        secondary: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: COLORS.brand.secondary,
          DEFAULT: COLORS.brand.secondary,
          600: COLORS.brand.secondaryDark,
          700: '#6B21A8',
          800: '#581C87',
          900: '#3B0764',
          950: '#2E1065',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        
        // Success (Green)
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: COLORS.semantic.success,
          DEFAULT: COLORS.semantic.success,
          600: COLORS.semantic.successDark,
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22'
        },
        
        // Warning (Yellow/Orange)
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: COLORS.semantic.warningLight,
          400: '#FBBF24',
          500: COLORS.semantic.warning,
          DEFAULT: COLORS.semantic.warning,
          600: COLORS.semantic.warningDark,
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03'
        },
        
        // Danger (Red)
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: COLORS.semantic.dangerLight,
          400: '#F87171',
          500: COLORS.semantic.danger,
          DEFAULT: COLORS.semantic.danger,
          600: COLORS.semantic.dangerDark,
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A'
        },
        
        // Info (Blue)
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: COLORS.semantic.infoLight,
          500: COLORS.semantic.info,
          DEFAULT: COLORS.semantic.info,
          600: COLORS.semantic.infoDark,
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554'
        },
        
        // Yield/APY specific colors
        yield: {
          senior: COLORS.yield.senior,
          junior: COLORS.yield.junior,
          apy: COLORS.yield.apy,
          tvl: COLORS.yield.tvl
        },
        
        // Neon accent colors
        neon: {
          green: COLORS.neon.green,
          purple: COLORS.neon.purple,
          blue: COLORS.neon.blue,
          yellow: COLORS.neon.yellow
        },
        
        // Gray scale with proper contrast
        gray: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B'
        },
        
        // Existing shadcn colors
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
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
      
      // Spacing from design system
      spacing: {
        'xs': SPACING.xs,
        'sm': SPACING.sm,
        'md': SPACING.md,
        'lg': SPACING.lg,
        'xl': SPACING.xl,
        '2xl': SPACING['2xl'],
        '3xl': SPACING['3xl'],
        '4xl': SPACING['4xl'],
        '5xl': SPACING['5xl']
      },
      
      // Border radius from design system
      borderRadius: {
        'sm': RADIUS.sm,
        'md': RADIUS.md,
        'lg': RADIUS.lg,
        'xl': RADIUS.xl,
        '2xl': RADIUS['2xl'],
        'full': RADIUS.full
      },
      
      // Typography from design system
      fontSize: {
        'display-lg': [TYPOGRAPHY.displayLg.fontSize, { 
          lineHeight: TYPOGRAPHY.displayLg.lineHeight,
          fontWeight: TYPOGRAPHY.displayLg.fontWeight,
          letterSpacing: TYPOGRAPHY.displayLg.letterSpacing
        }],
        'display': [TYPOGRAPHY.display.fontSize, {
          lineHeight: TYPOGRAPHY.display.lineHeight,
          fontWeight: TYPOGRAPHY.display.fontWeight,
          letterSpacing: TYPOGRAPHY.display.letterSpacing
        }],
        'h1': [TYPOGRAPHY.h1.fontSize, {
          lineHeight: TYPOGRAPHY.h1.lineHeight,
          fontWeight: TYPOGRAPHY.h1.fontWeight,
          letterSpacing: TYPOGRAPHY.h1.letterSpacing
        }],
        'h2': [TYPOGRAPHY.h2.fontSize, {
          lineHeight: TYPOGRAPHY.h2.lineHeight,
          fontWeight: TYPOGRAPHY.h2.fontWeight,
          letterSpacing: TYPOGRAPHY.h2.letterSpacing
        }],
        'h3': [TYPOGRAPHY.h3.fontSize, {
          lineHeight: TYPOGRAPHY.h3.lineHeight,
          fontWeight: TYPOGRAPHY.h3.fontWeight,
          letterSpacing: TYPOGRAPHY.h3.letterSpacing
        }],
        'h4': [TYPOGRAPHY.h4.fontSize, {
          lineHeight: TYPOGRAPHY.h4.lineHeight,
          fontWeight: TYPOGRAPHY.h4.fontWeight,
          letterSpacing: TYPOGRAPHY.h4.letterSpacing
        }],
        'body-lg': [TYPOGRAPHY.bodyLg.fontSize, {
          lineHeight: TYPOGRAPHY.bodyLg.lineHeight,
          fontWeight: TYPOGRAPHY.bodyLg.fontWeight
        }],
        'body-sm': [TYPOGRAPHY.bodySm.fontSize, {
          lineHeight: TYPOGRAPHY.bodySm.lineHeight,
          fontWeight: TYPOGRAPHY.bodySm.fontWeight
        }],
        'caption': [TYPOGRAPHY.caption.fontSize, {
          lineHeight: TYPOGRAPHY.caption.lineHeight,
          fontWeight: TYPOGRAPHY.caption.fontWeight,
          letterSpacing: TYPOGRAPHY.caption.letterSpacing
        }]
      },
      
      // Animation durations
      transitionDuration: {
        'instant': ANIMATION.instant,
        'fast': ANIMATION.fast,
        'normal': ANIMATION.normal,
        'slow': ANIMATION.slow,
        'slower': ANIMATION.slower,
        'slowest': ANIMATION.slowest
      },
      
      // Animation timing functions
      transitionTimingFunction: {
        'linear': ANIMATION.easing.linear,
        'ease-in': ANIMATION.easing.easeIn,
        'ease-out': ANIMATION.easing.easeOut,
        'ease-in-out': ANIMATION.easing.easeInOut,
        'bounce': ANIMATION.easing.bounce
      },
      
      // Box shadows
      boxShadow: {
        'sm': SHADOWS.sm,
        'md': SHADOWS.md,
        'lg': SHADOWS.lg,
        'xl': SHADOWS.xl,
        '2xl': SHADOWS['2xl'],
        'inner': SHADOWS.inner,
        'glow-primary': SHADOWS.glow.primary,
        'glow-success': SHADOWS.glow.success,
        'glow-danger': SHADOWS.glow.danger,
        'glow-neon': SHADOWS.glow.neon,
        'glass': SHADOWS.glass
      },
      
      // Background gradients
      backgroundImage: {
        'gradient-primary': COLORS.gradients.primary,
        'gradient-secondary': COLORS.gradients.secondary,
        'gradient-success': COLORS.gradients.success,
        'gradient-yield': COLORS.gradients.yield,
        'gradient-hero': COLORS.gradients.hero,
        'gradient-card': COLORS.gradients.card
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(99, 102, 241, 0.3)',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.8), 0 0 60px rgba(99, 102, 241, 0.6)',
            opacity: '0.9'
          }
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
        'glow-pulse': "glow-pulse 2s ease-in-out infinite",
        'gradient-shift': "gradient-shift 3s ease infinite",
        float: "float 3s ease-in-out infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config

export default config