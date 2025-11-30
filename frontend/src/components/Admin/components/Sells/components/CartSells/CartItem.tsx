import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, X } from "lucide-react"

interface CartItemProps {
    cart: any[]
    updateQuantity: (productId: number, quantity: number) => void
    removeFromCart: (productId: number) => void
}

export default function CartItem({ cart, updateQuantity, removeFromCart }: CartItemProps) {
    return (
        <>
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-5">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                            <div className="p-8 bg-gray-50 rounded-full mb-6 shadow-sm">
                                <ShoppingCart className="h-16 w-16" />
                            </div>
                            <p className="text-lg font-semibold mb-2 text-gray-600">Giỏ hàng trống</p>
                            <p className="text-sm text-center text-gray-500 max-w-xs">Chọn sản phẩm từ danh sách bên trái để thêm vào giỏ hàng</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <Card
                                    key={item.product.product_id}
                                    className="border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gray-500!"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <div className="relative">
                                                <img
                                                    src={item.product.image || "/placeholder.svg"}
                                                    alt={item.product.product_name}
                                                    className="w-16 h-16 rounded-lg object-cover border border-green-200 shadow-sm"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm mb-1 line-clamp-2 text-gray-800">
                                                    {item.product.product_name}
                                                </h4>
                                                <p className="text-xs text-gray-600 mb-3 font-medium">
                                                    {item.product.price.toLocaleString("vi-VN")}đ / {item.product.unit}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.product.product_id, item.quantity - 1)}
                                                            className="h-7 w-7 p-0 border border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="font-semibold w-8 text-center text-sm">{item.quantity}</span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.product.product_id, item.quantity + 1)}
                                                            className="h-7 w-7 p-0 border border-gray-200 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => removeFromCart(item.product.product_id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <Separator className="my-3" />
                                        <div className="flex justify-between items-center bg-green-50 p-2.5 rounded-lg border border-green-100">
                                            <span className="text-xs font-medium text-gray-600">Thành tiền:</span>
                                            <span className="font-bold text-sm text-green-700">
                                                {item.subtotal.toLocaleString("vi-VN")}đ
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </>
    )
}
