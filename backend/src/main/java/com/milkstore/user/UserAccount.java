package com.milkstore.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "nguoi_dung")
public class UserAccount {

    @Id
    @Column(name = "ma_tai_khoan", nullable = false, length = 50)
    private String maTaiKhoan;

    @Column(name = "ten_tai_khoan", nullable = false, length = 150)
    private String tenTaiKhoan;

    @Column(name = "mat_khau", nullable = false)
    private String matKhau;

    @Column(name = "phan_quyen", nullable = false)
    private Integer phanQuyen = 1;

    @Column(name = "ma_cong_ty", nullable = false, length = 20)
    private String maCongTy = "01";

    @Column(name = "ma_may", nullable = false, length = 20)
    private String maMay = "00";

    @Column(name = "hien_hd", nullable = false)
    private Integer hienHd = 1;

    @Column(name = "ma_cua_hang", length = 20)
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

    public String getMaMay() {
        return maMay;
    }

    public void setMaMay(String maMay) {
        this.maMay = maMay;
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
