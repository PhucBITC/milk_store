package com.milkstore.service;

import com.milkstore.dto.request.UnitConversionRequest;
import com.milkstore.dto.response.UnitConversionResponse;
import java.util.List;

public interface UnitConversionService {

    UnitConversionResponse create(UnitConversionRequest request);

    List<UnitConversionResponse> getAll();

    UnitConversionResponse getByMaDvt(String maDvt);

    UnitConversionResponse update(String maDvt, UnitConversionRequest request);

    void delete(String maDvt);

    UnitConversionResponse calculate(String maDvt);
}
