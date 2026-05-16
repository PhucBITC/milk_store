package com.milkstore.repository;

import com.milkstore.entity.Kho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KhoRepository extends JpaRepository<Kho, String> {
}
