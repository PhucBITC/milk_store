package com.milkstore.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class HangHoaRequest {

    private String maHang;

    @NotBlank(message = "TENHANG is required")
    private String tenHang;

    @NotBlank(message = "MANHOMHANG is required")
    private String maNhomHang;

    @NotBlank(message = "MADVT is required")
    private String maDvt;

    @Min(value = 0, message = "GIABAN1 must be positive or zero")
    private BigDecimal giaBan1;

    @Min(value = 0, message = "GIABAN2 must be positive or zero")
    private BigDecimal giaBan2;

    @Min(value = 0, message = "GIABAN3 must be positive or zero")
    private BigDecimal giaBan3;

    private BigDecimal giaNhap;

    private Integer tonKho;

    private Boolean hienThi;

    private String ghiChu;

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

    public String getMaNhomHang() {
        return maNhomHang;
    }

    public void setMaNhomHang(String maNhomHang) {
        this.maNhomHang = maNhomHang;
    }

    public String getMaDvt() {
        return maDvt;
    }

    public void setMaDvt(String maDvt) {
        this.maDvt = maDvt;
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
}
