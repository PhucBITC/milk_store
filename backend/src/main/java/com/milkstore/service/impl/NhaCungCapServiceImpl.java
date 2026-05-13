package com.milkstore.service.impl;

import com.milkstore.dto.request.NhaCungCapRequest;
import com.milkstore.dto.response.NhaCungCapResponse;
import com.milkstore.entity.NhaCungCap;
import com.milkstore.exception.ResourceNotFoundException;
import com.milkstore.repository.NhaCungCapRepository;
import com.milkstore.service.NhaCungCapService;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NhaCungCapServiceImpl implements NhaCungCapService {

    private static final DateTimeFormatter CODE_FORMATTER = DateTimeFormatter.ofPattern("ddMMyyHHmmss");
    private static final Sort NEWEST_FIRST = Sort.by(Sort.Direction.DESC, "ngayTao");

    private final NhaCungCapRepository nhaCungCapRepository;

    public NhaCungCapServiceImpl(NhaCungCapRepository nhaCungCapRepository) {
        this.nhaCungCapRepository = nhaCungCapRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NhaCungCapResponse> getAll() {
        return nhaCungCapRepository.findAll(NEWEST_FIRST).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NhaCungCapResponse> search(String keyword) {
        String cleanKeyword = keyword == null ? "" : keyword.trim();
        if (cleanKeyword.isEmpty()) {
            return getAll();
        }

        return nhaCungCapRepository
                .findByMaNhaCungCapContainingIgnoreCaseOrTenNhaCungCapContainingIgnoreCaseOrSoDtContainingIgnoreCaseOrMaSoThueContainingIgnoreCase(
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
    public NhaCungCapResponse getByMaNhaCungCap(String maNhaCungCap) {
        return toResponse(findByMaNhaCungCap(maNhaCungCap));
    }

    @Override
    public NhaCungCapResponse create(NhaCungCapRequest request) {
        LocalDateTime now = LocalDateTime.now();

        NhaCungCap nhaCungCap = new NhaCungCap();
        nhaCungCap.setMaNhaCungCap(generateCode(now));
        applyRequest(nhaCungCap, request);
        nhaCungCap.setNgayTao(now);

        return toResponse(nhaCungCapRepository.save(nhaCungCap));
    }

    @Override
    public NhaCungCapResponse update(String maNhaCungCap, NhaCungCapRequest request) {
        NhaCungCap nhaCungCap = findByMaNhaCungCap(maNhaCungCap);
        applyRequest(nhaCungCap, request);
        return toResponse(nhaCungCapRepository.save(nhaCungCap));
    }

    @Override
    public void delete(String maNhaCungCap) {
        nhaCungCapRepository.delete(findByMaNhaCungCap(maNhaCungCap));
    }

    private void applyRequest(NhaCungCap nhaCungCap, NhaCungCapRequest request) {
        nhaCungCap.setTenNhaCungCap(cleanText(request.getTenNhaCungCap()));
        nhaCungCap.setMaSoThue(cleanOptionalText(request.getMaSoThue()));
        nhaCungCap.setDiaChi(cleanOptionalText(request.getDiaChi()));
        nhaCungCap.setSoDt(cleanOptionalText(request.getSoDt()));
        nhaCungCap.setNhanVienSale(cleanOptionalText(request.getNhanVienSale()));
    }

    private String generateCode(LocalDateTime now) {
        String baseCode = "NCC" + now.format(CODE_FORMATTER);
        if (!nhaCungCapRepository.existsById(baseCode)) {
            return baseCode;
        }

        String generatedCode;
        do {
            int suffix = ThreadLocalRandom.current().nextInt(10, 100);
            generatedCode = baseCode + suffix;
        } while (nhaCungCapRepository.existsById(generatedCode));

        return generatedCode;
    }

    private NhaCungCap findByMaNhaCungCap(String maNhaCungCap) {
        String cleanCode = maNhaCungCap == null ? "" : maNhaCungCap.trim();
        return nhaCungCapRepository.findById(cleanCode)
                .orElseThrow(() -> new ResourceNotFoundException("Nha cung cap not found with MANHACUNGCAP: " + cleanCode));
    }

    private NhaCungCapResponse toResponse(NhaCungCap nhaCungCap) {
        NhaCungCapResponse response = new NhaCungCapResponse();
        response.setMaNhaCungCap(nhaCungCap.getMaNhaCungCap());
        response.setTenNhaCungCap(nhaCungCap.getTenNhaCungCap());
        response.setMaSoThue(nhaCungCap.getMaSoThue());
        response.setDiaChi(nhaCungCap.getDiaChi());
        response.setSoDt(nhaCungCap.getSoDt());
        response.setNhanVienSale(nhaCungCap.getNhanVienSale());
        response.setNgayTao(nhaCungCap.getNgayTao());
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
