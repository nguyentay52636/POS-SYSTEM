
import React, { useState } from 'react'
import { Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DialogAddUser from './DIalog/DialogAddUser'

export default function HeaderManagerUser({ isAddDialogOpen, setIsAddDialogOpen }: { isAddDialogOpen: boolean, setIsAddDialogOpen: (open: boolean) => void }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 lg:p-8">
            <div className="space-y-2 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-700 rounded-xl flex items-center justify-center shadow-lg dark:bg-green-900/50">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent leading-tight dark:text-white!">
                            Quản lý Tài khoản
                        </h1>
                        <p className="text-gray-600 dark:text-white!">Quản lý và theo dõi tất cả khách hàng trong hệ thống</p>

                    </div>
                </div>
            </div>
            <div className="w-full sm:w-auto">


            </div>
            <DialogAddUser isAddDialogOpen={isAddDialogOpen} setIsAddDialogOpen={setIsAddDialogOpen} />
        </div>
    )
}
