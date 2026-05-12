package com.milkstore.service.impl;

import com.milkstore.dto.request.HangHoaRequest;
import com.milkstore.dto.response.HangHoaResponse;
import com.milkstore.entity.HangHoa;
import com.milkstore.entity.NhomHang;
import com.milkstore.exception.ResourceNotFoundException;
import com.milkstore.repository.HangHoaRepository;
import com.milkstore.repository.NhomHangRepository;
import com.milkstore.service.HangHoaService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class HangHoaServiceImpl implements HangHoaService {

    private static final DateTimeFormatter MA_HANG_FORMATTER = DateTimeFormatter.ofPattern("ddMMyyHHmmss");
    private static final Sort NEWEST_FIRST = Sort.by(Sort.Direction.DESC, "ngayTao");

    private final HangHoaRepository hangHoaRepository;
    private final NhomHangRepository nhomHangRepository;

    public HangHoaServiceImpl(HangHoaRepository hangHoaRepository, NhomHangRepository nhomHangRepository) {
        this.hangHoaRepository = hangHoaRepository;
        this.nhomHangRepository = nhomHangRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HangHoaResponse> getAll() {
        return hangHoaRepository.findAll(NEWEST_FIRST).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HangHoaResponse> search(String keyword) {
        String cleanKeyword = keyword == null ? "" : keyword.trim();
        if (cleanKeyword.isEmpty()) {
            return getAll();
        }

        return hangHoaRepository
                .findByMaHangContainingIgnoreCaseOrTenHangContainingIgnoreCase(cleanKeyword, cleanKeyword, NEWEST_FIRST)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HangHoaResponse getByMaHang(String maHang) {
        return toResponse(findByMaHang(maHang));
    }

    @Override
    public HangHoaResponse create(HangHoaRequest request) {
        LocalDateTime now = LocalDateTime.now();
        NhomHang nhomHang = findNhomHang(request.getMaNhomHang());

        String requestedMaHang = cleanOptionalText(request.getMaHang());
        String finalMaHang;
        if (requestedMaHang != null) {
            finalMaHang = requestedMaHang.toUpperCase();
            if (hangHoaRepository.existsById(finalMaHang)) {
                throw new IllegalArgumentException("Mã hàng hóa đã tồn tại: " + finalMaHang);
            }
        } else {
            finalMaHang = generateMaHang(now);
        }

        HangHoa hangHoa = new HangHoa();
        hangHoa.setMaHang(finalMaHang);
        hangHoa.setTenHang(cleanText(request.getTenHang()));
        hangHoa.setNhomHang(nhomHang);
        hangHoa.setDvt(cleanText(request.getDvt()));
        hangHoa.setGiaBan(request.getGiaBan() != null ? request.getGiaBan() : BigDecimal.ZERO);
        hangHoa.setGiaNhap(request.getGiaNhap() != null ? request.getGiaNhap() : BigDecimal.ZERO);
        hangHoa.setTonKho(request.getTonKho() != null ? request.getTonKho() : 0);
        hangHoa.setHienThi(request.getHienThi() != null ? request.getHienThi() : true);
        hangHoa.setGhiChu(cleanOptionalText(request.getGhiChu()));
        hangHoa.setNgayTao(now);

        return toResponse(hangHoaRepository.save(hangHoa));
    }

    @Override
    public HangHoaResponse update(String maHang, HangHoaRequest request) {
        HangHoa hangHoa = findByMaHang(maHang);
        NhomHang nhomHang = findNhomHang(request.getMaNhomHang());

        hangHoa.setTenHang(cleanText(request.getTenHang()));
        hangHoa.setNhomHang(nhomHang);
        hangHoa.setDvt(cleanText(request.getDvt()));
        if (request.getGiaBan() != null) {
            hangHoa.setGiaBan(request.getGiaBan());
        }
        if (request.getGiaNhap() != null) {
            hangHoa.setGiaNhap(request.getGiaNhap());
        }
        if (request.getTonKho() != null) {
            hangHoa.setTonKho(request.getTonKho());
        }
        if (request.getHienThi() != null) {
            hangHoa.setHienThi(request.getHienThi());
        }
        hangHoa.setGhiChu(cleanOptionalText(request.getGhiChu()));

        return toResponse(hangHoaRepository.save(hangHoa));
    }

    @Override
    public void delete(String maHang) {
        HangHoa hangHoa = findByMaHang(maHang);
        hangHoaRepository.delete(hangHoa);
    }

    private String generateMaHang(LocalDateTime now) {
        String baseCode = "HH" + now.format(MA_HANG_FORMATTER);
        if (!hangHoaRepository.existsById(baseCode)) {
            return baseCode;
        }

        String generatedCode;
        do {
            int suffix = ThreadLocalRandom.current().nextInt(100, 999);
            generatedCode = baseCode + suffix;
        } while (hangHoaRepository.existsById(generatedCode));

        return generatedCode;
    }

    private HangHoa findByMaHang(String maHang) {
        String cleanMaHang = maHang == null ? "" : maHang.trim();
        return hangHoaRepository.findById(cleanMaHang)
                .orElseThrow(() -> new ResourceNotFoundException("Hang hoa not found with MAHANG: " + cleanMaHang));
    }

    private NhomHang findNhomHang(String maNhomHang) {
        String cleanMaNhomHang = maNhomHang == null ? "" : maNhomHang.trim();
        return nhomHangRepository.findById(cleanMaNhomHang)
                .orElseThrow(() -> new ResourceNotFoundException("Nhom hang not found with MANHOMHANG: " + cleanMaNhomHang));
    }

    private HangHoaResponse toResponse(HangHoa hangHoa) {
        HangHoaResponse response = new HangHoaResponse();
        response.setMaHang(hangHoa.getMaHang());
        response.setTenHang(hangHoa.getTenHang());
        response.setDvt(hangHoa.getDvt());
        response.setGiaBan(hangHoa.getGiaBan());
        response.setGiaNhap(hangHoa.getGiaNhap());
        response.setTonKho(hangHoa.getTonKho());
        response.setHienThi(hangHoa.getHienThi());
        response.setGhiChu(hangHoa.getGhiChu());
        response.setNgayTao(hangHoa.getNgayTao());

        if (hangHoa.getNhomHang() != null) {
            response.setMaNhomHang(hangHoa.getNhomHang().getMaNhomHang());
            response.setTenNhomHang(hangHoa.getNhomHang().getTenNhomHang());
            if (hangHoa.getNhomHang().getNhomChu() != null) {
                response.setMaNhomChu(hangHoa.getNhomHang().getNhomChu().getMaNhom());
                response.setTenNhomChu(hangHoa.getNhomHang().getNhomChu().getTenNhom());
            }
        }
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
