package com.milkstore.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class HangHoaResponse {

    private String maHang;
    private String tenHang;
    private String dvt;
    private BigDecimal giaBan;
    private BigDecimal giaNhap;
    private Integer tonKho;
    private Boolean hienThi;
    private String ghiChu;
    private LocalDateTime ngayTao;

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

    public String getDvt() {
        return dvt;
    }

    public void setDvt(String dvt) {
        this.dvt = dvt;
    }

    public BigDecimal getGiaBan() {
        return giaBan;
    }

    public void setGiaBan(BigDecimal giaBan) {
        this.giaBan = giaBan;
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
