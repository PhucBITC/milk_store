package com.milkstore.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * TB_HANGHOA_CHUYEN_KHO
 * Ghi lại TẤT CẢ lần điều chuyển hàng hóa giữa các chi nhánh.
 * Mỗi dòng = 1 mặt hàng trong 1 lệnh điều chuyển.
 */
@Entity
@Table(name = "TB_HANGHOA_CHUYEN_KHO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HangHoaChuyenKho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "MA_PHIEU_CHUYEN", nullable = false)
    private String maPhieuChuyen;       // Mã lệnh điều chuyển (CK001...)

    @Column(name = "MA_HANG_HOA", nullable = false)
    private String maHangHoa;

    @Column(name = "MA_KHO_NGUON", nullable = false)
    private String maKhoNguon;          // Kho xuất đi

    @Column(name = "MA_KHO_DICH", nullable = false)
    private String maKhoDich;           // Kho nhận về

    @Column(name = "NGAY_CHUYEN", nullable = false)
    private LocalDateTime ngayChuyen;

    @Column(name = "SO_LUONG", nullable = false)
    private BigDecimal soLuong;

    @Column(name = "DON_VI_TINH")
    private String donViTinh;

    @Column(name = "MA_NHAN_VIEN")
    private String maNhanVien;          // Người thực hiện điều chuyển

    @Column(name = "LY_DO")
    private String lyDo;                // Lý do điều chuyển

    @Column(name = "TRANG_THAI")
    private String trangThai;           // PENDING / COMPLETED / CANCELLED
}
