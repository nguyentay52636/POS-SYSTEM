import type React from "react"
import "./globals.css"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SiderBarAdmin } from "@/components/Admin/components/SiderBar/ SiderBarAdmin"



export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>

        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>

            <div className="flex">
              {/* <SiderBarAdmin /> */}
              <div className="flex-1">
                {children}
              </div>
            </div>


          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}