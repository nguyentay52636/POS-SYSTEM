"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormEmployee from "./FormEmployee";
import { IUser } from "@/types/types";
import { CreateUserRequest, UpdateUserRequest, createUser, updateUser } from "@/apis/userApi";

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess: (data: IUser, isEdit: boolean) => void;
    editingUser?: IUser | null;
    busy?: boolean;
};

export default function DialogAddEmployee({
    open,
    onClose,
    onSuccess,
    editingUser,
    busy,
}: Props) {
    const isEdit = !!editingUser;

    const handleSubmit = async (formData: any) => {
        try {
            if (isEdit && editingUser) {
                // Update
                const updateData: UpdateUserRequest = {
                    username: formData.username,
                    fullName: formData.fullName,
                    role: formData.role,
                };
                const updated = await updateUser(editingUser.user_id, updateData);
                onSuccess(updated, true);
            } else {
                // Create
                const createData: CreateUserRequest = {
                    username: formData.username,
                    password: formData.password || "",
                    fullName: formData.fullName,
                    role: formData.role,
                };
                const created = await createUser(createData);
                onSuccess(created, false);
            }
            onClose();
        } catch (error) {
            console.error("Failed to save employee:", error);
            // Optionally handle error here (toast/alert)
            alert("Có lỗi xảy ra khi lưu nhân viên");
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Chi tiết nhân viên" : "Thêm nhân viên"}</DialogTitle>
                </DialogHeader>

                <FormEmployee
                    id="employee-form"
                    onSubmit={handleSubmit}
                    initialData={editingUser}
                    isEdit={isEdit}
                />

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
                        Hủy
                    </Button>
                    <Button type="submit" form="employee-form" disabled={busy}>
                        {isEdit ? "Lưu thay đổi" : "Thêm nhân viên"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
