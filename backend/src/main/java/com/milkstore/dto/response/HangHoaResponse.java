package com.milkstore.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class HangHoaResponse {

    private String maHang;
    private String tenHang;

    // Các trường quy đổi đơn vị tính
    private String maDvt;
    private String dvt1;
    private String dvt2;
    private String dvt3;
    private Integer qc1;
    private Integer qc2;

    // 3 mức giá sỉ lẻ
    private BigDecimal giaBan1; // Giá Thùng
    private BigDecimal giaBan2; // Giá Lốc
    private BigDecimal giaBan3; // Giá Hộp cơ sở

    private BigDecimal giaNhap;
    private Integer tonKho;
    private Boolean hienThi;
    private String ghiChu;
    private LocalDateTime ngayTao;

    // Liên kết nhóm
    private String maNhomHang;
    private String tenNhomHang;
    private String maNhomChu;
    private String tenNhomChu;

    public String getMaHang() {
        return maHang;
    }

    public void setMaHang(String maHang) {
        this.maHang = maHang;
    }

    public String getTenHang() {
        return tenHang;
    }

    public void setTenHang(String tenHang) {
        this.tenHang = tenHang;
    }

    public String getMaDvt() {
        return maDvt;
    }

    public void setMaDvt(String maDvt) {
        this.maDvt = maDvt;
    }

    public String getDvt1() {
        return dvt1;
    }

    public void setDvt1(String dvt1) {
        this.dvt1 = dvt1;
    }

    public String getDvt2() {
        return dvt2;
    }

    public void setDvt2(String dvt2) {
        this.dvt2 = dvt2;
    }

    public String getDvt3() {
        return dvt3;
    }

    public void setDvt3(String dvt3) {
        this.dvt3 = dvt3;
    }

    public Integer getQc1() {
        return qc1;
    }

    public void setQc1(Integer qc1) {
        this.qc1 = qc1;
    }

    public Integer getQc2() {
        return qc2;
    }

    public void setQc2(Integer qc2) {
        this.qc2 = qc2;
    }

    public BigDecimal getGiaBan1() {
        return giaBan1;
    }

    public void setGiaBan1(BigDecimal giaBan1) {
        this.giaBan1 = giaBan1;
    }

    public BigDecimal getGiaBan2() {
        return giaBan2;
    }

    public void setGiaBan2(BigDecimal giaBan2) {
        this.giaBan2 = giaBan2;
    }

    public BigDecimal getGiaBan3() {
        return giaBan3;
    }

    public void setGiaBan3(BigDecimal giaBan3) {
        this.giaBan3 = giaBan3;
    }

    // Tương thích ngược: trả về giaBan3 làm giá mặc định
    public BigDecimal getGiaBan() {
        return giaBan3;
    }

    // Tương thích ngược: trả về dvt3 làm đơn vị mặc định
    public String getDvt() {
        return dvt3;
    }

    public BigDecimal getGiaNhap() {
        return giaNhap;
    }

    public void setGiaNhap(BigDecimal giaNhap) {
        this.giaNhap = giaNhap;
    }

    public Integer getTonKho() {
        return tonKho;
    }

    public void setTonKho(Integer tonKho) {
        this.tonKho = tonKho;
    }

    public Boolean getHienThi() {
        return hienThi;
    }

    public void setHienThi(Boolean hienThi) {
        this.hienThi = hienThi;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public String getMaNhomHang() {
        return maNhomHang;
    }

    public void setMaNhomHang(String maNhomHang) {
        this.maNhomHang = maNhomHang;
    }

    public String getTenNhomHang() {
        return tenNhomHang;
    }

    public void setTenNhomHang(String tenNhomHang) {
        this.tenNhomHang = tenNhomHang;
    }

    public String getMaNhomChu() {
        return maNhomChu;
    }

    public void setMaNhomChu(String maNhomChu) {
        this.maNhomChu = maNhomChu;
    }

    public String getTenNhomChu() {
        return tenNhomChu;
    }

    public void setTenNhomChu(String tenNhomChu) {
        this.tenNhomChu = tenNhomChu;
    }
}
