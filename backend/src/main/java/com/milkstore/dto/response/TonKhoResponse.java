package com.milkstore.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TonKhoResponse {
    private String maHangHoa;
    private String tenHangHoa;      // Tên hàng (join từ TB_HANGHOA)
    private String maKho;
    private String tenKho;          // Tên kho (join từ TB_KHO)
    private BigDecimal soLuongTong; // Tồn hiện tại
    private BigDecimal donGia;      // Giá vốn đang áp dụng
    private BigDecimal giaTriTon;   // Giá trị tồn = soLuong * donGia
}
