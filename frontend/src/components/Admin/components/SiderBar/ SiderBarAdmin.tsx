"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import {

    Menu,
    X,
    Home,


} from "lucide-react"
import HeaderAppSider from "./components/HeaderAppSider"
import SearchBarAppSider from "./components/SearchBarAppSider"
import { NavigateItem } from "./components/NavigateItem"
import ToggerThemeAppSider from "./components/ToggerThemeAppSider"
import UserProfileAppSider from "./components/UserProfileAppSider"
import Link from "next/link"
import { navigation } from "./router"

export function SiderBarAdmin() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
    const pathname = usePathname()

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth < 768) {
                setIsCollapsed(true)
            }
        }
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])





    return (
        <>
            {isMobile && isMobileOpen && (
                <div className="fixed inset-0 bg-white   bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
            )}

            {/* Mobile Toggle Button */}
            {isMobile && (
                <Button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="fixed top-4 left-4 z-50 bg-background text-foreground hover:bg-accent shadow-lg border"
                    size="icon"
                >
                    {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            )}

            {/* Sidebar */}
            <div
                className={`
          ${isMobile ? "fixed" : "relative"} 
          ${isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
          ${isCollapsed && !isMobile ? "w-16" : "w-64"}
          h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50 theme-transition
        `}
            >
                {/* Header */}
                <HeaderAppSider isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobile={isMobile} />
                {/* Back to Homepage */}
                {!isCollapsed && (
                    <div className="px-4 py-2">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground hover:text-black hover:bg-gray-300 rounded-lg transition-colors"
                        >
                            <Home className="text-black h-4 w-4" />
                            <span>Quay lại trang chủ</span>
                        </Link>
                    </div>
                )}

                <SearchBarAppSider isCollapsed={isCollapsed} isMobile={isMobile} />
                <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                    {navigation(pathname).map((item) => (
                        <NavigateItem key={item.name} item={item} isCollapsed={isCollapsed} isMobile={isMobile} setIsMobileOpen={setIsMobileOpen} />
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-sidebar-border space-y-2">
                    <ToggerThemeAppSider isCollapsed={isCollapsed} isMobile={isMobile} />
                    <UserProfileAppSider isCollapsed={isCollapsed} isMobile={isMobile} setIsProfileDialogOpen={setIsProfileDialogOpen} />
                </div>
            </div>

        </>
    )
}