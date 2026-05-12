package com.milkstore.dto.request;

import jakarta.validation.constraints.NotBlank;

public class NhomHangRequest {

    @NotBlank(message = "MANHOM is required")
    private String maNhomChu;

    @NotBlank(message = "TENNHOMHANG is required")
    private String tenNhomHang;

    private String ghiChu;

    public String getMaNhomChu() {
        return maNhomChu;
    }

    public void setMaNhomChu(String maNhomChu) {
        this.maNhomChu = maNhomChu;
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
}
