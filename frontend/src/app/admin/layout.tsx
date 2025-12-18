"use client"

import { useLayoutEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectAuth } from "@/redux/Slice/authSlice"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthenticated, user } = useSelector(selectAuth)
    const [isLoading, setIsLoading] = useState(true)

    useLayoutEffect(() => {
        if (!isAuthenticated || !user) {
            router.replace("/auth/login")
        } else {
            setIsLoading(false)
        }
    }, [isAuthenticated, user, router])

    if (isLoading) {
        return null
    }

    return <>{children}</>
}
