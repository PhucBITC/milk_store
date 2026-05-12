package com.milkstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserRegisterRequest {

    @NotBlank(message = "MA_TAI_KHOAN is required")
    private String maTaiKhoan;

    @NotBlank(message = "TEN_TAI_KHOAN is required")
    private String tenTaiKhoan;

    @NotBlank(message = "MAT_KHAU is required")
    private String matKhau;

    @NotNull(message = "PHAN_QUYEN is required")
    private Integer phanQuyen;

    @NotBlank(message = "MA_CONG_TY is required")
    private String maCongTy;

    private Integer hienHd = 1;

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
