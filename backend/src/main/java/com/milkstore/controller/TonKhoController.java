package com.milkstore.controller;

import com.milkstore.dto.response.TonKhoResponse;
import com.milkstore.service.impl.TonKhoServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ton-kho")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TonKhoController {

    private final TonKhoServiceImpl tonKhoService;

    /** GET /api/ton-kho — Toàn bộ tồn kho mọi chi nhánh */
    @GetMapping
    public List<TonKhoResponse> getAll() {
        return tonKhoService.getAll();
    }

    /** GET /api/ton-kho/kho/{maKho} — Tồn kho của 1 chi nhánh cụ thể */
    @GetMapping("/kho/{maKho}")
    public List<TonKhoResponse> getByKho(@PathVariable String maKho) {
        return tonKhoService.getByMaKho(maKho);
    }

    /** GET /api/ton-kho/hang/{maHang} — Tồn 1 mặt hàng qua các kho */
    @GetMapping("/hang/{maHang}")
    public List<TonKhoResponse> getByHang(@PathVariable String maHang) {
        return tonKhoService.getByMaHangHoa(maHang);
    }
}
