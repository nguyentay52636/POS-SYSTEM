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