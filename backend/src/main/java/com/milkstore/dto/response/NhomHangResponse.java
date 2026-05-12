package com.milkstore.dto.response;

import java.time.LocalDateTime;

public class NhomHangResponse {

    private String maNhomHang;
    private String tenNhomHang;
    private String ghiChu;
    private LocalDateTime ngayTao;
    private String maNhomChu;
    private String tenNhomChu;

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
