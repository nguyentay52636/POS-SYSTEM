"use client"
import { Shield } from 'lucide-react'
import React from 'react'

export default function PermissionHeader() {
    return (
        <>
            <div className="">
                <div className="px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-green-700 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="h-7 w-7 text-white dark:text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-black">Quản Lý Phân Quyền</h1>
                            <p className="text-sm text-gray-600 dark:text-white!">
                                Cấu hình quyền truy cập cho từng vai trò trong hệ thống Bách Hoá Xanh
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
