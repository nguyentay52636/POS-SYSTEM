import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
export default function ManagerCustomerHeader() {
    return (
        <div className="flex flex-col my-4 mx-4 md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12  bg-green-700 rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                            Quản lý Khách hàng
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">Quản lý và theo dõi tất cả khách hàng trong hệ thống</p>
                    </div>
                </div>
            </div>
          
        </div>
    )
}