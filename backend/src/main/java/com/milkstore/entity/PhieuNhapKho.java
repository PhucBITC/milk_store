package com.milkstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "TB_NHAPKHO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhieuNhapKho {
    @Id
    @Column(name = "MAPHIEU")
    private String maPhieu;

    @Column(name = "MAKHO")
    private String maKho;

    @Column(name = "MANCC")
    private String maNhaCungCap;

    @Column(name = "NGAYNHAP")
    private LocalDateTime ngayNhap;

    @Column(name = "MANHANVIEN")
    private String maNhanVien;

    @Column(name = "TONGTIEN")
    private BigDecimal tongTien;

    @Column(name = "GHICHU")
    private String ghiChu;

    @OneToMany(mappedBy = "phieuNhap", cascade = CascadeType.ALL)
    private List<PhieuNhapKhoChiTiet> chiTietList;
}
