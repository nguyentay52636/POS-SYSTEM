"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IEmployee } from "@/apis/employeeApi";

// Combine request types for the form state
type EmployeeFormState = {
    fullName: string;
    phone: string;
    gender: string;
    birthDate: string;
    rolePosition: string;
    status: string;
};

type Props = {
    id: string; // form id for submitting from outside
    onSubmit: (data: EmployeeFormState) => void;
    initialData?: IEmployee | null;
    isEdit: boolean;
};

export default function FormEmployee({ id, onSubmit, initialData, isEdit }: Props) {
    const [formData, setFormData] = useState<EmployeeFormState>({
        fullName: "",
        phone: "",
        gender: "Nam",
        birthDate: "",
        rolePosition: "",
        status: "active",
    });

    useEffect(() => {
        if (initialData && isEdit) {
            setFormData({
                fullName: initialData.fullName || "",
                phone: initialData.phone || "",
                gender: initialData.gender || "Nam",
                // specific format handling for date might be needed, assuming string "YYYY-MM-DD"
                birthDate: initialData.birthDate
                    ? (typeof initialData.birthDate === 'string' ? initialData.birthDate.split('T')[0] : initialData.birthDate.toISOString().split('T')[0])
                    : "",
                rolePosition: initialData.rolePosition || "",
                status: initialData.status || "active",
            });
        } else {
            setFormData({
                fullName: "",
                phone: "",
                gender: "Nam",
                birthDate: "",
                rolePosition: "",
                status: "active",
            });
        }
    }, [initialData, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form id={id} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></Label>
                <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Điện thoại</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Số điện thoại"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="birthDate">Ngày sinh</Label>
                    <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    <Select value={formData.gender} onValueChange={(val) => handleSelectChange("gender", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Nam">Nam</SelectItem>
                            <SelectItem value="Nữ">Nữ</SelectItem>
                            <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select value={formData.status} onValueChange={(val) => handleSelectChange("status", val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Đang làm việc (active)</SelectItem>
                            <SelectItem value="inactive">Đã nghỉ (inactive)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="rolePosition">Chức vụ <span className="text-red-500">*</span></Label>
                <Input
                    id="rolePosition"
                    name="rolePosition"
                    value={formData.rolePosition}
                    onChange={handleChange}
                    placeholder="Ví dụ: Thủ kho, Nhân viên bán hàng..."
                    required
                />
            </div>
        </form>
    );
}
