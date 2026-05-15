package com.milkstore.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "TB_HOADON_CHITIET")
public class HoaDonChiTiet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "MA_HOA_DON", length = 50, nullable = false)
    private String maHoaDon;

    @Column(name = "MA_HANG", length = 50, nullable = false)
    private String maHang;

    @Column(name = "SO_LUONG", nullable = false)
    private Integer soLuong;

    @Column(name = "DON_GIA", nullable = false, precision = 18, scale = 2)
    private BigDecimal donGia;

    @Column(name = "THANH_TIEN", nullable = false, precision = 18, scale = 2)
    private BigDecimal thanhTien;

    @Column(name = "DVT", length = 50, columnDefinition = "NVARCHAR(50)")
    private String dvt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaHoaDon() {
        return maHoaDon;
    }

    public void setMaHoaDon(String maHoaDon) {
        this.maHoaDon = maHoaDon;
    }

    public String getMaHang() {
        return maHang;
    }

    public void setMaHang(String maHang) {
        this.maHang = maHang;
    }

    public Integer getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(Integer soLuong) {
        this.soLuong = soLuong;
    }

    public BigDecimal getDonGia() {
        return donGia;
    }

    public void setDonGia(BigDecimal donGia) {
        this.donGia = donGia;
    }

    public BigDecimal getThanhTien() {
        return thanhTien;
    }

    public void setThanhTien(BigDecimal thanhTien) {
        this.thanhTien = thanhTien;
    }

    public String getDvt() {
        return dvt;
    }

    public void setDvt(String dvt) {
        this.dvt = dvt;
    }
}
