package com.milkstore.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PhieuNhapKhoRequest {
    private String maKho;           // Kho nhập vào
    private String maNhaCungCap;    // Nhà cung cấp (có thể null nếu không có NCC)
    private String maNhanVien;      // Nhân viên thực hiện nhập
    private String ghiChu;          // Ghi chú phiếu

    private List<ChiTietRequest> items;

    @Data
    public static class ChiTietRequest {
        private String maHangHoa;       // Mã mặt hàng
        private BigDecimal soLuong;     // Số lượng nhập
        private BigDecimal donGia;      // Giá nhập (giá vốn)
        private String donViTinh;       // DVT lúc nhập (Thùng/Lốc/Cái)
    }
}
