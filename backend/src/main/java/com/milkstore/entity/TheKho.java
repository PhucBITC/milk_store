package com.milkstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_THEKHO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheKho {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NGAY_THUC_HIEN")
    private LocalDateTime ngayThucHien;

    @Column(name = "MA_HANG_HOA")
    private String maHangHoa;

    @Column(name = "MA_KHO")
    private String maKho;

    @Column(name = "LOAI_PHIEU") // 'NHAP', 'XUAT', 'CHUYEN'
    private String loaiPhieu;

    @Column(name = "SO_PHIEU") // MaPhieuNhap hoặc MaHoaDon
    private String soPhieu;

    @Column(name = "SO_LUONG_THAY_DOI")
    private BigDecimal soLuongThayDoi; // Dương nếu nhập, âm nếu xuất

    @Column(name = "TON_CUOI")
    private BigDecimal tonCuoi; // Số tồn tại kho đó SAU KHI thực hiện phiếu này

    @Column(name = "GHI_CHU")
    private String ghiChu;
}
