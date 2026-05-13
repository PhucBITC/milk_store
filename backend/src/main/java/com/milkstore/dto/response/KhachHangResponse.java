package com.milkstore.dto.response;

import java.time.LocalDateTime;

public class KhachHangResponse {

    private String maKhachHang;
    private String tenKhachHang;
    private String soDt;
    private String maSoThue;
    private String diaChi;
    private String maQuanHeNganSach;
    private String cccd;
    private LocalDateTime ngayTao;

    public String getMaKhachHang() {
        return maKhachHang;
    }

    public void setMaKhachHang(String maKhachHang) {
        this.maKhachHang = maKhachHang;
    }

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

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }
}
