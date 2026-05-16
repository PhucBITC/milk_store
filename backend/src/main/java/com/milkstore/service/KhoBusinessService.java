package com.milkstore.service;

import com.milkstore.entity.HangHoa;
import com.milkstore.entity.TheKho;
import com.milkstore.entity.TonKho;
import com.milkstore.repository.HangHoaRepository;
import com.milkstore.repository.TheKhoRepository;
import com.milkstore.repository.TonKhoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KhoBusinessService {

    private final TonKhoRepository tonKhoRepository;
    private final HangHoaRepository hangHoaRepository;
    private final TheKhoRepository theKhoRepository;

    /**
     * Ghi nhận một biến động kho và cập nhật số dư tồn kho
     */
    @Transactional
    public void ghiNhanBienDong(String maHang, String maKho, BigDecimal soLuongThayDoi, String loaiPhieu, String soPhieu, String ghiChu) {
        // 1. Cập nhật tồn kho theo kho (TB_TONKHO_KHO)
        Optional<TonKho> tonKhoOpt = tonKhoRepository.findByMaHangHoaAndMaKho(maHang, maKho);
        TonKho tonKho;
        BigDecimal tonCuoiKho;

        if (tonKhoOpt.isPresent()) {
            tonKho = tonKhoOpt.get();
            tonCuoiKho = tonKho.getSoLuongTong().add(soLuongThayDoi);
            tonKho.setSoLuongTong(tonCuoiKho);
        } else {
            tonCuoiKho = soLuongThayDoi;
            tonKho = new TonKho();
            tonKho.setMaHangHoa(maHang);
            tonKho.setMaKho(maKho);
            tonKho.setSoLuongTong(tonCuoiKho);
        }
        tonKhoRepository.save(tonKho);

        // 2. Cập nhật tồn kho tổng (TB_HANGHOA)
        HangHoa hh = hangHoaRepository.findById(maHang)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hàng hóa: " + maHang));
        BigDecimal currentTotal = BigDecimal.valueOf(hh.getTonKho() != null ? hh.getTonKho() : 0);
        BigDecimal newTotal = currentTotal.add(soLuongThayDoi);
        hh.setTonKho(newTotal.intValue());
        hangHoaRepository.save(hh);

        // 3. Ghi vào Thẻ Kho (Audit Trail)
        TheKho theKho = new TheKho();
        theKho.setNgayThucHien(LocalDateTime.now());
        theKho.setMaHangHoa(maHang);
        theKho.setMaKho(maKho);
        theKho.setLoaiPhieu(loaiPhieu);
        theKho.setSoPhieu(soPhieu);
        theKho.setSoLuongThayDoi(soLuongThayDoi);
        theKho.setTonCuoi(tonCuoiKho); // Lưu tồn tại kho cụ thể sau biến động
        theKho.setGhiChu(ghiChu);
        
        theKhoRepository.save(theKho);
    }
}
