package com.milkstore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "NGUOI_DUNG")
public class UserAccount {

    @Id
    @Column(name = "MA_TAI_KHOAN", nullable = false, length = 50)
    private String maTaiKhoan;

    @Column(name = "TEN_TAI_KHOAN", nullable = false, length = 150)
    private String tenTaiKhoan;

    @Column(name = "MAT_KHAU", nullable = false)
    private String matKhau;

    @Column(name = "PHAN_QUYEN", nullable = false)
    private Integer phanQuyen = 1;

    @Column(name = "MA_CONG_TY", nullable = false, length = 20)
    private String maCongTy = "01";

    @Column(name = "HIEN_HD", nullable = false)
    private Integer hienHd = 1;

    @Column(name = "MA_CUA_HANG", length = 20)
    private String maCuaHang;

    public String getMaTaiKhoan() {
        return maTaiKhoan;
    }

    public void setMaTaiKhoan(String maTaiKhoan) {
        this.maTaiKhoan = maTaiKhoan;
    }

    public String getTenTaiKhoan() {
        return tenTaiKhoan;
    }

    public void setTenTaiKhoan(String tenTaiKhoan) {
        this.tenTaiKhoan = tenTaiKhoan;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public Integer getPhanQuyen() {
        return phanQuyen;
    }

    public void setPhanQuyen(Integer phanQuyen) {
        this.phanQuyen = phanQuyen;
    }

    public String getMaCongTy() {
        return maCongTy;
    }

    public void setMaCongTy(String maCongTy) {
        this.maCongTy = maCongTy;
    }

    public Integer getHienHd() {
        return hienHd;
    }

    public void setHienHd(Integer hienHd) {
        this.hienHd = hienHd;
    }

    public String getMaCuaHang() {
        return maCuaHang;
    }

    public void setMaCuaHang(String maCuaHang) {
        this.maCuaHang = maCuaHang;
    }
}
