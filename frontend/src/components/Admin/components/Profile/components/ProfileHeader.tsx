"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Camera, Loader2, Mail, Shield } from "lucide-react"
import { useRef, useState } from "react"
import { updateUser } from "@/apis/userApi"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/redux/Slice/authSlice"
import toast from "react-hot-toast"
import type { IUser } from "@/types/types"
import { ChangePasswordDialog } from "./DialogChangePasword"

interface ProfileStats {
    articles: number
    savedDocs: number
    comments: number
    reactions: number
}

type ProfileUser = IUser & {
    avatar?: string
    email?: string
    id?: number
}

interface ProfileHeaderProps {
    user: ProfileUser
}

const getRoleBadgeColor = (roleName: string) => {
    const normalizedRole = roleName?.toUpperCase() || ""
    switch (normalizedRole) {
        case "ADMIN":
            return "bg-red-500/10 text-red-500 border-red-500/20"
        case "USER":
            return "bg-purple-500/10 text-purple-500 border-purple-500/20"
        default:
            return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
}

const getRoleLabel = (roleName: string) => {
    const normalizedRole = roleName?.toUpperCase() || ""
    switch (normalizedRole) {
        case "ADMIN":
            return "Quản trị viên"
        case "USER":
            return "Người dùng"
        default:
            return roleName
    }
}

const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `Tham gia từ tháng ${month}, ${year}`
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const roleName = typeof user.role === "string" ? user.role : (user as any).role?.name || "user"
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const dispatch = useDispatch()
    const [avatarUrl, setAvatarUrl] = useState(user.avatar)

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Vui lòng chọn file hình ảnh")
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Kích thước ảnh tối đa là 5MB")
            return
        }

        try {
            setUploading(true)
            // Fake upload: create local blob URL (replace with real API call if available)
            const newAvatarUrl = URL.createObjectURL(file)

            const userId = (user as any).user_id ?? user.id
            if (!userId) {
                toast.error("Không tìm thấy ID người dùng")
                return
            }

            // Update user with new avatar
            const updatedUser = await updateUser(userId, {
                ...user,
                avatar: newAvatarUrl,
                fullName: (user as any).full_name ?? user.fullName ?? user.username,
            } as any)

            if (updatedUser) {
                setAvatarUrl(newAvatarUrl)
                // Update Redux state
                const token = localStorage.getItem("token") || ""
                dispatch(setCredentials({ user: { ...user, avatar: newAvatarUrl } as any, token }))
                // Update localStorage
                localStorage.setItem("currentUser", JSON.stringify({ ...user, avatar: newAvatarUrl }))
                toast.success("Cập nhật ảnh đại diện thành công")
            } else {
                toast.error("Cập nhật ảnh đại diện thất bại")
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật ảnh đại diện")
            console.error("Error updating avatar:", error)
        } finally {
            setUploading(false)
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <Card className="border-2">
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Avatar with upload */}
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/10">
                            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={user.fullName || user.username || "user"} />
                            <AvatarFallback className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-purple-600 text-white">
                                {user.fullName?.charAt(0) || user.username?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {/* Overlay */}
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {uploading ? (
                                <Loader2 className="h-8 w-8 text-white animate-spin" />
                            ) : (
                                <Camera className="h-8 w-8 text-white" />
                            )}
                        </div>
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl md:text-3xl font-bold">{user.fullName || user.username}</h1>
                                <Badge className={getRoleBadgeColor(roleName)} variant="outline">
                                    <Shield className="h-3 w-3 mr-1" />
                                    {getRoleLabel(roleName)}
                                </Badge>
                                <ChangePasswordDialog
                                    triggerLabel="Quên mật khẩu"
                                    triggerVariant="outline"
                                    triggerClassName="h-9"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {user.email || user.username}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatJoinDate(user.createdAt || "")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProfileHeader

