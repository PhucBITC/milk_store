package com.milkstore.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PhieuNhapKhoResponse {
    private String maPhieu;
    private String maKho;
    private String tenKho;          // Tên kho (join từ TB_KHO)
    private String maNhaCungCap;
    private String tenNhaCungCap;   // Tên NCC (join từ TB_NHACUNGCAP)
    private LocalDateTime ngayNhap;
    private String maNhanVien;
    private BigDecimal tongTien;
    private String ghiChu;
    private List<ChiTietResponse> chiTietList;

    @Data
    public static class ChiTietResponse {
        private Long id;
        private String maHangHoa;
        private String tenHangHoa;  // Tên hàng (join từ TB_HANGHOA)
        private BigDecimal soLuong;
        private BigDecimal donGia;
        private BigDecimal thanhTien;
        private String donViTinh;
    }
}
