
import React from 'react'
import { Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HeaderManagerUser({ handleAddAccount }: { handleAddAccount: any }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 lg:p-8">
            <div className="space-y-2 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent leading-tight">
                            Quản lý tài khoản
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">Quản lý và theo dõi tất cả khách hàng trong hệ thống</p>

                    </div>
                </div>
            </div>
            <div className="w-full sm:w-auto">
                <Button
                    onClick={handleAddAccount}
                    className="w-full mx-8 sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2"
                >
                    <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap">Thêm tài khoản</span>
                </Button>
            </div>
        </div>
    )
}
