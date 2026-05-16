-- ============================================================
-- SCRIPT TẠO BẢNG HỆ THỐNG KHO - MẸ XÍU
-- Chạy trong SQL Server Management Studio
-- ============================================================

-- 1. Bảng Phiếu Nhập Kho (Header)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TB_NHAPKHO' AND xtype='U')
CREATE TABLE TB_NHAPKHO (
    MAPHIEU     NVARCHAR(50)    NOT NULL PRIMARY KEY,
    MAKHO       NVARCHAR(50)    NOT NULL,
    MANCC       NVARCHAR(50)    NULL,
    NGAYNHAP    DATETIME        NOT NULL DEFAULT GETDATE(),
    MANHANVIEN  NVARCHAR(50)    NULL,
    TONGTIEN    DECIMAL(18,2)   NULL DEFAULT 0,
    GHICHU      NVARCHAR(500)   NULL
);

-- 2. Bảng Chi Tiết Phiếu Nhập Kho
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TB_NHAPKHO_CHITIET' AND xtype='U')
CREATE TABLE TB_NHAPKHO_CHITIET (
    ID          BIGINT          IDENTITY(1,1) PRIMARY KEY,
    MAPHIEU     NVARCHAR(50)    NOT NULL,
    MAHANGHOA   NVARCHAR(50)    NOT NULL,
    SOLUONG     DECIMAL(18,3)   NOT NULL DEFAULT 0,
    DONGIA      DECIMAL(18,2)   NULL DEFAULT 0,
    THANHTIEN   DECIMAL(18,2)   NULL DEFAULT 0,
    DONVITINH   NVARCHAR(50)    NULL,
    CONSTRAINT FK_NHAPKHO_CHITIET_PHIEU
        FOREIGN KEY (MAPHIEU) REFERENCES TB_NHAPKHO(MAPHIEU) ON DELETE CASCADE
);

-- 3. Bảng Thẻ Kho (Audit Trail tổng hợp)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TB_THEKHO' AND xtype='U')
CREATE TABLE TB_THEKHO (
    ID                  BIGINT          IDENTITY(1,1) PRIMARY KEY,
    NGAY_THUC_HIEN      DATETIME        NOT NULL DEFAULT GETDATE(),
    MA_HANG_HOA         NVARCHAR(50)    NOT NULL,
    MA_KHO              NVARCHAR(50)    NOT NULL,
    LOAI_PHIEU          NVARCHAR(20)    NOT NULL,  -- NHAP / XUAT / CHUYEN / HOAN
    SO_PHIEU            NVARCHAR(50)    NOT NULL,
    SO_LUONG_THAY_DOI   DECIMAL(18,3)   NOT NULL,
    TON_CUOI            DECIMAL(18,3)   NOT NULL,
    GHI_CHU             NVARCHAR(500)   NULL
);

-- ============================================================
-- 4. Bảng Hàng Hóa Nhập Kho (từ phiếu nhập)
-- Lưu chi tiết mỗi lần nhập hàng vào từng kho
-- ============================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TB_KHO_HANGHOA_NHAP' AND xtype='U')
CREATE TABLE TB_KHO_HANGHOA_NHAP (
    ID              BIGINT          IDENTITY(1,1) PRIMARY KEY,
    MA_PHIEU_NHAP   NVARCHAR(50)    NOT NULL,
    MA_HANG_HOA     NVARCHAR(50)    NOT NULL,
    MA_KHO          NVARCHAR(50)    NOT NULL,
    MA_NCC          NVARCHAR(50)    NULL,
    NGAY_NHAP       DATETIME        NOT NULL DEFAULT GETDATE(),
    SO_LUONG        DECIMAL(18,3)   NOT NULL,
    DON_GIA         DECIMAL(18,2)   NULL DEFAULT 0,
    THANH_TIEN      DECIMAL(18,2)   NULL DEFAULT 0,
    DON_VI_TINH     NVARCHAR(50)    NULL,
    MA_NHAN_VIEN    NVARCHAR(50)    NULL,
    GHI_CHU         NVARCHAR(500)   NULL
);

-- ============================================================
-- 5. Bảng Hàng Hóa Bán Ra (từ hóa đơn bán hàng)
-- Lưu chi tiết mỗi lần xuất hàng ra khỏi kho
-- ============================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TB_KHO_BAN_HANG' AND xtype='U')
CREATE TABLE TB_KHO_BAN_HANG (
    ID                      BIGINT          IDENTITY(1,1) PRIMARY KEY,
    MA_HOA_DON              NVARCHAR(50)    NOT NULL,
    MA_HANG_HOA             NVARCHAR(50)    NOT NULL,
    MA_KHO                  NVARCHAR(50)    NOT NULL,
    NGAY_BAN                DATETIME        NOT NULL DEFAULT GETDATE(),
    SO_LUONG                DECIMAL(18,3)   NOT NULL,
    DON_GIA                 DECIMAL(18,2)   NULL DEFAULT 0,
    THANH_TIEN              DECIMAL(18,2)   NULL DEFAULT 0,
    DON_VI_TINH             NVARCHAR(50)    NULL,
    MA_KHACH_HANG           NVARCHAR(50)    NULL,
    MA_NHAN_VIEN            NVARCHAR(50)    NULL,
    HINH_THUC_THANH_TOAN    NVARCHAR(50)    NULL
);

-- ============================================================
-- 6. Bảng Điều Chuyển Hàng Hóa Giữa Kho
-- Lưu mỗi lần chuyển hàng từ chi nhánh này sang chi nhánh khác
-- ============================================================
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TB_HANGHOA_CHUYEN_KHO' AND xtype='U')
CREATE TABLE TB_HANGHOA_CHUYEN_KHO (
    ID              BIGINT          IDENTITY(1,1) PRIMARY KEY,
    MA_PHIEU_CHUYEN NVARCHAR(50)    NOT NULL,
    MA_HANG_HOA     NVARCHAR(50)    NOT NULL,
    MA_KHO_NGUON    NVARCHAR(50)    NOT NULL,
    MA_KHO_DICH     NVARCHAR(50)    NOT NULL,
    NGAY_CHUYEN     DATETIME        NOT NULL DEFAULT GETDATE(),
    SO_LUONG        DECIMAL(18,3)   NOT NULL,
    DON_VI_TINH     NVARCHAR(50)    NULL,
    MA_NHAN_VIEN    NVARCHAR(50)    NULL,
    LY_DO           NVARCHAR(500)   NULL,
    TRANG_THAI      NVARCHAR(20)    NULL DEFAULT 'COMPLETED'  -- PENDING/COMPLETED/CANCELLED
);

-- ============================================================
-- DỮ LIỆU MẪU: Khởi tạo tồn kho cho kho 01 từ tồn hiện có
-- (Chạy 1 lần duy nhất)
-- ============================================================
INSERT INTO TB_TONKHO_KHO (MAHANGHOA, NCC, SOLUONGTONG)
SELECT MAHANGHOA, '01', TONKHO
FROM TB_HANGHOA
WHERE TONKHO > 0
  AND MAHANGHOA NOT IN (SELECT MAHANGHOA FROM TB_TONKHO_KHO WHERE NCC = '01');
