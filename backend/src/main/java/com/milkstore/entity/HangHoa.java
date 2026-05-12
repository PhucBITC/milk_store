package com.milkstore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_HANGHOA")
public class HangHoa {

    @Id
    @Column(name = "MAHANG", nullable = false, length = 50)
    private String maHang;

    @Column(name = "TENHANG", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String tenHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MANHOMHANG", nullable = false)
    private NhomHang nhomHang;

    @Column(name = "DVT", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String dvt;

    @Column(name = "GIABAN", precision = 18, scale = 2)
    private BigDecimal giaBan;

    @Column(name = "GIANHAP", precision = 18, scale = 2)
    private BigDecimal giaNhap;

    @Column(name = "TONKHO")
    private Integer tonKho;

    @Column(name = "HIENTHI", nullable = false)
    private Boolean hienThi = true;

    @Column(name = "GHICHU", length = 500, columnDefinition = "NVARCHAR(500)")
    private String ghiChu;

    @Column(name = "NGAYTAO")
    private LocalDateTime ngayTao;

    public String getMaHang() {
        return maHang;
    }

    public void setMaHang(String maHang) {
        this.maHang = maHang;
    }

    public String getTenHang() {
        return tenHang;
    }

    public void setTenHang(String tenHang) {
        this.tenHang = tenHang;
    }

    public NhomHang getNhomHang() {
        return nhomHang;
    }

    public void setNhomHang(NhomHang nhomHang) {
        this.nhomHang = nhomHang;
    }

    public String getDvt() {
        return dvt;
    }

    public void setDvt(String dvt) {
        this.dvt = dvt;
    }

    public BigDecimal getGiaBan() {
        return giaBan;
    }

    public void setGiaBan(BigDecimal giaBan) {
        this.giaBan = giaBan;
    }

    public BigDecimal getGiaNhap() {
        return giaNhap;
    }

    public void setGiaNhap(BigDecimal giaNhap) {
        this.giaNhap = giaNhap;
    }

    public Integer getTonKho() {
        return tonKho;
    }

    public void setTonKho(Integer tonKho) {
        this.tonKho = tonKho;
    }

    public Boolean getHienThi() {
        return hienThi;
    }

    public void setHienThi(Boolean hienThi) {
        this.hienThi = hienThi;
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
}
