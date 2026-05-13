package com.milkstore.dto.request;

import jakarta.validation.constraints.NotBlank;

public class KhachHangRequest {

    @NotBlank(message = "TENKHACHHANG is required")
    private String tenKhachHang;

    private String soDt;
    private String maSoThue;
    private String diaChi;
    private String maQuanHeNganSach;
    private String cccd;

    public String getTenKhachHang() {
        return tenKhachHang;
    }

    public void setTenKhachHang(String tenKhachHang) {
        this.tenKhachHang = tenKhachHang;
    }

    public String getSoDt() {
        return soDt;
    }

    public void setSoDt(String soDt) {
        this.soDt = soDt;
    }

    public String getMaSoThue() {
        return maSoThue;
    }

    public void setMaSoThue(String maSoThue) {
        this.maSoThue = maSoThue;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public String getMaQuanHeNganSach() {
        return maQuanHeNganSach;
    }

    public void setMaQuanHeNganSach(String maQuanHeNganSach) {
        this.maQuanHeNganSach = maQuanHeNganSach;
    }

    public String getCccd() {
        return cccd;
    }

    public void setCccd(String cccd) {
        this.cccd = cccd;
    }
}
