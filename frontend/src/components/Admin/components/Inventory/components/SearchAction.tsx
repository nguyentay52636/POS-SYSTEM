import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '@/components/ui/input'

interface SearchActionProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
}

export default function SearchAction({ searchTerm, setSearchTerm }: SearchActionProps) {
    return (
        <Card className="">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Tìm kiếm theo tên sản phẩm, mã tồn kho..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

