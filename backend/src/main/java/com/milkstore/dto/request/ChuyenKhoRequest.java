package com.milkstore.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ChuyenKhoRequest {
    private String maHangHoa;
    private String maKhoNguon;
    private String maKhoDich;
    private BigDecimal soLuong;
    private String donViTinh;
    private String maNhanVien;
    private String lyDo;
}
