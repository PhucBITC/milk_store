package com.milkstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
class TonKhoId implements Serializable {
    private String maHangHoa;
    private String maKho; // Ánh xạ từ cột NCC trong SQL
}

@Entity
@Table(name = "TB_TONKHO_KHO")
@IdClass(TonKhoId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TonKho {
    @Id
    @Column(name = "MAHANGHOA", length = 50)
    private String maHangHoa;

    @Id
    @Column(name = "NCC", length = 50)
    private String maKho; // Trong database của bạn cột này tên là NCC nhưng chứa mã kho

    @Column(name = "SOLUONGTONG", precision = 18, scale = 3)
    private BigDecimal soLuongTong;

    @Column(name = "DONGIA", precision = 18, scale = 2)
    private BigDecimal donGia;

    // Các cột số lượng quy đổi (nếu cần dùng sau này)
    @Column(name = "SOLUONG") private BigDecimal soLuong1;
    @Column(name = "SOLUONG2") private BigDecimal soLuong2;
    @Column(name = "SOLUONG3") private BigDecimal soLuong3;
}
