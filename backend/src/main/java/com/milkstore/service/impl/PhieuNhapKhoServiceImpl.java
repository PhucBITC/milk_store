package com.milkstore.service.impl;

import com.milkstore.dto.request.PhieuNhapKhoRequest;
import com.milkstore.dto.response.PhieuNhapKhoResponse;
import com.milkstore.entity.*;
import com.milkstore.repository.*;
import com.milkstore.service.KhoBusinessService;
import com.milkstore.service.PhieuNhapKhoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhieuNhapKhoServiceImpl implements PhieuNhapKhoService {

    private final PhieuNhapKhoRepository phieuNhapKhoRepository;
    private final PhieuNhapKhoChiTietRepository chiTietRepository;
    private final HangHoaRepository hangHoaRepository;
    private final KhoRepository khoRepository;
    private final NhaCungCapRepository nhaCungCapRepository;
    private final KhoBusinessService khoBusinessService;

    @Override
    @Transactional
    public PhieuNhapKhoResponse createPhieuNhap(PhieuNhapKhoRequest request) {
        // 1. Sinh mã phiếu tự động: PN{MAKHO}{YYYYMMDD}{00001}
        String maPhieu = generateMaPhieu(request.getMaKho());

        // 2. Lưu Header phiếu nhập
        PhieuNhapKho phieu = new PhieuNhapKho();
        phieu.setMaPhieu(maPhieu);
        phieu.setMaKho(request.getMaKho());
        phieu.setMaNhaCungCap(request.getMaNhaCungCap());
        phieu.setNgayNhap(LocalDateTime.now());
        phieu.setMaNhanVien(request.getMaNhanVien());
        phieu.setGhiChu(request.getGhiChu());
        phieu.setTongTien(BigDecimal.ZERO); // Sẽ tính lại sau
        PhieuNhapKho saved = phieuNhapKhoRepository.save(phieu);

        // 3. Lưu chi tiết + Cộng kho + Ghi TheKho
        BigDecimal tongTien = BigDecimal.ZERO;
        for (PhieuNhapKhoRequest.ChiTietRequest item : request.getItems()) {
            BigDecimal thanhTien = item.getDonGia().multiply(item.getSoLuong());
            tongTien = tongTien.add(thanhTien);

            // 3.1 Lưu chi tiết phiếu
            PhieuNhapKhoChiTiet chiTiet = new PhieuNhapKhoChiTiet();
            chiTiet.setPhieuNhap(saved);
            chiTiet.setMaHangHoa(item.getMaHangHoa());
            chiTiet.setSoLuong(item.getSoLuong());
            chiTiet.setDonGia(item.getDonGia());
            chiTiet.setThanhTien(thanhTien);
            chiTiet.setDonViTinh(item.getDonViTinh());
            chiTietRepository.save(chiTiet);

            // 3.2 Cộng kho + Ghi KhoHangHoaNhap + TheKho (truy vết hoàn hảo)
            khoBusinessService.ghiNhapKho(
                item.getMaHangHoa(),
                request.getMaKho(),
                item.getSoLuong(),
                maPhieu,
                request.getMaNhaCungCap(),
                item.getDonGia(),
                item.getDonViTinh(),
                request.getMaNhanVien(),
                request.getGhiChu()
            );

            // 3.3 Cập nhật giá vốn mới nhất vào TB_HANGHOA nếu có donGia
            hangHoaRepository.findById(item.getMaHangHoa()).ifPresent(hh -> {
                hh.setGiaNhap(item.getDonGia());
                hangHoaRepository.save(hh);
            });
        }

        // 4. Cập nhật tổng tiền phiếu
        saved.setTongTien(tongTien);
        phieuNhapKhoRepository.save(saved);

        return toResponse(saved);
    }

    @Override
    public List<PhieuNhapKhoResponse> getAllPhieuNhap() {
        return phieuNhapKhoRepository.findAllByOrderByNgayNhapDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public PhieuNhapKhoResponse getByMaPhieu(String maPhieu) {
        PhieuNhapKho phieu = phieuNhapKhoRepository.findById(maPhieu)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu nhập: " + maPhieu));
        return toResponse(phieu);
    }

    @Override
    public List<PhieuNhapKhoResponse> getByMaKho(String maKho) {
        return phieuNhapKhoRepository.findByMaKhoOrderByNgayNhapDesc(maKho)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<PhieuNhapKhoResponse> getByMaNhaCungCap(String maNhaCungCap) {
        return phieuNhapKhoRepository.findByMaNhaCungCapOrderByNgayNhapDesc(maNhaCungCap)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletePhieuNhap(String maPhieu) {
        PhieuNhapKho phieu = phieuNhapKhoRepository.findById(maPhieu)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu nhập: " + maPhieu));

        // Hoàn kho: Trừ lại số lượng đã nhập + ghi thẻ kho
        List<PhieuNhapKhoChiTiet> chiTietList = chiTietRepository.findByPhieuNhap_MaPhieu(maPhieu);
        for (PhieuNhapKhoChiTiet ct : chiTietList) {
            khoBusinessService.ghiNhanBienDong(
                ct.getMaHangHoa(),
                phieu.getMaKho(),
                ct.getSoLuong().negate(),   // Hoàn kho = số âm
                "HOAN",
                maPhieu,
                "Hủy phiếu nhập kho " + maPhieu
            );
        }
        phieuNhapKhoRepository.delete(phieu);
    }

    // ======================== HELPER ========================

    private String generateMaPhieu(String maKho) {
        String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyyyy"));
        String prefix = "PN" + maKho + today;
        Optional<PhieuNhapKho> last = phieuNhapKhoRepository.findTopByMaPhieuStartingWithOrderByMaPhieuDesc(prefix);
        int nextNum = 1;
        if (last.isPresent()) {
            String lastMa = last.get().getMaPhieu();
            nextNum = Integer.parseInt(lastMa.substring(lastMa.length() - 4)) + 1;
        }
        return prefix + String.format("%04d", nextNum);
    }

    private PhieuNhapKhoResponse toResponse(PhieuNhapKho phieu) {
        PhieuNhapKhoResponse res = new PhieuNhapKhoResponse();
        res.setMaPhieu(phieu.getMaPhieu());
        res.setMaKho(phieu.getMaKho());
        res.setMaNhaCungCap(phieu.getMaNhaCungCap());
        res.setNgayNhap(phieu.getNgayNhap());
        res.setMaNhanVien(phieu.getMaNhanVien());
        res.setTongTien(phieu.getTongTien());
        res.setGhiChu(phieu.getGhiChu());

        // Enrich: Tên kho
        khoRepository.findById(phieu.getMaKho()).ifPresent(k -> res.setTenKho(k.getTenKho()));

        // Enrich: Tên NCC
        if (phieu.getMaNhaCungCap() != null) {
            nhaCungCapRepository.findById(phieu.getMaNhaCungCap())
                    .ifPresent(ncc -> res.setTenNhaCungCap(ncc.getTenNhaCungCap()));
        }

        // Enrich: Chi tiết
        List<PhieuNhapKhoChiTiet> chiTietList = chiTietRepository.findByPhieuNhap_MaPhieu(phieu.getMaPhieu());
        res.setChiTietList(chiTietList.stream().map(ct -> {
            PhieuNhapKhoResponse.ChiTietResponse ctRes = new PhieuNhapKhoResponse.ChiTietResponse();
            ctRes.setId(ct.getId());
            ctRes.setMaHangHoa(ct.getMaHangHoa());
            ctRes.setSoLuong(ct.getSoLuong());
            ctRes.setDonGia(ct.getDonGia());
            ctRes.setThanhTien(ct.getThanhTien());
            ctRes.setDonViTinh(ct.getDonViTinh());
            // Enrich: Tên hàng
            hangHoaRepository.findById(ct.getMaHangHoa())
                    .ifPresent(hh -> ctRes.setTenHangHoa(hh.getTenHang()));
            return ctRes;
        }).collect(Collectors.toList()));

        return res;
    }
}
