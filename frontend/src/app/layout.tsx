import type React from "react"
import "./globals.css"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/ThemeProvider"
import ConditionalSidebar from "@/components/Admin/components/SiderBar/ConditionalSidebar"
import { Toaster } from "sonner"
import ReduxProvider from "@/components/ReduxProvider"
import ToastProvider from "@/components/ui/Provider/ToastProvider"
import { ToastContainer } from "react-toastify"



export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>

        <Suspense fallback={null}>
          <ReduxProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>

              <div className="flex">
                <ConditionalSidebar />
                <div className="flex-1">
                  {children}
                </div>
              </div>

              {/* <Toaster position="top-right" richColors /> */}
              <ToastContainer position="top-right" autoClose={2000} />
            </ThemeProvider>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  )
}