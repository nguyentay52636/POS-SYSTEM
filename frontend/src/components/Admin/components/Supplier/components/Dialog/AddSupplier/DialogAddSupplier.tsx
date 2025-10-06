import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { ISupplier } from '@/types/types'

interface DialogAddSupplierProps {
    isAddDialogOpen: boolean
    setIsAddDialogOpen: (open: boolean) => void
    handleAddSupplier: (data: Partial<ISupplier>) => void
}

export default function DialogAddSupplier({
    isAddDialogOpen,
    setIsAddDialogOpen,
    handleAddSupplier
}: DialogAddSupplierProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.name && formData.phone && formData.email && formData.address) {
            handleAddSupplier(formData)
            setFormData({ name: '', phone: '', email: '', address: '' })
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <>
            <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 text-white hover:bg-green-800 cursor-pointer bg-green-700"
            >
                <Plus className="h-4 w-4 mr-2" />
                Thêm nhà cung cấp
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            Thêm nhà cung cấp mới
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin nhà cung cấp</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Tên nhà cung cấp *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Nhập tên nhà cung cấp"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone">Số điện thoại *</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="Nhập email"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address">Địa chỉ *</Label>
                                    <Textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Nhập địa chỉ"
                                        rows={3}
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsAddDialogOpen(false)
                                    setFormData({ name: '', phone: '', email: '', address: '' })
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Thêm nhà cung cấp
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
