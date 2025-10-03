import { INhanVien, IUser, role } from "@/types/types"

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

export const mockUsers: IUser[] = [
  {
    user_id: 1,
    username: "admin",
    password: "hashed_password_1",
    full_name: "Admin One",
    role: role.ADMIN,
    createdAt: "2024-01-10T08:30:00Z",
    updatedAt: "2024-06-15T12:00:00Z",
  },
  {
    user_id: 2,
    username: "john.doe",
    password: "hashed_password_2",
    full_name: "John Doe",
    role: role.USER,
    createdAt: "2024-02-05T09:15:00Z",
    updatedAt: "2024-06-20T10:45:00Z",
  },
  {
    user_id: 3,
    username: "jane.smith",
    password: "hashed_password_3",
    full_name: "Jane Smith",
    role: role.USER,
    createdAt: "2024-03-12T14:00:00Z",
    updatedAt: "2024-07-01T08:20:00Z",
  },
]