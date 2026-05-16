package com.milkstore.repository;

import com.milkstore.entity.TheKho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TheKhoRepository extends JpaRepository<TheKho, Long> {
    // Lịch sử biến động của 1 mặt hàng tại 1 kho cụ thể
    List<TheKho> findByMaHangHoaAndMaKhoOrderByNgayThucHienDesc(String maHangHoa, String maKho);

    // Toàn bộ nhật ký của 1 kho
    List<TheKho> findByMaKhoOrderByNgayThucHienDesc(String maKho);

    // Toàn bộ lịch sử của 1 mặt hàng qua các kho
    List<TheKho> findByMaHangHoaOrderByNgayThucHienDesc(String maHangHoa);

    // Truy vết theo số phiếu (PN001, HD001...)
    List<TheKho> findBySoPhieuOrderByNgayThucHienDesc(String soPhieu);

    // Truy vết theo loại phiếu (NHAP, XUAT, CHUYEN)
    List<TheKho> findByLoaiPhieuOrderByNgayThucHienDesc(String loaiPhieu);
}
