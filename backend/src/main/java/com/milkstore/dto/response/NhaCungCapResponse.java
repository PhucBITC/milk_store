package com.milkstore.dto.response;

import java.time.LocalDateTime;

public class NhaCungCapResponse {

    private String maNhaCungCap;
    private String tenNhaCungCap;
    private String maSoThue;
    private String diaChi;
    private String soDt;
    private String nhanVienSale;
    private LocalDateTime ngayTao;

    public String getMaNhaCungCap() {
        return maNhaCungCap;
    }

    public void setMaNhaCungCap(String maNhaCungCap) {
        this.maNhaCungCap = maNhaCungCap;
    }

    public String getTenNhaCungCap() {
        return tenNhaCungCap;
    }

    public void setTenNhaCungCap(String tenNhaCungCap) {
        this.tenNhaCungCap = tenNhaCungCap;
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

    public String getSoDt() {
        return soDt;
    }

    public void setSoDt(String soDt) {
        this.soDt = soDt;
    }

    public String getNhanVienSale() {
        return nhanVienSale;
    }

    public void setNhanVienSale(String nhanVienSale) {
        this.nhanVienSale = nhanVienSale;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }
}
