"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { selectAuth } from "@/redux/Slice/authSlice"
import type { IUser } from "@/types/types"
import ProfileHeader from "./components/ProfileHeader"

interface ProfileStats {
    articles: number
    savedDocs: number
    comments: number
    reactions: number
}

export default function Profile() {
    const { isAuthenticated, user } = useSelector(selectAuth) as { isAuthenticated: boolean; user: IUser | null }

    // Mock data - replace with actual API calls



    if (!user) return null

    return (
        <div className="min-h-screen flex flex-col bg-background">

            <main className="flex-1 py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Profile Header */}
                        <ProfileHeader user={user} />

                    </div>
                </div>
            </main>

        </div>
    )
}