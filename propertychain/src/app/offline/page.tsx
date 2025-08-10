/**
 * Offline Page - PropertyChain PWA
 * 
 * Fallback page displayed when user is offline
 * Following UpdatedUIPlan.md Step 49 specifications and CLAUDE.md principles
 */

'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { WifiOff, RefreshCw, Home, Download } from 'lucide-react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = React.useState(false)

  React.useEffect(() => {
    const checkConnection = () => {
      setIsOnline(navigator.onLine)
    }

    checkConnection()

    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', checkConnection)

    return () => {
      window.removeEventListener('online', checkConnection)
      window.removeEventListener('offline', checkConnection)
    }
  }, [])

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    }
  }

  const handleHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F5F5]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#FFF3E0] flex items-center justify-center">
            <WifiOff className="h-8 w-8 text-[#FF6347]" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
          <CardDescription>
            Please check your internet connection and try again
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isOnline ? (
            <Alert className="border-[#C8E6C9] bg-[#E8F5E9]">
              <AlertDescription className="text-[#2E7D32]">
                Connection restored! You can now continue browsing.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-[#FFCC80] bg-[#FFF3E0]">
              <AlertDescription className="text-[#F57C00]">
                Some features may be limited while offline. Previously viewed content may still be available.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button 
              onClick={handleRetry}
              className="w-full bg-[#007BFF] hover:bg-[#0062CC]"
              disabled={!isOnline}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
            <Button 
              onClick={handleHome}
              variant="outline"
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">While offline, you can:</h3>
            <ul className="space-y-1 text-sm text-[#757575]">
              <li>• View previously cached properties</li>
              <li>• Access your saved searches</li>
              <li>• Review your investment portfolio</li>
              <li>• Read downloaded documents</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-[#9E9E9E] text-center">
              For the best experience, ensure PropertyChain is saved to your home screen
            </p>
            <Button 
              variant="link"
              className="w-full text-sm"
              onClick={() => {
                // Trigger PWA install prompt if available
                const event = (window as any).deferredPrompt
                if (event) {
                  event.prompt()
                }
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}