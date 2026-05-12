package com.milkstore.service.impl;

import com.milkstore.dto.request.UnitConversionRequest;
import com.milkstore.dto.response.UnitConversionResponse;
import com.milkstore.entity.UnitConversion;
import com.milkstore.exception.ResourceNotFoundException;
import com.milkstore.repository.UnitConversionRepository;
import com.milkstore.service.UnitConversionService;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class UnitConversionServiceImpl implements UnitConversionService {

    private final UnitConversionRepository unitConversionRepository;

    public UnitConversionServiceImpl(UnitConversionRepository unitConversionRepository) {
        this.unitConversionRepository = unitConversionRepository;
    }

    @Override
    public UnitConversionResponse create(UnitConversionRequest request) {
        String maDvt = cleanText(request.getMaDvt());
        if (unitConversionRepository.existsByMaDvt(maDvt)) {
            throw new IllegalArgumentException("MADVT already exists");
        }

        UnitConversion unitConversion = new UnitConversion();
        copyRequestToEntity(request, unitConversion);
        unitConversion.setMaDvt(maDvt);

        return toResponse(unitConversionRepository.save(unitConversion));
    }

    @Override
    public List<UnitConversionResponse> getAll() {
        return unitConversionRepository.findAll(Sort.by("maDvt"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public UnitConversionResponse getByMaDvt(String maDvt) {
        return toResponse(findByMaDvt(maDvt));
    }

    @Override
    public UnitConversionResponse update(String maDvt, UnitConversionRequest request) {
        UnitConversion unitConversion = findByMaDvt(maDvt);
        String nextMaDvt = cleanText(request.getMaDvt());
        if (!unitConversion.getMaDvt().equals(nextMaDvt)) {
            throw new IllegalArgumentException("MADVT cannot be changed");
        }

        copyRequestToEntity(request, unitConversion);

        return toResponse(unitConversionRepository.save(unitConversion));
    }

    @Override
    public void delete(String maDvt) {
        UnitConversion unitConversion = findByMaDvt(maDvt);
        unitConversionRepository.delete(unitConversion);
    }

    @Override
    public UnitConversionResponse calculate(String maDvt) {
        return toResponse(findByMaDvt(maDvt));
    }

    private UnitConversion findByMaDvt(String maDvt) {
        String cleanMaDvt = cleanText(maDvt);
        return unitConversionRepository.findById(cleanMaDvt)
                .orElseThrow(() -> new ResourceNotFoundException("Unit conversion not found with MADVT: " + cleanMaDvt));
    }

    private void copyRequestToEntity(UnitConversionRequest request, UnitConversion unitConversion) {
        unitConversion.setMaDvt(cleanText(request.getMaDvt()));
        unitConversion.setDvt1(cleanText(request.getDvt1()));
        unitConversion.setDvt2(cleanText(request.getDvt2()));
        unitConversion.setDvt3(cleanText(request.getDvt3()));
        unitConversion.setQc1(request.getQc1());
        unitConversion.setQc2(request.getQc2());
    }

    private UnitConversionResponse toResponse(UnitConversion unitConversion) {
        UnitConversionResponse response = new UnitConversionResponse();
        int smallestQuantityPerLargestUnit = unitConversion.getQc1() * unitConversion.getQc2();

        response.setMaDvt(unitConversion.getMaDvt());
        response.setDvt1(unitConversion.getDvt1());
        response.setDvt2(unitConversion.getDvt2());
        response.setDvt3(unitConversion.getDvt3());
        response.setQc1(unitConversion.getQc1());
        response.setQc2(unitConversion.getQc2());
        response.setSmallestQuantityPerLargestUnit(smallestQuantityPerLargestUnit);
        response.setDescription(
                "1 " + unitConversion.getDvt1() + " = " + unitConversion.getQc1() + " " + unitConversion.getDvt2()
                        + ", 1 " + unitConversion.getDvt2() + " = " + unitConversion.getQc2() + " " + unitConversion.getDvt3()
                        + ", so 1 " + unitConversion.getDvt1() + " = " + smallestQuantityPerLargestUnit + " " + unitConversion.getDvt3()
        );

        return response;
    }

    private String cleanText(String value) {
        return value == null ? null : value.trim().toUpperCase();
    }
}
