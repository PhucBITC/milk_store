package com.milkstore.service;

import com.milkstore.dto.request.HangHoaRequest;
import com.milkstore.dto.response.HangHoaResponse;
import java.util.List;

public interface HangHoaService {

    List<HangHoaResponse> getAll(String maKho);

    List<HangHoaResponse> search(String keyword, String maKho);

    HangHoaResponse getByMaHang(String maHang);

    HangHoaResponse create(HangHoaRequest request);

    HangHoaResponse update(String maHang, HangHoaRequest request);

    void delete(String maHang);
}
