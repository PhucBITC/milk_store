package com.milkstore.repository;

import com.milkstore.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, String> {
    
    // Tìm hóa đơn mới nhất trong ngày để sinh mã (00001, 00002...)
    @Query(value = "SELECT TOP 1 * FROM TB_HOADON WHERE MA_HOA_DON LIKE :prefix% ORDER BY MA_HOA_DON DESC", nativeQuery = true)
    Optional<HoaDon> findTopByMaHoaDonStartingWithOrderByMaHoaDonDesc(@Param("prefix") String prefix);

    java.util.List<HoaDon> findAllByOrderByNgayGioTaoDesc();
}
