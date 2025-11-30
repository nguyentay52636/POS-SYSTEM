"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectAuth } from "@/redux/Slice/authSlice"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthenticated } = useSelector(selectAuth)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login")
        } else {
            setIsLoading(false)
        }
    }, [isAuthenticated, router])

    if (isLoading) {
        return null
    }

    return <>{children}</>
}
