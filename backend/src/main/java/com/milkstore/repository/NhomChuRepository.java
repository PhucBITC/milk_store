package com.milkstore.repository;

import com.milkstore.entity.NhomChu;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NhomChuRepository extends JpaRepository<NhomChu, String> {

    List<NhomChu> findByMaNhomContainingIgnoreCaseOrTenNhomContainingIgnoreCase(
            String maNhom,
            String tenNhom,
            Sort sort
    );
}
