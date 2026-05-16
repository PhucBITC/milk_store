package com.milkstore.repository;

import com.milkstore.entity.KhoNhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KhoNhanVienRepository extends JpaRepository<KhoNhanVien, Object> {
    List<KhoNhanVien> findByMaNhanVienAndChonDung(String maNhanVien, Integer chonDung);
}
