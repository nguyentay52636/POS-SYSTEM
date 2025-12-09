import React, { useState, useEffect } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Tooltip } from '@/components/ui/tooltip'
import { TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { AvatarImage } from '@/components/ui/avatar'
import { AvatarFallback } from '@/components/ui/avatar'
import { ChevronRight } from 'lucide-react'
import { Edit, User, Settings, LogOut } from 'lucide-react'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { TooltipContent } from '@/components/ui/tooltip'
import { useRouter } from 'next/navigation'

interface CurrentUser {
    fullName?: string
    username?: string
    roleName?: string
    userId?: number
    roleId?: number
    id?: number
    createdAt?: string
}

export default function UserProfileAppSider({ isCollapsed, isMobile, setIsProfileDialogOpen }: { isCollapsed: any, isMobile: any, setIsProfileDialogOpen: any }) {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
    const router = useRouter()

    // Get current user from localStorage
    useEffect(() => {
        const getCurrentUser = () => {
            if (typeof window !== 'undefined') {
                const userStr = localStorage.getItem('currentUser')
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr)
                        setCurrentUser(user)
                        return user
                    } catch {
                        return null
                    }
                }
            }
            return null
        }
        getCurrentUser()
    }, [])

    // Get initials for avatar fallback
    const getInitials = (name?: string) => {
        if (!name) return 'U'
        const parts = name.trim().split(' ')
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        }
        return name.substring(0, 2).toUpperCase()
    }

    // Get display name
    const displayName = currentUser?.fullName || currentUser?.username || 'Người dùng'
    const displayEmail = currentUser?.username || 'Chưa có thông tin'
    const displayRole = currentUser?.roleName || 'Chưa có vai trò'
    const initials = getInitials(currentUser?.fullName || currentUser?.username)

    if (!currentUser) {
        return null
    }

    return (
        <div className="flex items-center">
            {isCollapsed && !isMobile ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-full h-10">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="right" align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">{displayName}</p>
                                            <p className="text-xs text-muted-foreground">{displayEmail}</p>
                                            {displayRole && (
                                                <p className="text-xs text-muted-foreground/70">Vai trò: {displayRole}</p>
                                            )}
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Chỉnh sửa hồ sơ</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Tài khoản</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Cài đặt</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-popover text-popover-foreground border">
                            <div>
                                <p className="font-medium">{displayName}</p>
                                <p className="text-xs opacity-75">{displayEmail}</p>
                                {displayRole && (
                                    <p className="text-xs opacity-75">Vai trò: {displayRole}</p>
                                )}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 h-auto">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-sidebar-foreground">{displayName}</p>
                                    <p className="text-xs text-sidebar-foreground/70">{displayEmail}</p>
                                </div>
                            )}
                            {!isCollapsed && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{displayName}</p>
                                <p className="text-xs text-muted-foreground">{displayEmail}</p>
                                {displayRole && (
                                    <p className="text-xs text-muted-foreground/70">Vai trò: {displayRole}</p>
                                )}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/admin/profile')}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Chỉnh sửa hồ sơ</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/admin/users')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Tài khoản</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Cài đặt</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Đăng xuất</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}
