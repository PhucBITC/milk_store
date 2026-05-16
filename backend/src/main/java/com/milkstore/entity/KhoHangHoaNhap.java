package com.milkstore.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * TB_KHO_HANGHOA_NHAP
 * Ghi lại TẤT CẢ hàng hóa đã được nhập vào kho từ phiếu nhập.
 * Mỗi dòng = 1 mặt hàng trong 1 phiếu nhập.
 */
@Entity
@Table(name = "TB_KHO_HANGHOA_NHAP")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhoHangHoaNhap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "MA_PHIEU_NHAP", nullable = false)
    private String maPhieuNhap;         // Liên kết với TB_NHAPKHO

    @Column(name = "MA_HANG_HOA", nullable = false)
    private String maHangHoa;

    @Column(name = "MA_KHO", nullable = false)
    private String maKho;               // Chi nhánh nhập vào

    @Column(name = "MA_NCC")
    private String maNhaCungCap;        // Nhà cung cấp

    @Column(name = "NGAY_NHAP", nullable = false)
    private LocalDateTime ngayNhap;

    @Column(name = "SO_LUONG", nullable = false)
    private BigDecimal soLuong;

    @Column(name = "DON_GIA")
    private BigDecimal donGia;

    @Column(name = "THANH_TIEN")
    private BigDecimal thanhTien;

    @Column(name = "DON_VI_TINH")
    private String donViTinh;

    @Column(name = "MA_NHAN_VIEN")
    private String maNhanVien;          // Nhân viên nhập kho

    @Column(name = "GHI_CHU")
    private String ghiChu;
}
