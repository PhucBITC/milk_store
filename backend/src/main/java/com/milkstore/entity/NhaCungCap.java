package com.milkstore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_NHACUNGCAP")
public class NhaCungCap {

    @Id
    @Column(name = "MANHACUNGCAP", nullable = false, length = 20)
    private String maNhaCungCap;

    @Column(name = "TENNHACUNGCAP", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String tenNhaCungCap;

    @Column(name = "MASOTHUE", length = 50)
    private String maSoThue;

    @Column(name = "DIACHI", length = 500, columnDefinition = "NVARCHAR(500)")
    private String diaChi;

    @Column(name = "SODT", length = 30)
    private String soDt;

    @Column(name = "NHANVIENSALE", length = 255, columnDefinition = "NVARCHAR(255)")
    private String nhanVienSale;

    @Column(name = "NGAYTAO")
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
