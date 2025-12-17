import React from 'react'
import { Search, Filter, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FilterSearchUserProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    handleExportExcel: () => void;
}

export default function FilterSearchUser({ searchQuery, setSearchQuery, handleExportExcel }: FilterSearchUserProps) {
    return (
        <>
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm tài khoản..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-140 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                </div>
                <Button variant="outline" size="sm" className="hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportExcel}
                    className="hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 hover:border-green-300 bg-transparent"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Xuất Excel
                </Button>
            </div>
        </>
    )
}
