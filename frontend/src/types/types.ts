export interface INhanVien {
    maNhanVien: string;
    tenNhanVien: string;
    gioiTinh: string;
    ngaySinh: string;
    anhDaiDien: string;
    soDienThoai: string;
    vaiTro: IVaiTro;
    trangThai: string;
}
export interface IVaiTro {
    maVaiTro: string,
    role: string,
    description: string
}
export interface SanPham  {
    maSanPham: string;
    tenSanPham: string;
    donVi: string;
    soLuongTon: number;
    maThuongHieu: string;
    maDanhMuc: string;
    maLoai: string;
    moTa: string;
    giaBan: number;
    // Optional nhập price for supplier/inventory contexts
    giaNhap?: number;
    hinhAnh: string;
    xuatXu: string;
    hsd: string; 
    trangThai: "active" | "inactive" | "out-of-stock";
    categoryName?: string;
    brandName?: string;
    typeName?: string;
    createdAt?: string;
    updatedAt?: string;
  };