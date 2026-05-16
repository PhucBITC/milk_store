package com.milkstore.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CheckoutRequest {
    private String maChiNhanh;
    private String maKhachHang;
    private String sdtKhachHang;
    private String nhanVienBan;
    private String hinhThucThanhToan; // "TM" hoặc "CK"
    private String xuatVat;           // "DA_XUAT_VAT" hoặc "CHUA_XUAT_VAT"
    private BigDecimal tongTien;
    private BigDecimal giamGia;
    private List<CartItemDTO> items;

    @Data
    public static class CartItemDTO {
        private String maHang;
        private Integer soLuong;
        private BigDecimal donGia;
        private BigDecimal thanhTien;
        private String dvt;
    }
}
