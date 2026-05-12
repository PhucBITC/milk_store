package com.milkstore.repository;

import com.milkstore.entity.UnitConversion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnitConversionRepository extends JpaRepository<UnitConversion, String> {

    boolean existsByMaDvt(String maDvt);
}
