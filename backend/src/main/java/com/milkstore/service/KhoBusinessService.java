package com.milkstore.service;

import com.milkstore.dto.request.ChuyenKhoRequest;
import com.milkstore.entity.*;
import com.milkstore.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KhoBusinessService {

    private final TonKhoRepository tonKhoRepository;
    private final HangHoaRepository hangHoaRepository;
    private final TheKhoRepository theKhoRepository;
    private final KhoHangHoaNhapRepository khoHangHoaNhapRepository;
    private final KhoBanHangRepository khoBanHangRepository;
    private final HangHoaChuyenKhoRepository hangHoaChuyenKhoRepository;

    // ─────────────────────────────────────────────────────────────
    // GHI NHẬN NHẬP KHO (từ phiếu nhập)
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public void ghiNhapKho(String maHang, String maKho, BigDecimal soLuong,
                            String maPhieuNhap, String maNhaCungCap,
                            BigDecimal donGia, String donViTinh, String maNhanVien, String ghiChu) {

        // 1. Cộng vào TB_TONKHO_KHO
        BigDecimal tonCuoi = capNhatTonKho(maHang, maKho, soLuong);

        // 2. Ghi vào bảng chuyên biệt KhoHangHoaNhap
        KhoHangHoaNhap nhap = new KhoHangHoaNhap();
        nhap.setMaPhieuNhap(maPhieuNhap);
        nhap.setMaHangHoa(maHang);
        nhap.setMaKho(maKho);
        nhap.setMaNhaCungCap(maNhaCungCap);
        nhap.setNgayNhap(LocalDateTime.now());
        nhap.setSoLuong(soLuong);
        nhap.setDonGia(donGia);
        nhap.setThanhTien(donGia != null ? soLuong.multiply(donGia) : BigDecimal.ZERO);
        nhap.setDonViTinh(donViTinh);
        nhap.setMaNhanVien(maNhanVien);
        nhap.setGhiChu(ghiChu);
        khoHangHoaNhapRepository.save(nhap);

        // 3. Ghi vào TheKho (audit trail tổng hợp)
        ghiTheKho(maHang, maKho, soLuong, "NHAP", maPhieuNhap, tonCuoi, ghiChu);
    }

    // ─────────────────────────────────────────────────────────────
    // GHI NHẬN XUẤT KHO (từ hóa đơn bán hàng)
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public void ghiXuatKho(String maHang, String maKho, BigDecimal soLuong,
                            String maHoaDon, String maKhachHang, String maNhanVien,
                            BigDecimal donGia, String donViTinh, String hinhThucThanhToan) {

        // 1. Trừ khỏi TB_TONKHO_KHO
        BigDecimal tonCuoi = capNhatTonKho(maHang, maKho, soLuong.negate());

        // 2. Ghi vào bảng chuyên biệt KhoBanHang
        KhoBanHang ban = new KhoBanHang();
        ban.setMaHoaDon(maHoaDon);
        ban.setMaHangHoa(maHang);
        ban.setMaKho(maKho);
        ban.setNgayBan(LocalDateTime.now());
        ban.setSoLuong(soLuong);
        ban.setDonGia(donGia);
        ban.setThanhTien(donGia != null ? soLuong.multiply(donGia) : BigDecimal.ZERO);
        ban.setDonViTinh(donViTinh);
        ban.setMaKhachHang(maKhachHang);
        ban.setMaNhanVien(maNhanVien);
        ban.setHinhThucThanhToan(hinhThucThanhToan);
        khoBanHangRepository.save(ban);

        // 3. Ghi vào TheKho
        ghiTheKho(maHang, maKho, soLuong.negate(), "XUAT", maHoaDon, tonCuoi,
                "Bán cho KH: " + (maKhachHang != null ? maKhachHang : "Khách lẻ"));
    }

    // ─────────────────────────────────────────────────────────────
    // GHI NHẬN ĐIỀU CHUYỂN KHO (giữa 2 chi nhánh)
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public void ghiChuyenKho(String maHang, String maKhoNguon, String maKhoDich,
                              BigDecimal soLuong, String maNhanVien, String lyDo, String donViTinh) {

        String maPhieuChuyen = generateMaPhieuChuyen();

        // 1. Trừ kho nguồn
        BigDecimal tonCuoiNguon = capNhatTonKho(maHang, maKhoNguon, soLuong.negate());

        // 2. Cộng kho đích
        BigDecimal tonCuoiDich = capNhatTonKho(maHang, maKhoDich, soLuong);

        // 3. Ghi vào bảng chuyên biệt HangHoaChuyenKho
        HangHoaChuyenKho chuyen = new HangHoaChuyenKho();
        chuyen.setMaPhieuChuyen(maPhieuChuyen);
        chuyen.setMaHangHoa(maHang);
        chuyen.setMaKhoNguon(maKhoNguon);
        chuyen.setMaKhoDich(maKhoDich);
        chuyen.setNgayChuyen(LocalDateTime.now());
        chuyen.setSoLuong(soLuong);
        chuyen.setDonViTinh(donViTinh);
        chuyen.setMaNhanVien(maNhanVien);
        chuyen.setLyDo(lyDo);
        chuyen.setTrangThai("COMPLETED");
        hangHoaChuyenKhoRepository.save(chuyen);

        // 4. Ghi TheKho: 2 dòng (xuất từ nguồn + nhập vào đích)
        ghiTheKho(maHang, maKhoNguon, soLuong.negate(), "CHUYEN", maPhieuChuyen,
                tonCuoiNguon, "Chuyển đến kho: " + maKhoDich);
        ghiTheKho(maHang, maKhoDich, soLuong, "CHUYEN", maPhieuChuyen,
                tonCuoiDich, "Nhận từ kho: " + maKhoNguon);
    }

    // ─────────────────────────────────────────────────────────────
    // GHI NHẬN HOÀN KHO (hủy phiếu nhập)
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public void ghiHoanKho(String maHang, String maKho, BigDecimal soLuong,
                            String maPhieuGoc, String ghiChu) {
        BigDecimal tonCuoi = capNhatTonKho(maHang, maKho, soLuong.negate());
        ghiTheKho(maHang, maKho, soLuong.negate(), "HOAN", maPhieuGoc, tonCuoi, ghiChu);
    }

    // ─────────────────────────────────────────────────────────────
    // LEGACY: giữ lại để tương thích với HoaDonService cũ
    // ─────────────────────────────────────────────────────────────
    @Transactional
    public void ghiNhanBienDong(String maHang, String maKho, BigDecimal soLuongThayDoi,
                                 String loaiPhieu, String soPhieu, String ghiChu) {
        BigDecimal tonCuoi = capNhatTonKho(maHang, maKho, soLuongThayDoi);
        ghiTheKho(maHang, maKho, soLuongThayDoi, loaiPhieu, soPhieu, tonCuoi, ghiChu);
    }

    // ─────────────────────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────────────────────

    /** Cập nhật TB_TONKHO_KHO và TB_HANGHOA, trả về tồn cuối tại kho */
    private BigDecimal capNhatTonKho(String maHang, String maKho, BigDecimal delta) {
        // Cập nhật tồn theo kho (TB_TONKHO_KHO)
        TonKho tonKho = tonKhoRepository.findByMaHangHoaAndMaKho(maHang, maKho)
                .orElseGet(() -> {
                    TonKho tk = new TonKho();
                    tk.setMaHangHoa(maHang);
                    tk.setMaKho(maKho);
                    tk.setSoLuongTong(BigDecimal.ZERO);
                    return tk;
                });
        BigDecimal tonCuoi = (tonKho.getSoLuongTong() != null ? tonKho.getSoLuongTong() : BigDecimal.ZERO).add(delta);
        tonKho.setSoLuongTong(tonCuoi);
        tonKhoRepository.save(tonKho);

        // Cập nhật tồn tổng (TB_HANGHOA)
        hangHoaRepository.findById(maHang).ifPresent(hh -> {
            int current = hh.getTonKho() != null ? hh.getTonKho() : 0;
            hh.setTonKho(current + delta.intValue());
            hangHoaRepository.save(hh);
        });

        return tonCuoi;
    }

    /** Ghi 1 dòng vào TB_THEKHO */
    private void ghiTheKho(String maHang, String maKho, BigDecimal soLuong,
                            String loaiPhieu, String soPhieu, BigDecimal tonCuoi, String ghiChu) {
        TheKho tk = new TheKho();
        tk.setNgayThucHien(LocalDateTime.now());
        tk.setMaHangHoa(maHang);
        tk.setMaKho(maKho);
        tk.setLoaiPhieu(loaiPhieu);
        tk.setSoPhieu(soPhieu);
        tk.setSoLuongThayDoi(soLuong);
        tk.setTonCuoi(tonCuoi);
        tk.setGhiChu(ghiChu);
        theKhoRepository.save(tk);
    }

    private String generateMaPhieuChuyen() {
        String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyyyy"));
        String prefix = "CK" + today;
        Optional<HangHoaChuyenKho> last = hangHoaChuyenKhoRepository
                .findTopByMaPhieuChuyenStartingWithOrderByMaPhieuChuyenDesc(prefix);
        int next = last.map(h -> Integer.parseInt(h.getMaPhieuChuyen().substring(h.getMaPhieuChuyen().length() - 4)) + 1).orElse(1);
        return prefix + String.format("%04d", next);
    }
}
