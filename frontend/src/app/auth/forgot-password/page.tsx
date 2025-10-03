"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function page() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setIsLoading(false)
        setIsSubmitted(true)
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex">
                {/* Left Side - Hero Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20" />

                    {/* Decorative Elements */}
                    <div className="absolute top-24 right-20 w-36 h-36 bg-green-200/30 rounded-full blur-xl" />
                    <div className="absolute bottom-36 left-12 w-24 h-24 bg-green-300/40 rounded-full blur-lg" />



                    {/* Hero Content */}
                    <div className="flex flex-col justify-center px-12 z-10 max-w-lg">
                        <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
                            Hỗ trợ{" "}
                            <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                luôn sẵn sàng!
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Chúng tôi luôn ở đây để giúp bạn quay trở lại với cộng đồng SocialVibe.
                        </p>
                    </div>

                    {/* Hero Image */}
                    <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-tl-[4rem] overflow-hidden shadow-2xl">
                        <Image
                            src="/images/retail-forgot-password.jpg"
                            alt="Support and community"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                </div>

                {/* Right Side - Success Message */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md text-center space-y-8">
                        {/* Success Icon */}
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                        </div>

                        {/* Success Message */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Email đã được gửi!</h2>
                            <p className="text-gray-600 text-lg mb-6">Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email:</p>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                                <p className="font-medium text-green-800">{email}</p>
                            </div>
                            <p className="text-sm text-gray-500 mb-8">
                                Vui lòng kiểm tra hộp thư đến và thư mục spam. Link sẽ hết hạn sau 15 phút.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <Button
                                onClick={() => setIsSubmitted(false)}
                                className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-all"
                            >
                                Gửi lại email
                            </Button>

                            <Link href="/auth/login">
                                <Button
                                    variant="outline"
                                    className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-all"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Quay lại đăng nhập
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20" />

                {/* Decorative Elements */}
                <div className="absolute top-24 right-20 w-36 h-36 bg-green-200/30 rounded-full blur-xl" />
                <div className="absolute bottom-36 left-12 w-24 h-24 bg-green-300/40 rounded-full blur-lg" />

                {/* Logo */}
                <div className="absolute top-8 left-8 z-10">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                            Social<span className="text-pink-500">Vibe</span>
                        </span>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="flex flex-col justify-center px-12 z-10 max-w-lg">
                    <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
                        Đừng lo lắng,{" "}
                        <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                            chúng tôi sẽ giúp bạn!
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Quên mật khẩu là chuyện bình thường. Chỉ cần vài bước đơn giản để lấy lại quyền truy cập.
                    </p>
                </div>

                {/* Hero Image */}
                <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-tl-[4rem] overflow-hidden shadow-2xl">
                    <Image
                        src="/images/retail-forgot-password.jpg"
                        alt="Support and community"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
            </div>

            {/* Right Side - Forgot Password Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                            Social<span className="text-pink-500">Vibe</span>
                        </span>
                    </div>

                    {/* Form Header */}
                    <div className="text-center lg:text-left">
                        <div className="flex justify-center lg:justify-start mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h2>
                        <p className="text-gray-600 text-lg">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
                    </div>

                    {/* Forgot Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Địa chỉ Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 px-4 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg transition-colors"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 cursor-pointer bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Đang gửi...</span>
                                </div>
                            ) : (
                                "Gửi hướng dẫn"
                            )}
                        </Button>

                        <Link href="/auth/login">
                            <Button
                                variant="outline"
                                className="w-full h-12 border-gray-300 text-gray-700 hover:text-black cursor-pointer hover:bg-gray-50 font-medium rounded-lg transition-all"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại đăng nhập
                            </Button>
                        </Link>
                    </form>

                    {/* Help Text */}
                    <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                            💡 <strong>Mẹo:</strong> Nếu không thấy email, hãy kiểm tra thư mục spam hoặc thư rác.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}