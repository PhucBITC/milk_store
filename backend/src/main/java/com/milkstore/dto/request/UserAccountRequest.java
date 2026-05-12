package com.milkstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserAccountRequest {

    @NotBlank(message = "TEN_TAI_KHOAN is required")
    private String tenTaiKhoan;

    @NotBlank(message = "MAT_KHAU is required")
    private String matKhau;

    @NotNull(message = "PHAN_QUYEN is required")
    private Integer phanQuyen;

    @NotBlank(message = "MA_CONG_TY is required")
    private String maCongTy;

    @NotNull(message = "HIEN_HD is required")
    private Integer hienHd;

    private String maCuaHang;

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
