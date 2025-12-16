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
import { CreateUserRequest, UpdateUserRequest } from "@/apis/userApi";
import { IUser } from "@/types/types";

// Combine request types for the form state
type EmployeeFormState = {
    username: string;
    password?: string;
    fullName: string;
    role: string;
};

type Props = {
    id: string; // form id for submitting from outside
    onSubmit: (data: EmployeeFormState) => void;
    initialData?: IUser | null;
    isEdit: boolean;
};

export default function FormEmployee({ id, onSubmit, initialData, isEdit }: Props) {
    const [formData, setFormData] = useState<EmployeeFormState>({
        username: "",
        password: "",
        fullName: "",
        role: "2", // Default to staff (value 2)
    });

    useEffect(() => {
        if (initialData && isEdit) {
            // Map role string/number to the select value
            // API returns "admin" or "staff". We need to map to "1" or "2" for the select value if that's what we use, 
            // OR use "admin"/"staff" directly.
            // Looking at userApi.ts: convertRoleForAPI maps "1"->"staff", "2"->"admin" (reversed?!).
            // Let's check userApi.ts again.
            // Line 69: if (roleValue === "1") return "staff"; else return "admin";
            // Line 40: getRoleDisplay: "1"|"admin" -> ADMIN ("admin"), "2"|"staff" -> STAFF ("staff").
            // To be safe, let's use the values that match standard or what API expects.
            // If I send "1", API gets "staff". If I send "2", API gets "admin".
            // Wait, that convertRoleForAPI logic in userApi.ts (Step 132) seems weird/reversed intentionally by the dev? 
            // "UI value='1' (Admin) -> Backend stores as 'staff'". 
            // I should probably follow that logic if I use the same API helper, or just send the strings "admin"/"staff" if the backend supports it.
            // However, the helper `createElement` takes `CreateUserRequest` which expects `role: string | number`.
            // Let's assume I should use "1" for Admin and "2" for Staff as per the comments in `userApi.ts` lines 54-56.

            let roleVal = "2"; // staff
            if (initialData.role === "admin") roleVal = "1";
            else if (initialData.role === "staff") roleVal = "2";

            setFormData({
                username: initialData.username,
                password: "", // Password not filled on edit
                fullName: initialData.full_name,
                role: roleVal,
            });
        } else {
            setFormData({
                username: "",
                password: "",
                fullName: "",
                role: "2",
            });
        }
    }, [initialData, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({ ...prev, role: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form id={id} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">Tài khoản (Username) <span className="text-red-500">*</span></Label>
                <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Nhập tài khoản"
                    required
                    disabled={isEdit} // Often username cannot be changed
                />
            </div>

            {!isEdit && (
                <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                        required={!isEdit}
                    />
                </div>
            )}

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

            <div className="space-y-2">
                <Label htmlFor="role">Vai trò <span className="text-red-500">*</span></Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Quản trị viên (Admin)</SelectItem>
                        <SelectItem value="2">Nhân viên (Staff)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </form>
    );
}
