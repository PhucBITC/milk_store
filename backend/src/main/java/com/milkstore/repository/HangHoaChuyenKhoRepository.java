package com.milkstore.repository;

import com.milkstore.entity.HangHoaChuyenKho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HangHoaChuyenKhoRepository extends JpaRepository<HangHoaChuyenKho, Long> {
    List<HangHoaChuyenKho> findByMaKhoNguonOrderByNgayChuyenDesc(String maKhoNguon);
    List<HangHoaChuyenKho> findByMaKhoDichOrderByNgayChuyenDesc(String maKhoDich);
    List<HangHoaChuyenKho> findByMaPhieuChuyenOrderByNgayChuyenDesc(String maPhieuChuyen);
    List<HangHoaChuyenKho> findByMaHangHoaOrderByNgayChuyenDesc(String maHangHoa);
    List<HangHoaChuyenKho> findAllByOrderByNgayChuyenDesc();
    Optional<HangHoaChuyenKho> findTopByMaPhieuChuyenStartingWithOrderByMaPhieuChuyenDesc(String prefix);
}
