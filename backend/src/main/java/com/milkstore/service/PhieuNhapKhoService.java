package com.milkstore.service;

import com.milkstore.dto.request.PhieuNhapKhoRequest;
import com.milkstore.dto.response.PhieuNhapKhoResponse;
import java.util.List;

public interface PhieuNhapKhoService {
    /** Tạo phiếu nhập mới: lưu DB + cộng tồn kho + ghi TheKho */
    PhieuNhapKhoResponse createPhieuNhap(PhieuNhapKhoRequest request);

    /** Danh sách tất cả phiếu nhập (mới nhất trước) */
    List<PhieuNhapKhoResponse> getAllPhieuNhap();

    /** Chi tiết 1 phiếu nhập */
    PhieuNhapKhoResponse getByMaPhieu(String maPhieu);

    /** Phiếu nhập theo chi nhánh kho */
    List<PhieuNhapKhoResponse> getByMaKho(String maKho);

    /** Phiếu nhập theo nhà cung cấp */
    List<PhieuNhapKhoResponse> getByMaNhaCungCap(String maNhaCungCap);

    /** Xóa phiếu nhập (tự động hoàn kho) */
    void deletePhieuNhap(String maPhieu);
}
