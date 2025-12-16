    -- Tạo database mới
    CREATE DATABASE mini_sp01;
    GO

    -- Sử dụng database
    USE mini_sp01;
    GO

    -- 1. Bảng Thương hiệu
    CREATE TABLE Tbl_ThuongHieu (
        MaThuongHieu INT PRIMARY KEY IDENTITY(1,1),
        TenThuongHieu NVARCHAR(255) NOT NULL,
        TrangThai NVARCHAR(50) DEFAULT N'Hoạt động'
    );

    -- 2. Bảng Loại sản phẩm
    CREATE TABLE Tbl_Loai (
        MaLoai INT PRIMARY KEY IDENTITY(1,1),
        TenLoai NVARCHAR(255) NOT NULL,
        MoTa NVARCHAR(MAX),
        TrangThai NVARCHAR(50) DEFAULT N'Hoạt động'
    );

    -- 3. Bảng Đơn vị (NEW)
    CREATE TABLE Tbl_DonVi (
        MaDonVi INT PRIMARY KEY IDENTITY(1,1),
        TenDonVi NVARCHAR(100) NOT NULL,
        MoTa NVARCHAR(255),
        TrangThai NVARCHAR(50) DEFAULT N'Hoạt động'
    );

    -- 4. Bảng Sản phẩm
    CREATE TABLE Tbl_SanPham (
        MaSanPham INT PRIMARY KEY IDENTITY(1,1),
        TenSanPham NVARCHAR(255) NOT NULL,
        MaDonVi INT NOT NULL,             -- Thay cho DonVi text
        MaThuongHieu INT NOT NULL,
        MaLoai INT NOT NULL,
        MoTa NVARCHAR(MAX),
        GiaBan DECIMAL(18, 2),
        HinhAnh NVARCHAR(MAX),
        XuatXu NVARCHAR(100),
        HSD DATE,
        TrangThai NVARCHAR(50),
        FOREIGN KEY (MaDonVi) REFERENCES Tbl_DonVi(MaDonVi),
        FOREIGN KEY (MaThuongHieu) REFERENCES Tbl_ThuongHieu(MaThuongHieu),
        FOREIGN KEY (MaLoai) REFERENCES Tbl_Loai(MaLoai)
    );

    -- 5. Bảng Chi tiết sản phẩm (UNUSED in code)
    -- CREATE TABLE Tbl_ChiTietSanPham (
    --     MaChiTietSanPham INT PRIMARY KEY IDENTITY(1,1),
    --     MaSanPham INT NOT NULL,
    --     ThuocTinh NVARCHAR(255),
    --     GiaNhap DECIMAL(18, 2),
    --     TrangThai NVARCHAR(50),
    --     FOREIGN KEY (MaSanPham) REFERENCES Tbl_SanPham(MaSanPham)
    -- );

    -- 6. Bảng Nhân viên
    CREATE TABLE Tbl_NhanVien (
        MaNhanVien INT PRIMARY KEY IDENTITY(1,1),
        TenNhanVien NVARCHAR(255) NOT NULL,
        GioiTinh NVARCHAR(10),
        NgaySinh DATE,
        SoDienThoai VARCHAR(20),
        VaiTro NVARCHAR(50),
        TrangThai NVARCHAR(50)
    );

    -- 7. Bảng Phân quyền
    CREATE TABLE Tbl_PhanQuyen (
        MaQuyen INT PRIMARY KEY IDENTITY(1,1),
        TenQuyen NVARCHAR(100) NOT NULL,
        MoTa NVARCHAR(255)
    );

    -- 8. Bảng Tài khoản
    CREATE TABLE Tbl_TaiKhoan (
        MaTaiKhoan INT PRIMARY KEY IDENTITY(1,1),
        TenDangNhap VARCHAR(255) NOT NULL UNIQUE,
        MatKhau VARCHAR(255) NOT NULL, -- nên hash
        MaNhanVien INT NOT NULL,
        MaQuyen INT NOT NULL,
        TrangThai NVARCHAR(50),
        FOREIGN KEY (MaNhanVien) REFERENCES Tbl_NhanVien(MaNhanVien),
        FOREIGN KEY (MaQuyen) REFERENCES Tbl_PhanQuyen(MaQuyen)
    );

    -- 9. Bảng Khách hàng
    CREATE TABLE Tbl_KhachHang (
        MaKhachHang INT PRIMARY KEY IDENTITY(1,1),
        TenKhachHang NVARCHAR(255),
        SoDienThoai VARCHAR(20),
        DiaChi NVARCHAR(255),
        Email VARCHAR(255),
        DiemTichLuy INT DEFAULT 0,
        TrangThai NVARCHAR(50)
    );

    -- 10. Bảng Hóa đơn
    CREATE TABLE Tbl_HoaDon (
        MaHoaDon INT PRIMARY KEY IDENTITY(1,1),
        MaHoaDonCode AS ('HD' + RIGHT('000' + CAST(MaHoaDon AS VARCHAR(10)), 3)) PERSISTED,
        NgayLap DATETIME DEFAULT GETDATE(),
        MaNhanVien INT NOT NULL,
        MaKhachHang INT NULL,
        TongTien DECIMAL(18, 2),
        TrangThai NVARCHAR(50) DEFAULT N'Đã xuất',
        FOREIGN KEY (MaNhanVien) REFERENCES Tbl_NhanVien(MaNhanVien),
        FOREIGN KEY (MaKhachHang) REFERENCES Tbl_KhachHang(MaKhachHang)
    );

    -- 11. Bảng Chi tiết hóa đơn
    CREATE TABLE Tbl_ChiTietHoaDon (
        MaChiTietHoaDon INT PRIMARY KEY IDENTITY(1,1),
        MaHoaDon INT NOT NULL,
        MaSanPham INT NOT NULL,
        SoLuong INT NOT NULL,
        GiaBan DECIMAL(18, 2) NOT NULL,
        FOREIGN KEY (MaHoaDon) REFERENCES Tbl_HoaDon(MaHoaDon),
        FOREIGN KEY (MaSanPham) REFERENCES Tbl_SanPham(MaSanPham)
    );

    -- 12. Bảng Lịch sử tích điểm
    CREATE TABLE Tbl_LichSuTichDiem (
        MaLichSuTichDiem INT PRIMARY KEY IDENTITY(1,1),
        MaKhachHang INT NOT NULL,
        MaHoaDon INT,
        DiemCong INT DEFAULT 0,
        DiemSuDung INT DEFAULT 0,
        NgayCapNhat DATETIME DEFAULT GETDATE(),
        MoTa NVARCHAR(255),
        FOREIGN KEY (MaKhachHang) REFERENCES Tbl_KhachHang(MaKhachHang),
        FOREIGN KEY (MaHoaDon) REFERENCES Tbl_HoaDon(MaHoaDon)
    );

    -- 13. Bảng Nhà cung cấp
    CREATE TABLE Tbl_NhaCungCap (
        MaNhaCungCap INT PRIMARY KEY IDENTITY(1,1),
        TenNhaCungCap NVARCHAR(255) NOT NULL,
        DiaChi NVARCHAR(255),
        SoDienThoai VARCHAR(20),
        Email VARCHAR(255),
        TrangThai NVARCHAR(50)
    );

    -- 14. Bảng Phiếu nhập
    CREATE TABLE Tbl_PhieuNhap (
        MaPhieuNhap INT PRIMARY KEY IDENTITY(1,1),
        NgayNhap DATE DEFAULT GETDATE(),
        MaNhaCungCap INT NOT NULL,
        TongTien DECIMAL(18, 2),
        TrangThai NVARCHAR(50) DEFAULT N'Đang nhập',
        LyDoHuy NVARCHAR(MAX),
        FOREIGN KEY (MaNhaCungCap) REFERENCES Tbl_NhaCungCap(MaNhaCungCap)
    );

    -- 15. Bảng Chi tiết phiếu nhập
    CREATE TABLE Tbl_ChiTietPhieuNhap (
        MaChiTietPhieuNhap INT PRIMARY KEY IDENTITY(1,1),
        MaSanPham INT NOT NULL,
        MaPhieuNhap INT NOT NULL,
        SoLuong INT NOT NULL,
        DonGiaNhap DECIMAL(18, 2) NOT NULL,
        ThanhTien DECIMAL(18, 2) NOT NULL,
        FOREIGN KEY (MaSanPham) REFERENCES Tbl_SanPham(MaSanPham),
        FOREIGN KEY (MaPhieuNhap) REFERENCES Tbl_PhieuNhap(MaPhieuNhap)
    );

    -- 16. Bảng Khuyến mãi
    CREATE TABLE Tbl_KhuyenMai (
        MaKhuyenMai INT PRIMARY KEY IDENTITY(1,1),
        MaSanPham INT NOT NULL,
        TenKhuyenMai NVARCHAR(255),
        PhanTramGiamGia DECIMAL(5,2),
        NgayBatDau DATETIME,
        NgayKetThuc DATETIME,
        MoTa NVARCHAR(MAX),
        DieuKien NVARCHAR(MAX) NULL,
        FOREIGN KEY (MaSanPham) REFERENCES Tbl_SanPham(MaSanPham)
    );

    -- 17. Bảng Kho hàng
    CREATE TABLE Tbl_KhoHang (
        MaSanPham INT PRIMARY KEY,
        SoLuong INT DEFAULT 0,
        TrangThai NVARCHAR(50),
        TrangThaiDieuKien NVARCHAR(50) NOT NULL DEFAULT N'Bán',

        FOREIGN KEY (MaSanPham) REFERENCES Tbl_SanPham(MaSanPham)
    );


    -- 18. Bảng Lịch sử thay đổi kho (Added from code)
    CREATE TABLE Tbl_LichSuThayDoiKho (
        MaLichSu INT PRIMARY KEY IDENTITY(1,1),
        MaSanPham INT NOT NULL,
        SoLuongCu INT,
        SoLuongMoi INT,
        ChenhLech INT,
        LoaiThayDoi NVARCHAR(50),
        LyDo NVARCHAR(255),
        GhiChu NVARCHAR(255),
        MaNhanVien INT,
        NgayThayDoi DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (MaSanPham) REFERENCES Tbl_SanPham(MaSanPham),
        FOREIGN KEY (MaNhanVien) REFERENCES Tbl_NhanVien(MaNhanVien)
    );

    CREATE TABLE Tbl_ChucNang (
        MaChucNang INT PRIMARY KEY IDENTITY(1,1),
        TenChucNang NVARCHAR(255) NOT NULL,   -- Ví dụ: "Quản lý sản phẩm"
        MaCha INT NULL,                       -- Dùng cho sidebar lồng nhau (nếu có)
        DuongDan NVARCHAR(255),               -- FormName hoặc URL
        MoTa NVARCHAR(255)
    );


    CREATE TABLE Tbl_LoaiQuyen (
        MaLoaiQuyen INT PRIMARY KEY IDENTITY(1,1),
        TenQuyen NVARCHAR(100) NOT NULL,      -- View / Create / Update / Delete
        MoTa NVARCHAR(255)
    );


    CREATE TABLE Tbl_PhanQuyenChiTiet (
        MaPhanQuyenChiTiet INT PRIMARY KEY IDENTITY(1,1),
        MaQuyen INT NOT NULL,             -- Role
        MaChucNang INT NOT NULL,          -- Sidebar / Form
        MaLoaiQuyen INT NOT NULL,         -- View / Create / Update / Delete
        DuocPhep BIT DEFAULT 0,           -- TRUE/FALSE

        FOREIGN KEY (MaQuyen) REFERENCES Tbl_PhanQuyen(MaQuyen),
        FOREIGN KEY (MaChucNang) REFERENCES Tbl_ChucNang(MaChucNang),
        FOREIGN KEY (MaLoaiQuyen) REFERENCES Tbl_LoaiQuyen(MaLoaiQuyen)
    );

    -- 19. Bảng cấu hình lợi nhuận mặc định (chung cho toàn hệ thống)
    CREATE TABLE Tbl_CauHinhLoiNhuan (
        MaCauHinh INT PRIMARY KEY IDENTITY(1,1),
        PhanTramLoiNhuanMacDinh DECIMAL(5,2) DEFAULT 10.00, -- % lợi nhuận mặc định
        NgayCapNhat DATETIME DEFAULT GETDATE(),
        MaNhanVien INT, -- Người cập nhật
        FOREIGN KEY (MaNhanVien) REFERENCES Tbl_NhanVien(MaNhanVien)
    );

    -- 20. Bảng quy tắc lợi nhuận (chỉ hỗ trợ theo sản phẩm)
    -- % mặc định lấy từ Tbl_CauHinhLoiNhuan, không cần quy tắc "Chung"
    CREATE TABLE Tbl_QuyTacLoiNhuan (
        MaQuyTac INT PRIMARY KEY IDENTITY(1,1),
        LoaiQuyTac NVARCHAR(50) NOT NULL DEFAULT N'TheoSanPham', -- Chỉ hỗ trợ 'TheoSanPham'
        MaSanPham INT NOT NULL, -- Sản phẩm cụ thể
        PhanTramLoiNhuan DECIMAL(5,2) NOT NULL, -- % lợi nhuận cho sản phẩm này
        UuTien INT DEFAULT 1, -- Luôn = 1 (không cần ưu tiên nữa)
        TrangThai NVARCHAR(50) DEFAULT N'Hoạt động',
        NgayTao DATETIME DEFAULT GETDATE(),
        NgayCapNhat DATETIME DEFAULT GETDATE(),
        MaNhanVien INT,
        -- Các trường cũ giữ lại để tương thích, nhưng không dùng nữa
        MaLoai INT NULL,
        MaThuongHieu INT NULL,
        MaDonVi INT NULL,
        FOREIGN KEY (MaSanPham) REFERENCES Tbl_SanPham(MaSanPham),
        FOREIGN KEY (MaNhanVien) REFERENCES Tbl_NhanVien(MaNhanVien),
        -- Giữ lại foreign key cũ để tương thích với dữ liệu cũ
        FOREIGN KEY (MaLoai) REFERENCES Tbl_Loai(MaLoai),
        FOREIGN KEY (MaThuongHieu) REFERENCES Tbl_ThuongHieu(MaThuongHieu),
        FOREIGN KEY (MaDonVi) REFERENCES Tbl_DonVi(MaDonVi)
    );

    -- 21. Bảng Tbl_GiaSanPham đã được xóa vì:
    -- - Giá nhập lấy từ Tbl_ChiTietPhieuNhap
    -- - Giá bán lưu trong Tbl_SanPh23222222222222222222222222222222222222222222222222am.GiaBan
    -- - Tránh trùng lặp dữ liệu

    -- 22. Bảng cấu hình quy đổi điểm khách hàng
    CREATE TABLE Tbl_CauHinhQuyDoiDiem (
        MaCauHinh INT PRIMARY KEY IDENTITY(1,1),
        SoDiem INT NOT NULL,                    -- Số điểm (ví dụ: 100)
        SoTienTuongUng DECIMAL(18, 2) NOT NULL, -- Số tiền tương ứng (ví dụ: 100 đồng)
        NgayCapNhat DATETIME DEFAULT GETDATE(),
        MaNhanVien INT,                         -- Người cập nhật
        FOREIGN KEY (MaNhanVien) REFERENCES Tbl_NhanVien(MaNhanVien)
    );

    -- Script để thêm bảng lưu lịch sử hủy hóa đơn
