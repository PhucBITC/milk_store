package com.milkstore.repository;

import com.milkstore.entity.KhoBanHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KhoBanHangRepository extends JpaRepository<KhoBanHang, Long> {
    List<KhoBanHang> findByMaKhoOrderByNgayBanDesc(String maKho);
    List<KhoBanHang> findByMaHoaDonOrderByNgayBanDesc(String maHoaDon);
    List<KhoBanHang> findByMaHangHoaOrderByNgayBanDesc(String maHangHoa);
    List<KhoBanHang> findAllByOrderByNgayBanDesc();
}
