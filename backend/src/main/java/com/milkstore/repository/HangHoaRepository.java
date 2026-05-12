package com.milkstore.repository;

import com.milkstore.entity.HangHoa;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HangHoaRepository extends JpaRepository<HangHoa, String> {

    List<HangHoa> findByMaHangContainingIgnoreCaseOrTenHangContainingIgnoreCase(
            String maHang,
            String tenHang,
            Sort sort
    );
}
