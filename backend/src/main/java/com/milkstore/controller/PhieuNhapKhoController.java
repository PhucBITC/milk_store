package com.milkstore.controller;

import com.milkstore.dto.request.PhieuNhapKhoRequest;
import com.milkstore.dto.response.PhieuNhapKhoResponse;
import com.milkstore.service.PhieuNhapKhoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nhap-kho")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PhieuNhapKhoController {

    private final PhieuNhapKhoService phieuNhapKhoService;

    /** GET /api/nhap-kho — Danh sách tất cả phiếu nhập */
    @GetMapping
    public List<PhieuNhapKhoResponse> getAll() {
        return phieuNhapKhoService.getAllPhieuNhap();
    }

    /** GET /api/nhap-kho/{maPhieu} — Chi tiết 1 phiếu nhập */
    @GetMapping("/{maPhieu}")
    public PhieuNhapKhoResponse getByMaPhieu(@PathVariable String maPhieu) {
        return phieuNhapKhoService.getByMaPhieu(maPhieu);
    }

    /** GET /api/nhap-kho/kho/{maKho} — Phiếu nhập theo kho */
    @GetMapping("/kho/{maKho}")
    public List<PhieuNhapKhoResponse> getByMaKho(@PathVariable String maKho) {
        return phieuNhapKhoService.getByMaKho(maKho);
    }

    /** GET /api/nhap-kho/ncc/{maNcc} — Phiếu nhập theo nhà cung cấp */
    @GetMapping("/ncc/{maNcc}")
    public List<PhieuNhapKhoResponse> getByMaNhaCungCap(@PathVariable String maNcc) {
        return phieuNhapKhoService.getByMaNhaCungCap(maNcc);
    }

    /** POST /api/nhap-kho — Tạo phiếu nhập mới */
    @PostMapping
    public ResponseEntity<PhieuNhapKhoResponse> create(@RequestBody PhieuNhapKhoRequest request) {
        PhieuNhapKhoResponse res = phieuNhapKhoService.createPhieuNhap(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    /** DELETE /api/nhap-kho/{maPhieu} — Hủy phiếu nhập (hoàn kho) */
    @DeleteMapping("/{maPhieu}")
    public ResponseEntity<Void> delete(@PathVariable String maPhieu) {
        phieuNhapKhoService.deletePhieuNhap(maPhieu);
        return ResponseEntity.noContent().build();
    }
}
