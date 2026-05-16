package com.milkstore.service.impl;

import com.milkstore.dto.response.TonKhoResponse;
import com.milkstore.entity.TonKho;
import com.milkstore.repository.HangHoaRepository;
import com.milkstore.repository.KhoRepository;
import com.milkstore.repository.TonKhoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TonKhoServiceImpl {

    private final TonKhoRepository tonKhoRepository;
    private final HangHoaRepository hangHoaRepository;
    private final KhoRepository khoRepository;

    /** Toàn bộ tồn kho mọi kho */
    public List<TonKhoResponse> getAll() {
        return tonKhoRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    /** Tồn kho theo kho cụ thể */
    public List<TonKhoResponse> getByMaKho(String maKho) {
        return tonKhoRepository.findAll().stream()
                .filter(t -> maKho.equals(t.getMaKho()))
                .map(this::toResponse).collect(Collectors.toList());
    }

    /** Tồn 1 mặt hàng qua tất cả kho */
    public List<TonKhoResponse> getByMaHangHoa(String maHang) {
        return tonKhoRepository.findAll().stream()
                .filter(t -> maHang.equals(t.getMaHangHoa()))
                .map(this::toResponse).collect(Collectors.toList());
    }

    private TonKhoResponse toResponse(TonKho tk) {
        TonKhoResponse res = new TonKhoResponse();
        res.setMaHangHoa(tk.getMaHangHoa());
        res.setMaKho(tk.getMaKho());
        res.setSoLuongTong(tk.getSoLuongTong());
        res.setDonGia(tk.getDonGia());

        // Tính giá trị tồn
        if (tk.getSoLuongTong() != null && tk.getDonGia() != null) {
            res.setGiaTriTon(tk.getSoLuongTong().multiply(tk.getDonGia()));
        } else {
            res.setGiaTriTon(BigDecimal.ZERO);
        }

        // Enrich: Tên hàng
        hangHoaRepository.findById(tk.getMaHangHoa())
                .ifPresent(hh -> res.setTenHangHoa(hh.getTenHang()));

        // Enrich: Tên kho
        khoRepository.findById(tk.getMaKho())
                .ifPresent(k -> res.setTenKho(k.getTenKho()));

        return res;
    }
}
