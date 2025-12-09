"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface FormValues {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordDialogProps {
    triggerLabel?: string;
    triggerVariant?: "default" | "outline" | "secondary" | "ghost";
    triggerClassName?: string;
}

export function ChangePasswordDialog({
    triggerLabel = "Đổi mật khẩu",
    triggerVariant = "outline",
    triggerClassName,
}: ChangePasswordDialogProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

    const onSubmit = (data: FormValues) => {
        if (data.newPassword !== data.confirmPassword) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
        console.log("Đổi mật khẩu:", data);
        reset();
        alert("Đổi mật khẩu thành công!");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={triggerVariant} className={triggerClassName}>
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                    <DialogDescription>
                        Vui lòng nhập mật khẩu cũ và mật khẩu mới của bạn.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                        <Input
                            id="oldPassword"
                            type="password"
                            {...register("oldPassword", { required: "Mật khẩu cũ không được để trống" })}
                        />
                        {errors.oldPassword && (
                            <span className="text-red-500 text-sm">{errors.oldPassword.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            {...register("newPassword", { required: "Mật khẩu mới không được để trống" })}
                        />
                        {errors.newPassword && (
                            <span className="text-red-500 text-sm">{errors.newPassword.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword", { required: "Vui lòng xác nhận mật khẩu mới" })}
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="submit">Xác nhận</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
