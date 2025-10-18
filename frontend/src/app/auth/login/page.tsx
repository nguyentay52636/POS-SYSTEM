"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome, Eye, EyeOff, Facebook } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { loginThunk } from "@/redux/Slice/authSlice"
import { AppDispatch, RootState } from "@/redux/store"
export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [validationErrors, setValidationErrors] = useState<{
        username?: string
        password?: string
        general?: string
    }>({})
    const router = useRouter()

    const dispatch = useDispatch<AppDispatch>()
    const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/admin")
        }
    }, [isAuthenticated, router])

    const validateUsername = (value: string) => {
        if (!value.trim()) {
            return "Vui lòng nhập email hoặc tên đăng nhập"
        }
        return value;
    }

    const validatePassword = (value: string) => {
        if (!value) {
            return "Vui lòng nhập mật khẩu"
        }
        return value;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setValidationErrors({})

        if (!validateUsername(username) || !validatePassword(password)) {
            return
        }

        try {
            const result = await dispatch(loginThunk({ username, password }))

            if (loginThunk.fulfilled.match(result)) {
                router.push("/admin")
            } else if (loginThunk.rejected.match(result)) {
                setValidationErrors({
                    general: "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại."
                })
            }
        } catch (error) {
            console.error('Login error:', error)
            setValidationErrors({
                general: "Có lỗi xảy ra. Vui lòng thử lại sau."
            })
        }
    }

    // Real-time validation handlers
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setUsername(value)

        // Clear username error when user starts typing
        if (validationErrors.username) {
            setValidationErrors(prev => ({ ...prev, username: undefined }))
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)

        // Clear password error when user starts typing
        if (validationErrors.password) {
            setValidationErrors(prev => ({ ...prev, password: undefined }))
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-100 to-green-200 relative overflow-hidden">
                <div className="flex flex-col justify-center px-12 z-10 max-w-lg">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                        Mua sắm dễ dàng tại{" "}
                        <span className="text-green-700 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                            GroceryMart
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất!
                    </p>
                    <div className="flex space-x-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-700">500+</div>
                            <div className="text-sm text-gray-600">Sản phẩm</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-700">1K+</div>
                            <div className="text-sm text-gray-600">Khách hàng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-700">10+</div>
                            <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                        </div>
                    </div>
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

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-6"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex flex-col items-center mb-4">
                        <Image
                            src="/logo-grocery.png"
                            alt="GroceryMart Logo"
                            width={60}
                            height={60}
                            className="rounded-lg"
                        />
                        <h2 className="text-2xl font-bold text-gray-800">Chào mừng đến với GroceryMart</h2>
                    </div>

                    {/* Form Header */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
                        <p className="text-gray-600 text-base">Truy cập tài khoản của bạn ngay!</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* General error message */}
                        {(error || validationErrors.general) && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error || validationErrors.general}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email hoặc Tên đăng nhập
                            </Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="Nhập email hoặc tên đăng nhập"
                                value={username}
                                onChange={handleUsernameChange}
                                className={`h-12 px-4 rounded-lg transition-colors ${validationErrors.username
                                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-green-700'
                                    }`}
                            />
                            {validationErrors.username && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.username}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Mật khẩu
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`h-12 px-4 pr-12 rounded-lg transition-colors ${validationErrors.password
                                        ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-green-700'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 hover:text-green-800 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className=" cursor-pointer! w-full h-12 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition-all hover:scale-[1.03] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className=" w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Đang đăng nhập...</span>
                                </div>
                            ) : (
                                "Đăng nhập"
                            )}
                        </Button>
                        <div className="text-right">
                            <Link
                                href="/auth/forgot-password"
                                className="text-green-700 hover:text-green-800 font-medium text-sm transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                    </form>

                    {/* Social Login */}
                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                            <Chrome className="w-5 h-5 mr-2 text-red-500" />
                            Google
                        </Button>
                        <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                            <Facebook className="w-5 h-5 mr-2 text-blue-500" />
                            Facebook
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}