package com.milkstore.controller;

import com.milkstore.dto.request.ChuyenKhoRequest;
import com.milkstore.entity.HangHoaChuyenKho;
import com.milkstore.entity.KhoBanHang;
import com.milkstore.entity.KhoHangHoaNhap;
import com.milkstore.repository.HangHoaChuyenKhoRepository;
import com.milkstore.repository.KhoBanHangRepository;
import com.milkstore.repository.KhoHangHoaNhapRepository;
import com.milkstore.service.KhoBusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kho-van-hanh")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class KhoVanHanhController {

    private final KhoHangHoaNhapRepository khoHangHoaNhapRepository;
    private final KhoBanHangRepository khoBanHangRepository;
    private final HangHoaChuyenKhoRepository hangHoaChuyenKhoRepository;
    private final KhoBusinessService khoBusinessService;

    // ── HÀNG HÓA NHẬP (từ phiếu nhập) ──

    /** GET /api/kho-van-hanh/nhap — Toàn bộ hàng đã nhập */
    @GetMapping("/nhap")
    public List<KhoHangHoaNhap> getAllNhap() {
        return khoHangHoaNhapRepository.findAllByOrderByNgayNhapDesc();
    }

    /** GET /api/kho-van-hanh/nhap/kho/{maKho} — Hàng nhập theo kho */
    @GetMapping("/nhap/kho/{maKho}")
    public List<KhoHangHoaNhap> getNhapByKho(@PathVariable String maKho) {
        return khoHangHoaNhapRepository.findByMaKhoOrderByNgayNhapDesc(maKho);
    }

    /** GET /api/kho-van-hanh/nhap/phieu/{maPhieu} — Hàng nhập theo phiếu */
    @GetMapping("/nhap/phieu/{maPhieu}")
    public List<KhoHangHoaNhap> getNhapByPhieu(@PathVariable String maPhieu) {
        return khoHangHoaNhapRepository.findByMaPhieuNhapOrderByNgayNhapDesc(maPhieu);
    }

    // ── HÀNG HÓA BÁN RA ──

    /** GET /api/kho-van-hanh/ban — Toàn bộ hàng đã bán */
    @GetMapping("/ban")
    public List<KhoBanHang> getAllBan() {
        return khoBanHangRepository.findAllByOrderByNgayBanDesc();
    }

    /** GET /api/kho-van-hanh/ban/kho/{maKho} — Hàng bán theo kho */
    @GetMapping("/ban/kho/{maKho}")
    public List<KhoBanHang> getBanByKho(@PathVariable String maKho) {
        return khoBanHangRepository.findByMaKhoOrderByNgayBanDesc(maKho);
    }

    /** GET /api/kho-van-hanh/ban/hoadon/{maHoaDon} — Hàng bán theo hóa đơn */
    @GetMapping("/ban/hoadon/{maHoaDon}")
    public List<KhoBanHang> getBanByHoaDon(@PathVariable String maHoaDon) {
        return khoBanHangRepository.findByMaHoaDonOrderByNgayBanDesc(maHoaDon);
    }

    // ── ĐIỀU CHUYỂN KHO ──

    /** GET /api/kho-van-hanh/chuyen — Toàn bộ lệnh điều chuyển */
    @GetMapping("/chuyen")
    public List<HangHoaChuyenKho> getAllChuyen() {
        return hangHoaChuyenKhoRepository.findAllByOrderByNgayChuyenDesc();
    }

    /** GET /api/kho-van-hanh/chuyen/nguon/{maKho} — Chuyển đi từ kho */
    @GetMapping("/chuyen/nguon/{maKho}")
    public List<HangHoaChuyenKho> getChuyenByNguon(@PathVariable String maKho) {
        return hangHoaChuyenKhoRepository.findByMaKhoNguonOrderByNgayChuyenDesc(maKho);
    }

    /** GET /api/kho-van-hanh/chuyen/dich/{maKho} — Chuyển đến kho */
    @GetMapping("/chuyen/dich/{maKho}")
    public List<HangHoaChuyenKho> getChuyenByDich(@PathVariable String maKho) {
        return hangHoaChuyenKhoRepository.findByMaKhoDichOrderByNgayChuyenDesc(maKho);
    }

    /** POST /api/kho-van-hanh/chuyen — Thực hiện điều chuyển kho */
    @PostMapping("/chuyen")
    public ResponseEntity<String> thucHienChuyen(@RequestBody ChuyenKhoRequest request) {
        khoBusinessService.ghiChuyenKho(
            request.getMaHangHoa(),
            request.getMaKhoNguon(),
            request.getMaKhoDich(),
            request.getSoLuong(),
            request.getMaNhanVien(),
            request.getLyDo(),
            request.getDonViTinh()
        );
        return ResponseEntity.ok("Điều chuyển kho thành công!");
    }
}
