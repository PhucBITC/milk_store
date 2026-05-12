package com.milkstore.service.impl;

import com.milkstore.dto.request.NhomChuRequest;
import com.milkstore.dto.response.NhomChuResponse;
import com.milkstore.entity.NhomChu;
import com.milkstore.exception.ResourceNotFoundException;
import com.milkstore.repository.NhomChuRepository;
import com.milkstore.service.NhomChuService;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class NhomChuServiceImpl implements NhomChuService {

    private static final DateTimeFormatter MA_NHOM_FORMATTER = DateTimeFormatter.ofPattern("ddMMyyHHmmss");
    private static final Sort NEWEST_FIRST = Sort.by(Sort.Direction.DESC, "ngayTao");

    private final NhomChuRepository nhomChuRepository;

    public NhomChuServiceImpl(NhomChuRepository nhomChuRepository) {
        this.nhomChuRepository = nhomChuRepository;
    }

    @Override
    public List<NhomChuResponse> getAll() {
        return nhomChuRepository.findAll(NEWEST_FIRST).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<NhomChuResponse> search(String keyword) {
        String cleanKeyword = keyword == null ? "" : keyword.trim();
        if (cleanKeyword.isEmpty()) {
            return getAll();
        }

        return nhomChuRepository
                .findByMaNhomContainingIgnoreCaseOrTenNhomContainingIgnoreCase(cleanKeyword, cleanKeyword, NEWEST_FIRST)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public NhomChuResponse getByMaNhom(String maNhom) {
        return toResponse(findByMaNhom(maNhom));
    }

    @Override
    public NhomChuResponse create(NhomChuRequest request) {
        LocalDateTime now = LocalDateTime.now();

        NhomChu nhomChu = new NhomChu();
        // MANHOM is generated on the backend so users cannot edit business keys.
        nhomChu.setMaNhom(generateMaNhom(now));
        nhomChu.setTenNhom(cleanText(request.getTenNhom()));
        nhomChu.setGhiChu(cleanOptionalText(request.getGhiChu()));
        nhomChu.setNgayTao(now);

        return toResponse(nhomChuRepository.save(nhomChu));
    }

    @Override
    public NhomChuResponse update(String maNhom, NhomChuRequest request) {
        NhomChu nhomChu = findByMaNhom(maNhom);
        nhomChu.setTenNhom(cleanText(request.getTenNhom()));
        nhomChu.setGhiChu(cleanOptionalText(request.getGhiChu()));

        return toResponse(nhomChuRepository.save(nhomChu));
    }

    @Override
    public void delete(String maNhom) {
        NhomChu nhomChu = findByMaNhom(maNhom);
        nhomChuRepository.delete(nhomChu);
    }

    private String generateMaNhom(LocalDateTime now) {
        String baseCode = now.format(MA_NHOM_FORMATTER);
        if (!nhomChuRepository.existsById(baseCode)) {
            return baseCode;
        }

        String generatedCode;
        do {
            int suffix = ThreadLocalRandom.current().nextInt(10, 100);
            generatedCode = baseCode + suffix;
        } while (nhomChuRepository.existsById(generatedCode));

        return generatedCode;
    }

    private NhomChu findByMaNhom(String maNhom) {
        String cleanMaNhom = maNhom == null ? "" : maNhom.trim();
        return nhomChuRepository.findById(cleanMaNhom)
                .orElseThrow(() -> new ResourceNotFoundException("Nhom chu not found with MANHOM: " + cleanMaNhom));
    }

    private NhomChuResponse toResponse(NhomChu nhomChu) {
        NhomChuResponse response = new NhomChuResponse();
        response.setMaNhom(nhomChu.getMaNhom());
        response.setTenNhom(nhomChu.getTenNhom());
        response.setGhiChu(nhomChu.getGhiChu());
        response.setNgayTao(nhomChu.getNgayTao());
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
