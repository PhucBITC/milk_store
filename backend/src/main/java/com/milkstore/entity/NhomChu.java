package com.milkstore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_NHOMCHU")
public class NhomChu {

    @Id
    @Column(name = "MANHOM", nullable = false, length = 20)
    private String maNhom;

    @Column(name = "TENNHOM", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String tenNhom;

    @Column(name = "GHICHU", length = 500, columnDefinition = "NVARCHAR(500)")
    private String ghiChu;

    @Column(name = "NGAYTAO")
    private LocalDateTime ngayTao;

    public String getMaNhom() {
        return maNhom;
    }

    public void setMaNhom(String maNhom) {
        this.maNhom = maNhom;
    }

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

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }
}
