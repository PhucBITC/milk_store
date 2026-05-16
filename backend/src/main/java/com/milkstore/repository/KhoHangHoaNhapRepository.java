package com.milkstore.repository;

import com.milkstore.entity.KhoHangHoaNhap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KhoHangHoaNhapRepository extends JpaRepository<KhoHangHoaNhap, Long> {
    List<KhoHangHoaNhap> findByMaKhoOrderByNgayNhapDesc(String maKho);
    List<KhoHangHoaNhap> findByMaPhieuNhapOrderByNgayNhapDesc(String maPhieuNhap);
    List<KhoHangHoaNhap> findByMaHangHoaOrderByNgayNhapDesc(String maHangHoa);
    List<KhoHangHoaNhap> findByMaNhaCungCapOrderByNgayNhapDesc(String maNhaCungCap);
    List<KhoHangHoaNhap> findAllByOrderByNgayNhapDesc();
}
