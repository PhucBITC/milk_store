package com.milkstore.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TheKhoResponse {
    private Long id;
    private LocalDateTime ngayThucHien;
    private String maHangHoa;
    private String tenHangHoa;      // Tên hàng (join từ TB_HANGHOA)
    private String maKho;
    private String tenKho;          // Tên kho (join từ TB_KHO)
    private String loaiPhieu;       // NHAP / XUAT / CHUYEN
    private String soPhieu;         // Mã phiếu gốc
    private BigDecimal soLuongThayDoi; // Dương=nhập, Âm=xuất
    private BigDecimal tonCuoi;     // Tồn tại kho sau biến động
    private String ghiChu;
}
