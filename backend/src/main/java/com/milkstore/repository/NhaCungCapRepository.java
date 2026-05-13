package com.milkstore.repository;

import com.milkstore.entity.NhaCungCap;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NhaCungCapRepository extends JpaRepository<NhaCungCap, String> {

    List<NhaCungCap> findByMaNhaCungCapContainingIgnoreCaseOrTenNhaCungCapContainingIgnoreCaseOrSoDtContainingIgnoreCaseOrMaSoThueContainingIgnoreCase(
            String maNhaCungCap,
            String tenNhaCungCap,
            String soDt,
            String maSoThue,
            Sort sort
    );
}
