"use client"

import { usePathname } from "next/navigation"
import { SiderBarAdmin } from "@/components/Admin/components/SiderBar/ SiderBarAdmin"

export default function ConditionalSidebar() {
    const pathname = usePathname()

    if (!pathname || pathname.startsWith("/auth")) {
        return null
    }

    return <SiderBarAdmin />
}


