package com.milkstore.service.impl;

import com.milkstore.dto.request.KhachHangRequest;
import com.milkstore.dto.response.KhachHangResponse;
import com.milkstore.entity.KhachHang;
import com.milkstore.exception.ResourceNotFoundException;
import com.milkstore.repository.KhachHangRepository;
import com.milkstore.service.KhachHangService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class KhachHangServiceImpl implements KhachHangService {

    private static final Sort NEWEST_FIRST = Sort.by(Sort.Direction.DESC, "ngayTao");
    private static final String PHONE_PATTERN = "\\d{8,15}";
    private static final String TAX_CODE_PATTERN = "(?:\\d{10}|\\d{13})";
    private static final String BUDGET_RELATION_CODE_PATTERN = "\\d{1,20}";
    private static final String CITIZEN_ID_PATTERN = "(?:\\d{9}|\\d{12})";

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
        String maKhachHang = cleanCode(request.getMaKhachHang());
        if (khachHangRepository.existsById(maKhachHang)) {
            throw new IllegalArgumentException("MAKHACHHANG already exists: " + maKhachHang);
        }

        KhachHang khachHang = new KhachHang();
        khachHang.setMaKhachHang(maKhachHang);
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
        khachHang.setSoDt(khachHang.getMaKhachHang());
        khachHang.setMaSoThue(cleanOptionalPattern(request.getMaSoThue(), TAX_CODE_PATTERN, "MASOTHUE must have 10 or 13 digits"));
        khachHang.setDiaChi(cleanOptionalText(request.getDiaChi()));
        khachHang.setMaQuanHeNganSach(cleanOptionalPattern(request.getMaQuanHeNganSach(), BUDGET_RELATION_CODE_PATTERN, "MAQUANHENGANSACH must have digits only, up to 20 characters"));
        khachHang.setCccd(cleanOptionalPattern(request.getCccd(), CITIZEN_ID_PATTERN, "CCCD must have 9 or 12 digits"));
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

    private String cleanCode(String value) {
        String cleanValue = cleanText(value);
        if (cleanValue == null || cleanValue.isBlank()) {
            throw new IllegalArgumentException("MAKHACHHANG is required");
        }

        if (!cleanValue.matches(PHONE_PATTERN)) {
            throw new IllegalArgumentException("MAKHACHHANG must have 8 to 15 digits");
        }

        return cleanValue;
    }

    private String cleanOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String cleanOptionalPattern(String value, String pattern, String message) {
        String cleanValue = cleanOptionalText(value);
        if (cleanValue == null) {
            return null;
        }

        if (!cleanValue.matches(pattern)) {
            throw new IllegalArgumentException(message);
        }

        return cleanValue;
    }
}
