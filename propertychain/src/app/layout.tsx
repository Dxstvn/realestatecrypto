/**
 * Root Layout - PropertyChain
 * 
 * Main application layout with provider hierarchy and metadata
 * Follows Section 0 principles with proper error boundaries
 */

import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

// Provider imports
import { ThemeProvider } from "@/components/providers/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { Web3Provider } from "@/components/providers/web3-provider"
import { ToastProvider } from "@/components/providers/toast-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { HeaderSimple, NAVBAR_HEIGHT } from "@/components/layouts/header-simple"
import { FooterModern } from "@/components/layouts/footer-modern"
import { WebVitalsReporter } from "./web-vitals"

// Font configuration with exact specifications
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
})

// PropertyChain metadata
export const metadata: Metadata = {
  title: {
    template: "%s | PropertyChain",
    default: "PropertyChain - Real Estate Tokenization Platform",
  },
  description: "Invest in real estate through blockchain tokenization. Secure, transparent, and accessible property investment for everyone.",
  keywords: ["real estate", "tokenization", "blockchain", "investment", "property", "Web3"],
  authors: [{ name: "PropertyChain Team" }],
  creator: "PropertyChain",
  publisher: "PropertyChain",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://propertychain.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PropertyChain - Real Estate Tokenization Platform",
    description: "Invest in real estate through blockchain tokenization. Secure, transparent, and accessible property investment for everyone.",
    url: "https://propertychain.com",
    siteName: "PropertyChain",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropertyChain - Real Estate Tokenization Platform",
    description: "Invest in real estate through blockchain tokenization.",
    creator: "@propertychain",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification tokens when available
    // google: "verification-token",
    // yandex: "verification-token",
  },
}

// Viewport configuration
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
}

/**
 * Root Provider - Combines all providers in correct order
 */
function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <Web3Provider>
                <ToastProvider>
                  {children}
                </ToastProvider>
              </Web3Provider>
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

/**
 * Root Layout Component
 * 
 * Provides foundation for entire application with:
 * - Font loading with proper fallbacks
 * - Provider hierarchy
 * - Meta tags and SEO
 * - Error boundaries
 * - Theme transitions
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Prevent flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('propertychain-theme')
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                const resolvedTheme = theme === 'system' || !theme ? systemTheme : theme
                document.documentElement.classList.add(resolvedTheme)
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body 
        className="font-inter antialiased theme-transition"
        suppressHydrationWarning
      >
        <RootProvider>
          <WebVitalsReporter />
          <div className="min-h-screen flex flex-col">
            {/* HeaderSimple includes its own spacer to prevent content overlap */}
            <HeaderSimple />
            {/* Main content - no padding needed as header includes spacer */}
            <main className="flex-1">
              {children}
            </main>
            <FooterModern />
          </div>
        </RootProvider>
      </body>
    </html>
  )
}
