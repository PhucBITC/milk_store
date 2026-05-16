package com.milkstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "TB_NHAPKHO_CHITIET")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhieuNhapKhoChiTiet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "MAPHIEU")
    private PhieuNhapKho phieuNhap;

    @Column(name = "MAHANGHOA")
    private String maHangHoa;

    @Column(name = "SOLUONG")
    private BigDecimal soLuong;

    @Column(name = "DONGIA")
    private BigDecimal donGia;

    @Column(name = "THANHTIEN")
    private BigDecimal thanhTien;

    @Column(name = "DONVITINH")
    private String donViTinh;
}
