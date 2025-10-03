import { INhanVien } from "@/types/types"

export const mockEmployees: INhanVien[] = [
  {
    maNhanVien: "NV001",
    tenNhanVien: "Nguyen Van A",
    gioiTinh: "Nam",
    ngaySinh: "1995-05-12",
    anhDaiDien: "https://example.com/images/nv001.jpg",
    soDienThoai: "0901234567",
    vaiTro: {
      maVaiTro: "VT01",
      role: "QuanLy",
      description: "Quản lý toàn bộ cửa hàng",
    },
    trangThai: "HoatDong",
  },
  {
    maNhanVien: "NV002",
    tenNhanVien: "Tran Thi B",
    gioiTinh: "Nu",
    ngaySinh: "1998-09-20",
    anhDaiDien: "https://example.com/images/nv002.jpg",
    soDienThoai: "0912345678",
    vaiTro: {
      maVaiTro: "VT02",
      role: "NhanVien",
      description: "Nhân viên bán hàng",
    },
    trangThai: "HoatDong",
  },
  {
    maNhanVien: "NV003",
    tenNhanVien: "Le Van C",
    gioiTinh: "Nam",
    ngaySinh: "2000-01-15",
    anhDaiDien: "https://example.com/images/nv003.jpg",
    soDienThoai: "0987654321",
    vaiTro: {
      maVaiTro: "VT03",
      role: "KeToan",
      description: "Kế toán, quản lý thu chi",
    },
    trangThai: "NgungHoatDong",
  },
]

export default mockEmployees