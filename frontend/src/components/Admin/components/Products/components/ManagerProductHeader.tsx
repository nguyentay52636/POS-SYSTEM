import React from 'react'
import { Package } from 'lucide-react'
export default function ManagerProductHeader() {
    return (
        <>
            <header className="bg-white border-b shadow-sm backdrop-blur-sm bg-white/95 mx-4!">
                <div className="flex h-16 items-center px-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Package className="h-6 w-6 text-green-700" />
                            </div>
                            <div className='m-'>
                                <h1 className="text-3xl text-dark! font-bold  bg-clip-text ">
                                    Quản lý danh mục và sản phẩm
                                </h1>
                                <p className="text-sm text-gray-500">Bach Hoa Xanh Admin Dashboard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
