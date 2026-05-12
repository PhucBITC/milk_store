package com.milkstore.dto.request;

import jakarta.validation.constraints.NotBlank;

public class NhomChuRequest {

    @NotBlank(message = "TENNHOM is required")
    private String tenNhom;

    private String ghiChu;

    public String getTenNhom() {
        return tenNhom;
    }

    public void setTenNhom(String tenNhom) {
        this.tenNhom = tenNhom;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }
}
