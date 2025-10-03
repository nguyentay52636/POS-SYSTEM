"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [code, setCode] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess("")

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    code: code || undefined,
                    password,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(data.message)
                setTimeout(() => {
                    router.push("/auth/login")
                }, 2000)
            } else {
                setError(data.error)
            }
        } catch (error) {
            setError("Đã xảy ra lỗi khi đặt lại mật khẩu")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-100 to-green-200 relative overflow-hidden">
                <div className="flex flex-col justify-center px-12 z-10 max-w-lg">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                        Đặt lại mật khẩu tại {" "}
                        <span className="text-green-700 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                            GroceryMart
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Hãy tạo mật khẩu mới để tiếp tục mua sắm an toàn.
                    </p>
                </div>
                <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-tl-[4rem] overflow-hidden shadow-2xl">
                    <Image
                        src="/images/retail-login.jpg"
                        alt="Grocery Store"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
            </div>

            {/* Right Side - Reset Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-6">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex flex-col items-center mb-4">
                        <Image src="/logo-grocery.png" alt="GroceryMart Logo" width={60} height={60} className="rounded-lg" />
                        <h2 className="text-2xl font-bold text-gray-800">GroceryMart</h2>
                    </div>

                    {/* Form Header */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h2>
                        <p className="text-gray-600 text-base">Nhập mật khẩu mới cho tài khoản của bạn</p>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!token && (
                            <div className="space-y-2">
                                <Label htmlFor="code">Mã xác thực</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="Nhập mã xác thực từ SMS"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu mới</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu mới"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-12"
                                    required
                                />
                                <Button
                                    variant={"ghost"}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 pr-12"
                                    required
                                />
                                <Button
                                    variant={"ghost"}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-all" disabled={isLoading}>
                            {isLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                        </Button>
                    </form>

                    <div className="text-center mt-4">
                        <Link href="/auth/login" className="inline-flex items-center text-sm text-green-700 hover:text-green-800 font-medium transition-colors">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}