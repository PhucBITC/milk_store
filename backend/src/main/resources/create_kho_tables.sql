-- ============================================================
-- SCRIPT TẠO BẢNG HỆ THỐNG KHO - MẸ XÍU
-- Chạy trong SQL Server Management Studio
-- ============================================================

-- 1. Bảng Phiếu Nhập Kho (Header)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TB_NHAPKHO' AND xtype='U')
CREATE TABLE TB_NHAPKHO (
    MAPHIEU     NVARCHAR(50)    NOT NULL PRIMARY KEY,
    MAKHO       NVARCHAR(50)    NOT NULL,
    MANCC       NVARCHAR(50)    NULL,           -- Có thể không có NCC
    NGAYNHAP    DATETIME        NOT NULL DEFAULT GETDATE(),
    MANHANVIEN  NVARCHAR(50)    NULL,
    TONGTIEN    DECIMAL(18,2)   NULL DEFAULT 0,
    GHICHU      NVARCHAR(500)   NULL
);

-- 2. Bảng Chi Tiết Phiếu Nhập Kho (Line Items)
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

-- 3. Bảng Thẻ Kho (Audit Trail - Nhật ký biến động)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TB_THEKHO' AND xtype='U')
CREATE TABLE TB_THEKHO (
    ID                  BIGINT          IDENTITY(1,1) PRIMARY KEY,
    NGAY_THUC_HIEN      DATETIME        NOT NULL DEFAULT GETDATE(),
    MA_HANG_HOA         NVARCHAR(50)    NOT NULL,
    MA_KHO              NVARCHAR(50)    NOT NULL,
    LOAI_PHIEU          NVARCHAR(20)    NOT NULL,  -- NHAP / XUAT / CHUYEN / HOAN
    SO_PHIEU            NVARCHAR(50)    NOT NULL,  -- Mã phiếu gốc (PN001 hoặc HD001)
    SO_LUONG_THAY_DOI   DECIMAL(18,3)   NOT NULL,  -- Dương=nhập, Âm=xuất
    TON_CUOI            DECIMAL(18,3)   NOT NULL,  -- Tồn tại kho SAU biến động
    GHI_CHU             NVARCHAR(500)   NULL
);

-- ============================================================
-- DỮ LIỆU MẪU: Khởi tạo tồn kho cho kho 01 từ tồn hiện có
-- (Chạy 1 lần duy nhất để có số liệu ban đầu)
-- ============================================================
INSERT INTO TB_TONKHO_KHO (MAHANGHOA, NCC, SOLUONGTONG)
SELECT MAHANGHOA, '01', TONKHO
FROM TB_HANGHOA
WHERE TONKHO > 0
  AND MAHANGHOA NOT IN (SELECT MAHANGHOA FROM TB_TONKHO_KHO WHERE NCC = '01');
