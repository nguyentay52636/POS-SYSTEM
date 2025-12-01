"use client"
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { Barcode } from "lucide-react"
import { IInventory } from "@/types/types"

interface CartItemProductProps {
    inventory: IInventory
    addToCart: (inventory: IInventory) => void
}

export default function CartItemProduct({ inventory, addToCart }: CartItemProductProps) {
    const product = inventory.product

    return (
        <>
            <Card
                key={inventory.inventoryId}
                className="group cursor-pointer transition-all duration-200 border border-gray-200 hover:border-green-400 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden "
                onClick={() => addToCart(inventory)}
            >
                <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden dark:text-white text-black">
                        <img
                            src={product?.imageUrl || "/placeholder.svg"}
                            alt={product?.productName || "Sản phẩm"}
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                        />

                        <div className="absolute top-2 right-2">
                            <div className=" px-2 py-1 rounded-lg shadow-sm border border-gray-200 dark:text-white text-black">
                                <span className="text-xs font-semibold text-black flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    {inventory.quantity}
                                </span>
                            </div>
                        </div>

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center ">
                            <div className=" rounded-full p-3 shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100 bg-green-700!">
                                <Plus className="h-6 w-6 text-white! dark:text-white" strokeWidth={2} />
                            </div>
                        </div>

                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md shadow-sm dark:text-white text-black">
                            <span className="text-[10px] font-mono text-black dark:text-white flex items-center gap-1">
                                <Barcode className="h-3 w-3" />
                                {product?.barcode}
                            </span>
                        </div>
                    </div>

                    <div className="p-3 space-y-2">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-black group-hover:text-black transition-colors duration-200 dark:text-white">
                            {product?.productName}
                        </h3>

                        <div className="flex items-end justify-between gap-2 pt-1 border-t border-gray-100">
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-wide text-black mb-1 font-medium dark:text-white">
                                    Giá bán
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-lg font-bold text-black leading-none dark:text-white">
                                        {product?.price?.toLocaleString("vi-VN")}
                                    </p>
                                    <span className="text-xs font-medium text-black dark:text-white">đ</span>
                                </div>
                            </div>
                            <Badge className="text-xs font-medium px-2 py-1 bg-green-100 border border-green-200 text-black dark:text-white">
                                /{product?.unit}
                            </Badge>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-black group-hover:text-black transition-colors duration-200 dark:text-white">
                                <ShoppingCart className="h-3.5 w-3.5" />
                                <span className="dark:text-white text-black" >Nhấn để thêm</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