-- Chạy script này để thêm bảng mới


    CREATE TABLE Tbl_LichSuHuyHoaDon (
        MaLichSuHuy INT PRIMARY KEY IDENTITY(1,1),
        MaHoaDon INT NOT NULL,
        LyDoHuy NVARCHAR(MAX),
        MaNhanVienHuy INT NOT NULL,
        NgayHuy DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (MaHoaDon) REFERENCES Tbl_HoaDon(MaHoaDon),
        FOREIGN KEY (MaNhanVienHuy) REFERENCES Tbl_NhanVien(MaNhanVien)
    );
    
    



    -- 23. Bảng liên kết Nhà cung cấp - Sản phẩm (nhiều-nhiều)
    CREATE TABLE Tbl_NhaCungCap_SanPham (
        Id INT PRIMARY KEY IDENTITY(1,1),
        MaNhaCungCap INT NOT NULL,
        MaSanPham INT NOT NULL,
        FOREIGN KEY (MaNhaCungCap) REFERENCES Tbl_NhaCungCap(MaNhaCungCap),
        FOREIGN KEY (MaSanPham) REFERENCES Tbl_SanPham(MaSanPham),
        CONSTRAINT UK_NhaCungCap_SanPham UNIQUE (MaNhaCungCap, MaSanPham)
    );

