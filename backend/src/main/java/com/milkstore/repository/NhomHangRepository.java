package com.milkstore.repository;

import com.milkstore.entity.NhomHang;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NhomHangRepository extends JpaRepository<NhomHang, String> {

    List<NhomHang> findByMaNhomHangContainingIgnoreCaseOrTenNhomHangContainingIgnoreCase(
            String maNhomHang,
            String tenNhomHang,
            Sort sort
    );
}
