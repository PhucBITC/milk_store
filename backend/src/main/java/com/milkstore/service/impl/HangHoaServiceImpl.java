package com.milkstore.service.impl;

import com.milkstore.dto.request.HangHoaRequest;
import com.milkstore.dto.response.HangHoaResponse;
import com.milkstore.entity.HangHoa;
import com.milkstore.entity.NhomHang;
import com.milkstore.entity.UnitConversion;
import com.milkstore.entity.TonKho;
import com.milkstore.exception.ResourceNotFoundException;
import com.milkstore.repository.HangHoaRepository;
import com.milkstore.repository.NhomHangRepository;
import com.milkstore.repository.TonKhoRepository;
import com.milkstore.repository.UnitConversionRepository;
import com.milkstore.service.HangHoaService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
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
    private final UnitConversionRepository unitConversionRepository;
    private final TonKhoRepository tonKhoRepository;

    public HangHoaServiceImpl(
            HangHoaRepository hangHoaRepository,
            NhomHangRepository nhomHangRepository,
            UnitConversionRepository unitConversionRepository,
            TonKhoRepository tonKhoRepository
    ) {
        this.hangHoaRepository = hangHoaRepository;
        this.nhomHangRepository = nhomHangRepository;
        this.unitConversionRepository = unitConversionRepository;
        this.tonKhoRepository = tonKhoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HangHoaResponse> getAll(String maKho) {
        return hangHoaRepository.findAll(NEWEST_FIRST).stream()
                .map(hh -> this.toResponse(hh, maKho))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HangHoaResponse> search(String keyword, String maKho) {
        String cleanKeyword = keyword == null ? "" : keyword.trim();
        if (cleanKeyword.isEmpty()) {
            return getAll(maKho);
        }

        return hangHoaRepository
                .findByMaHangContainingIgnoreCaseOrTenHangContainingIgnoreCase(cleanKeyword, cleanKeyword, NEWEST_FIRST)
                .stream()
                .map(hh -> this.toResponse(hh, maKho))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HangHoaResponse getByMaHang(String maHang) {
        return toResponse(findByMaHang(maHang), null);
    }

    @Override
    public HangHoaResponse create(HangHoaRequest request) {
        LocalDateTime now = LocalDateTime.now();
        NhomHang nhomHang = findNhomHang(request.getMaNhomHang());
        UnitConversion unitConversion = findUnitConversion(request.getMaDvt());

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
        hangHoa.setUnitConversion(unitConversion);

        // Đặt 3 mức giá sỉ/lẻ
        hangHoa.setGiaBan1(request.getGiaBan1() != null ? request.getGiaBan1() : BigDecimal.ZERO);
        hangHoa.setGiaBan2(request.getGiaBan2() != null ? request.getGiaBan2() : BigDecimal.ZERO);
        hangHoa.setGiaBan3(request.getGiaBan3() != null ? request.getGiaBan3() : BigDecimal.ZERO);

        hangHoa.setGiaNhap(request.getGiaNhap() != null ? request.getGiaNhap() : BigDecimal.ZERO);
        hangHoa.setTonKho(request.getTonKho() != null ? request.getTonKho() : 0);
        hangHoa.setHienThi(request.getHienThi() != null ? request.getHienThi() : true);
        hangHoa.setGhiChu(cleanOptionalText(request.getGhiChu()));
        hangHoa.setNgayTao(now);

        return toResponse(hangHoaRepository.save(hangHoa), null);
    }

    @Override
    public HangHoaResponse update(String maHang, HangHoaRequest request) {
        HangHoa hangHoa = findByMaHang(maHang);
        NhomHang nhomHang = findNhomHang(request.getMaNhomHang());
        UnitConversion unitConversion = findUnitConversion(request.getMaDvt());

        hangHoa.setTenHang(cleanText(request.getTenHang()));
        hangHoa.setNhomHang(nhomHang);
        hangHoa.setUnitConversion(unitConversion);

        if (request.getGiaBan1() != null) {
            hangHoa.setGiaBan1(request.getGiaBan1());
        }
        if (request.getGiaBan2() != null) {
            hangHoa.setGiaBan2(request.getGiaBan2());
        }
        if (request.getGiaBan3() != null) {
            hangHoa.setGiaBan3(request.getGiaBan3());
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

        return toResponse(hangHoaRepository.save(hangHoa), null);
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

    private UnitConversion findUnitConversion(String maDvt) {
        String cleanMaDvt = maDvt == null ? "" : maDvt.trim();
        return unitConversionRepository.findById(cleanMaDvt)
                .orElseThrow(() -> new ResourceNotFoundException("Unit conversion not found with MADVT: " + cleanMaDvt));
    }

    private HangHoaResponse toResponse(HangHoa hangHoa, String maKho) {
        HangHoaResponse response = new HangHoaResponse();
        response.setMaHang(hangHoa.getMaHang());
        response.setTenHang(hangHoa.getTenHang());

        // Giá nhập, tồn kho, trạng thái
        response.setGiaNhap(hangHoa.getGiaNhap());
        
        // LOGIC TRỪ KHO ĐÚNG Ý: Nếu có maKho, ưu tiên lấy tồn kho của kho đó
        Integer displayedStock = hangHoa.getTonKho();
        if (maKho != null && !maKho.isEmpty()) {
            Optional<TonKho> tonKhoOpt = tonKhoRepository.findByMaHangHoaAndMaKho(hangHoa.getMaHang(), maKho);
            if (tonKhoOpt.isPresent()) {
                displayedStock = tonKhoOpt.get().getSoLuongTong().intValue();
            } else {
                displayedStock = 0; // Nếu kho này chưa từng nhập hàng này thì tồn là 0
            }
        }
        
        response.setTonKho(displayedStock);
        response.setHienThi(hangHoa.getHienThi());
        response.setGhiChu(hangHoa.getGhiChu());
        response.setNgayTao(hangHoa.getNgayTao());

        // 3 mức giá sỉ lẻ
        response.setGiaBan1(hangHoa.getGiaBan1());
        response.setGiaBan2(hangHoa.getGiaBan2());
        response.setGiaBan3(hangHoa.getGiaBan3());

        // Thông tin quy đổi DVT
        if (hangHoa.getUnitConversion() != null) {
            response.setMaDvt(hangHoa.getUnitConversion().getMaDvt());
            response.setDvt1(hangHoa.getUnitConversion().getDvt1());
            response.setDvt2(hangHoa.getUnitConversion().getDvt2());
            response.setDvt3(hangHoa.getUnitConversion().getDvt3());
            response.setQc1(hangHoa.getUnitConversion().getQc1());
            response.setQc2(hangHoa.getUnitConversion().getQc2());
        }

        // Liên kết nhóm
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
