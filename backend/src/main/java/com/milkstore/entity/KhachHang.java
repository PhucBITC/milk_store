package com.milkstore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_KHACHHANG")
public class KhachHang {

    @Id
    @Column(name = "MAKHACHHANG", nullable = false, length = 20)
    private String maKhachHang;

    @Column(name = "TENKHACHHANG", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String tenKhachHang;

    @Column(name = "SODT", length = 30)
    private String soDt;

    @Column(name = "MASOTHUE", length = 50)
    private String maSoThue;

    @Column(name = "DIACHI", length = 500, columnDefinition = "NVARCHAR(500)")
    private String diaChi;

    @Column(name = "MAQUANHENGANSACH", length = 50)
    private String maQuanHeNganSach;

    @Column(name = "CCCD", length = 30)
    private String cccd;

    @Column(name = "NGAYTAO")
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
