package com.milkstore.repository;

import com.milkstore.entity.UserAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, String> {

    Optional<UserAccount> findByMaTaiKhoan(String maTaiKhoan);

    boolean existsByMaTaiKhoan(String maTaiKhoan);
}
