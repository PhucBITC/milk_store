package com.milkstore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_NHOMHANG")
public class NhomHang {

    @Id
    @Column(name = "MANHOMHANG", nullable = false, length = 20)
    private String maNhomHang;

    @Column(name = "TENNHOMHANG", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String tenNhomHang;

    @Column(name = "GHICHU", length = 500, columnDefinition = "NVARCHAR(500)")
    private String ghiChu;

    @Column(name = "NGAYTAO")
    private LocalDateTime ngayTao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MANHOM", nullable = false)
    private NhomChu nhomChu;

    public String getMaNhomHang() {
        return maNhomHang;
    }

    public void setMaNhomHang(String maNhomHang) {
        this.maNhomHang = maNhomHang;
    }

    public String getTenNhomHang() {
        return tenNhomHang;
    }

    public void setTenNhomHang(String tenNhomHang) {
        this.tenNhomHang = tenNhomHang;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public NhomChu getNhomChu() {
        return nhomChu;
    }

    public void setNhomChu(NhomChu nhomChu) {
        this.nhomChu = nhomChu;
    }
}
