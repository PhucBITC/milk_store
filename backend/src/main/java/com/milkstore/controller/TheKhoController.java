package com.milkstore.controller;

import com.milkstore.dto.response.TheKhoResponse;
import com.milkstore.service.impl.TheKhoServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/the-kho")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TheKhoController {

    private final TheKhoServiceImpl theKhoService;

    /** GET /api/the-kho/kho/{maKho} — Toàn bộ nhật ký biến động của 1 kho */
    @GetMapping("/kho/{maKho}")
    public List<TheKhoResponse> getByKho(@PathVariable String maKho) {
        return theKhoService.getLichSuByKho(maKho);
    }

    /** GET /api/the-kho/hang/{maHang} — Lịch sử 1 mặt hàng qua tất cả kho */
    @GetMapping("/hang/{maHang}")
    public List<TheKhoResponse> getByHang(@PathVariable String maHang) {
        return theKhoService.getLichSuByHang(maHang);
    }

    /** GET /api/the-kho/hang/{maHang}/kho/{maKho} — Lịch sử mặt hàng tại kho cụ thể */
    @GetMapping("/hang/{maHang}/kho/{maKho}")
    public List<TheKhoResponse> getByHangAndKho(@PathVariable String maHang, @PathVariable String maKho) {
        return theKhoService.getLichSuByHangAndKho(maHang, maKho);
    }

    /** GET /api/the-kho/phieu/{soPhieu} — Truy vết theo số phiếu */
    @GetMapping("/phieu/{soPhieu}")
    public List<TheKhoResponse> getByPhieu(@PathVariable String soPhieu) {
        return theKhoService.getLichSuByPhieu(soPhieu);
    }

    /** GET /api/the-kho/loai/{loaiPhieu} — Lọc theo loại (NHAP/XUAT/HOAN/CHUYEN) */
    @GetMapping("/loai/{loaiPhieu}")
    public List<TheKhoResponse> getByLoai(@PathVariable String loaiPhieu) {
        return theKhoService.getLichSuByLoaiPhieu(loaiPhieu.toUpperCase());
    }
}
