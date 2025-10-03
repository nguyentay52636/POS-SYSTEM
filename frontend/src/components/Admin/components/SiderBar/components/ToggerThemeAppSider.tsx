import { Moon } from 'lucide-react'
import { TooltipContent } from '@/components/ui/tooltip'
import { TooltipTrigger } from '@/components/ui/tooltip'
import { Tooltip } from '@/components/ui/tooltip'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import React from 'react'
import { Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ToggerThemeAppSider({ isCollapsed, isMobile }: { isCollapsed: any, isMobile: any }) {
    const { theme, setTheme } = useTheme()

    const isDarkMode = theme === "dark"

    const toggleTheme = () => {
        setTheme(isDarkMode ? "light" : "dark")
    }

    return (
        <div className="flex items-center">
            {isCollapsed && !isMobile ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="w-full h-10 theme-toggle-animation"
                            >
                                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-popover text-popover-foreground border">
                            <p>{isDarkMode ? "Chế độ sáng" : "Chế độ tối"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className="w-full justify-start gap-3 px-3 py-2 h-auto theme-toggle-animation"
                >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {!isCollapsed && <span className="text-sm">{isDarkMode ? "Chế độ sáng" : "Chế độ tối"}</span>}
                </Button>
            )}
        </div>
    )
}   