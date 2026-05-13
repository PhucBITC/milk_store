package com.milkstore.repository;

import com.milkstore.entity.KhachHang;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KhachHangRepository extends JpaRepository<KhachHang, String> {

    List<KhachHang> findByMaKhachHangContainingIgnoreCaseOrTenKhachHangContainingIgnoreCaseOrSoDtContainingIgnoreCaseOrMaSoThueContainingIgnoreCase(
            String maKhachHang,
            String tenKhachHang,
            String soDt,
            String maSoThue,
            Sort sort
    );
}
