package com.milkstore.service.impl;

import com.milkstore.dto.request.KhachHangRequest;
import com.milkstore.dto.response.KhachHangResponse;
import com.milkstore.entity.KhachHang;
import com.milkstore.exception.ResourceNotFoundException;
import com.milkstore.repository.KhachHangRepository;
import com.milkstore.service.KhachHangService;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class KhachHangServiceImpl implements KhachHangService {

    private static final DateTimeFormatter CODE_FORMATTER = DateTimeFormatter.ofPattern("ddMMyyHHmmss");
    private static final Sort NEWEST_FIRST = Sort.by(Sort.Direction.DESC, "ngayTao");

    private final KhachHangRepository khachHangRepository;

    public KhachHangServiceImpl(KhachHangRepository khachHangRepository) {
        this.khachHangRepository = khachHangRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<KhachHangResponse> getAll() {
        return khachHangRepository.findAll(NEWEST_FIRST).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<KhachHangResponse> search(String keyword) {
        String cleanKeyword = keyword == null ? "" : keyword.trim();
        if (cleanKeyword.isEmpty()) {
            return getAll();
        }

        return khachHangRepository
                .findByMaKhachHangContainingIgnoreCaseOrTenKhachHangContainingIgnoreCaseOrSoDtContainingIgnoreCaseOrMaSoThueContainingIgnoreCase(
                        cleanKeyword,
                        cleanKeyword,
                        cleanKeyword,
                        cleanKeyword,
                        NEWEST_FIRST
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public KhachHangResponse getByMaKhachHang(String maKhachHang) {
        return toResponse(findByMaKhachHang(maKhachHang));
    }

    @Override
    public KhachHangResponse create(KhachHangRequest request) {
        LocalDateTime now = LocalDateTime.now();

        KhachHang khachHang = new KhachHang();
        khachHang.setMaKhachHang(generateCode(now));
        applyRequest(khachHang, request);
        khachHang.setNgayTao(now);

        return toResponse(khachHangRepository.save(khachHang));
    }

    @Override
    public KhachHangResponse update(String maKhachHang, KhachHangRequest request) {
        KhachHang khachHang = findByMaKhachHang(maKhachHang);
        applyRequest(khachHang, request);
        return toResponse(khachHangRepository.save(khachHang));
    }

    @Override
    public void delete(String maKhachHang) {
        khachHangRepository.delete(findByMaKhachHang(maKhachHang));
    }

    private void applyRequest(KhachHang khachHang, KhachHangRequest request) {
        khachHang.setTenKhachHang(cleanText(request.getTenKhachHang()));
        khachHang.setSoDt(cleanOptionalText(request.getSoDt()));
        khachHang.setMaSoThue(cleanOptionalText(request.getMaSoThue()));
        khachHang.setDiaChi(cleanOptionalText(request.getDiaChi()));
        khachHang.setMaQuanHeNganSach(cleanOptionalText(request.getMaQuanHeNganSach()));
        khachHang.setCccd(cleanOptionalText(request.getCccd()));
    }

    private String generateCode(LocalDateTime now) {
        String baseCode = "KH" + now.format(CODE_FORMATTER);
        if (!khachHangRepository.existsById(baseCode)) {
            return baseCode;
        }

        String generatedCode;
        do {
            int suffix = ThreadLocalRandom.current().nextInt(10, 100);
            generatedCode = baseCode + suffix;
        } while (khachHangRepository.existsById(generatedCode));

        return generatedCode;
    }

    private KhachHang findByMaKhachHang(String maKhachHang) {
        String cleanCode = maKhachHang == null ? "" : maKhachHang.trim();
        return khachHangRepository.findById(cleanCode)
                .orElseThrow(() -> new ResourceNotFoundException("Khach hang not found with MAKHACHHANG: " + cleanCode));
    }

    private KhachHangResponse toResponse(KhachHang khachHang) {
        KhachHangResponse response = new KhachHangResponse();
        response.setMaKhachHang(khachHang.getMaKhachHang());
        response.setTenKhachHang(khachHang.getTenKhachHang());
        response.setSoDt(khachHang.getSoDt());
        response.setMaSoThue(khachHang.getMaSoThue());
        response.setDiaChi(khachHang.getDiaChi());
        response.setMaQuanHeNganSach(khachHang.getMaQuanHeNganSach());
        response.setCccd(khachHang.getCccd());
        response.setNgayTao(khachHang.getNgayTao());
        return response;
    }

    private String cleanText(String value) {
        return value == null ? null : value.trim().toUpperCase();
    }

    private String cleanOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
