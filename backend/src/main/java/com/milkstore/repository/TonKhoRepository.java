package com.milkstore.repository;

import com.milkstore.entity.TonKho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TonKhoRepository extends JpaRepository<TonKho, Object> {
    Optional<TonKho> findByMaHangHoaAndMaKho(String maHangHoa, String maKho);
}
