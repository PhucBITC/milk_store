package com.milkstore.service.impl;

import com.milkstore.dto.response.TheKhoResponse;
import com.milkstore.entity.TheKho;
import com.milkstore.repository.HangHoaRepository;
import com.milkstore.repository.KhoRepository;
import com.milkstore.repository.TheKhoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TheKhoServiceImpl {

    private final TheKhoRepository theKhoRepository;
    private final HangHoaRepository hangHoaRepository;
    private final KhoRepository khoRepository;

    /** Toàn bộ nhật ký của 1 kho */
    public List<TheKhoResponse> getLichSuByKho(String maKho) {
        return theKhoRepository.findByMaKhoOrderByNgayThucHienDesc(maKho)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Lịch sử biến động 1 mặt hàng tại 1 kho */
    public List<TheKhoResponse> getLichSuByHangAndKho(String maHang, String maKho) {
        return theKhoRepository.findByMaHangHoaAndMaKhoOrderByNgayThucHienDesc(maHang, maKho)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Lịch sử 1 mặt hàng qua tất cả kho */
    public List<TheKhoResponse> getLichSuByHang(String maHang) {
        return theKhoRepository.findByMaHangHoaOrderByNgayThucHienDesc(maHang)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Truy vết theo số phiếu (NHAP, XUAT, HOAN...) */
    public List<TheKhoResponse> getLichSuByPhieu(String soPhieu) {
        return theKhoRepository.findBySoPhieuOrderByNgayThucHienDesc(soPhieu)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Lọc theo loại phiếu */
    public List<TheKhoResponse> getLichSuByLoaiPhieu(String loaiPhieu) {
        return theKhoRepository.findByLoaiPhieuOrderByNgayThucHienDesc(loaiPhieu)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private TheKhoResponse toResponse(TheKho tk) {
        TheKhoResponse res = new TheKhoResponse();
        res.setId(tk.getId());
        res.setNgayThucHien(tk.getNgayThucHien());
        res.setMaHangHoa(tk.getMaHangHoa());
        res.setMaKho(tk.getMaKho());
        res.setLoaiPhieu(tk.getLoaiPhieu());
        res.setSoPhieu(tk.getSoPhieu());
        res.setSoLuongThayDoi(tk.getSoLuongThayDoi());
        res.setTonCuoi(tk.getTonCuoi());
        res.setGhiChu(tk.getGhiChu());

        // Enrich: Tên hàng
        hangHoaRepository.findById(tk.getMaHangHoa())
                .ifPresent(hh -> res.setTenHangHoa(hh.getTenHang()));

        // Enrich: Tên kho
        khoRepository.findById(tk.getMaKho())
                .ifPresent(k -> res.setTenKho(k.getTenKho()));

        return res;
    }
}
