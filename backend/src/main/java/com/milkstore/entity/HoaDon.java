package com.milkstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_HOADON")
public class HoaDon {

    @Id
    @Column(name = "MA_HOA_DON", length = 50)
    private String maHoaDon;

    @Column(name = "MA_CHI_NHANH", nullable = false, length = 20)
    private String maChiNhanh;

    @Column(name = "SO_TIEN_HOA_DON", nullable = false, precision = 18, scale = 2)
    private BigDecimal soTienHoaDon;

    @Column(name = "MA_KHACH_HANG", length = 20)
    private String maKhachHang;

    @Column(name = "SDT_KHACH_HANG", length = 20)
    private String sdtKhachHang;

    @Column(name = "NHAN_VIEN_BAN", length = 100, columnDefinition = "NVARCHAR(100)")
    private String nhanVienBan;

    @Column(name = "HINH_THUC_THANH_TOAN", length = 10)
    private String hinhThucThanhToan; // "TM" hoặc "CK"

    @Column(name = "XUAT_VAT", length = 20)
    private String xuatVat; // "DA_XUAT_VAT" hoặc "CHUA_XUAT_VAT"

    @Column(name = "NGAY_GIO_TAO", nullable = false)
    private LocalDateTime ngayGioTao;

    // Getters and Setters
    public String getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(String maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public String getMaChiNhanh() {
        return maChiNhanh;
    }

    public void setMaChiNhanh(String maChiNhanh) {
        this.maChiNhanh = maChiNhanh;
    }

    public BigDecimal getSoTienHoaDon() {
        return soTienHoaDon;
    }

    public void setSoTienHoaDon(BigDecimal soTienHoaDon) {
        this.soTienHoaDon = soTienHoaDon;
    }

    public String getMaKhachHang() {
        return maKhachHang;
    }

    public void setMaKhachHang(String maKhachHang) {
        this.maKhachHang = maKhachHang;
    }

    public String getSdtKhachHang() {
        return sdtKhachHang;
    }

    public void setSdtKhachHang(String sdtKhachHang) {
        this.sdtKhachHang = sdtKhachHang;
    }

    public String getNhanVienBan() {
        return nhanVienBan;
    }

    public void setNhanVienBan(String nhanVienBan) {
        this.nhanVienBan = nhanVienBan;
    }

    public String getHinhThucThanhToan() {
        return hinhThucThanhToan;
    }

    public void setHinhThucThanhToan(String hinhThucThanhToan) {
        this.hinhThucThanhToan = hinhThucThanhToan;
    }

    public String getXuatVat() {
        return xuatVat;
    }

    public void setXuatVat(String xuatVat) {
        this.xuatVat = xuatVat;
    }

    public LocalDateTime getNgayGioTao() {
        return ngayGioTao;
    }

    public void setNgayGioTao(LocalDateTime ngayGioTao) {
        this.ngayGioTao = ngayGioTao;
    }
}
