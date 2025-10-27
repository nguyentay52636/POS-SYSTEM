"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Customer, CustomerInput } from "@/apis/customerApi";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: CustomerInput) => Promise<void> | void;
  editing?: Customer | null; // có => chế độ sửa, không => thêm mới
  busy?: boolean;
};

export default function CustomerFormDialog({ open, onClose, onSave, editing, busy }: Props) {
  const [form, setForm] = React.useState<CustomerInput>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  React.useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name ?? "",
        phone: editing.phone ?? "",
        email: editing.email ?? "",
        address: editing.address ?? "",
      });
    } else {
      setForm({ name: "", phone: "", email: "", address: "" });
    }
  }, [editing]);

  const handleChange =
    (k: keyof CustomerInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validate nhẹ
    if (!form.name.trim()) return alert("Vui lòng nhập tên khách hàng");
    await onSave({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !busy && !v ? onClose() : null}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Sửa khách hàng" : "Thêm khách hàng"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tên</label>
            <Input value={form.name} onChange={handleChange("name")} placeholder="Nguyễn Văn A" />
          </div>
          <div>
            <label className="text-sm font-medium">Điện thoại</label>
            <Input value={form.phone} onChange={handleChange("phone")} placeholder="0901234567" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={form.email} onChange={handleChange("email")} placeholder="email@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium">Địa chỉ</label>
            <Input value={form.address} onChange={handleChange("address")} placeholder="123 Lê Lợi, Q1, HCMC" />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              Hủy
            </Button>
            <Button type="submit" disabled={busy}>
              {editing ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
