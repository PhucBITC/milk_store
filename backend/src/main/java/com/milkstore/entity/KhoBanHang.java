package com.milkstore.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * TB_KHO_BAN_HANG
 * Ghi lại TẤT CẢ hàng hóa xuất ra từ hóa đơn bán hàng.
 * Mỗi dòng = 1 mặt hàng trong 1 hóa đơn.
 */
@Entity
@Table(name = "TB_KHO_BAN_HANG")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhoBanHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "MA_HOA_DON", nullable = false)
    private String maHoaDon;            // Liên kết với TB_HOADON

    @Column(name = "MA_HANG_HOA", nullable = false)
    private String maHangHoa;

    @Column(name = "MA_KHO", nullable = false)
    private String maKho;               // Chi nhánh bán

    @Column(name = "NGAY_BAN", nullable = false)
    private LocalDateTime ngayBan;

    @Column(name = "SO_LUONG", nullable = false)
    private BigDecimal soLuong;

    @Column(name = "DON_GIA")
    private BigDecimal donGia;

    @Column(name = "THANH_TIEN")
    private BigDecimal thanhTien;

    @Column(name = "DON_VI_TINH")
    private String donViTinh;

    @Column(name = "MA_KHACH_HANG")
    private String maKhachHang;

    @Column(name = "MA_NHAN_VIEN")
    private String maNhanVien;          // Nhân viên bán hàng

    @Column(name = "HINH_THUC_THANH_TOAN")
    private String hinhThucThanhToan;   // TIEN_MAT, CHUYEN_KHOAN...
}
