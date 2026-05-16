package com.milkstore.repository;

import com.milkstore.entity.PhieuNhapKhoChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhieuNhapKhoChiTietRepository extends JpaRepository<PhieuNhapKhoChiTiet, Long> {
    List<PhieuNhapKhoChiTiet> findByPhieuNhap_MaPhieu(String maPhieu);
}
