package com.milkstore.service;

import com.milkstore.dto.request.KhachHangRequest;
import com.milkstore.dto.response.KhachHangResponse;
import java.util.List;

public interface KhachHangService {

    List<KhachHangResponse> getAll();

    List<KhachHangResponse> search(String keyword);

    KhachHangResponse getByMaKhachHang(String maKhachHang);

    KhachHangResponse create(KhachHangRequest request);

    KhachHangResponse update(String maKhachHang, KhachHangRequest request);

    void delete(String maKhachHang);
}
