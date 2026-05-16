package com.milkstore.repository;

import com.milkstore.entity.PhieuNhapKho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PhieuNhapKhoRepository extends JpaRepository<PhieuNhapKho, String> {
    List<PhieuNhapKho> findAllByOrderByNgayNhapDesc();
    List<PhieuNhapKho> findByMaKhoOrderByNgayNhapDesc(String maKho);
    List<PhieuNhapKho> findByMaNhaCungCapOrderByNgayNhapDesc(String maNhaCungCap);
    Optional<PhieuNhapKho> findTopByMaPhieuStartingWithOrderByMaPhieuDesc(String prefix);
}
