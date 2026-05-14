package com.milkstore.service.impl;

import com.milkstore.dto.request.NhaCungCapRequest;
import com.milkstore.dto.response.NhaCungCapResponse;
import com.milkstore.entity.NhaCungCap;
import com.milkstore.exception.ResourceNotFoundException;
import com.milkstore.repository.NhaCungCapRepository;
import com.milkstore.service.NhaCungCapService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NhaCungCapServiceImpl implements NhaCungCapService {

    private static final Sort NEWEST_FIRST = Sort.by(Sort.Direction.DESC, "ngayTao");
    private static final String SUPPLIER_CODE_PATTERN = "[\\p{L}\\p{N}_-]{2,50}";
    private static final String PHONE_PATTERN = "\\d{8,15}";
    private static final String TAX_CODE_PATTERN = "(?:\\d{10}|\\d{13})";

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
        String maNhaCungCap = cleanSupplierCode(request.getMaNhaCungCap());
        if (nhaCungCapRepository.existsById(maNhaCungCap)) {
            throw new IllegalArgumentException("MANHACUNGCAP already exists: " + maNhaCungCap);
        }

        NhaCungCap nhaCungCap = new NhaCungCap();
        nhaCungCap.setMaNhaCungCap(maNhaCungCap);
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
        nhaCungCap.setMaSoThue(cleanOptionalPattern(request.getMaSoThue(), TAX_CODE_PATTERN, "MASOTHUE must have 10 or 13 digits"));
        nhaCungCap.setDiaChi(cleanOptionalText(request.getDiaChi()));
        nhaCungCap.setSoDt(cleanOptionalPattern(request.getSoDt(), PHONE_PATTERN, "SODT must have 8 to 15 digits"));
        nhaCungCap.setNhanVienSale(cleanOptionalText(request.getNhanVienSale()));
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

    private String cleanSupplierCode(String value) {
        String cleanValue = cleanText(value);
        if (cleanValue == null || cleanValue.isBlank()) {
            throw new IllegalArgumentException("MANHACUNGCAP is required");
        }

        if (!cleanValue.matches(SUPPLIER_CODE_PATTERN)) {
            throw new IllegalArgumentException("MANHACUNGCAP only allows letters, numbers, underscore, hyphen, 2 to 50 characters");
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
