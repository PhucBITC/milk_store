package com.milkstore.service;

import com.milkstore.dto.request.NhomHangRequest;
import com.milkstore.dto.response.NhomHangResponse;
import java.util.List;

public interface NhomHangService {

    List<NhomHangResponse> getAll();

    List<NhomHangResponse> search(String keyword);

    NhomHangResponse getByMaNhomHang(String maNhomHang);

    NhomHangResponse create(NhomHangRequest request);

    NhomHangResponse update(String maNhomHang, NhomHangRequest request);

    void delete(String maNhomHang);
}
