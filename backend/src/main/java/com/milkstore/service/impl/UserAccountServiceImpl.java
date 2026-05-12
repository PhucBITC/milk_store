package com.milkstore.service.impl;

import com.milkstore.dto.request.UserAccountRequest;
import com.milkstore.dto.request.UserLoginRequest;
import com.milkstore.dto.request.UserRegisterRequest;
import com.milkstore.dto.response.AuthResponse;
import com.milkstore.dto.response.UserAccountResponse;
import com.milkstore.entity.UserAccount;
import com.milkstore.exception.ResourceNotFoundException;
import com.milkstore.repository.UserAccountRepository;
import com.milkstore.service.UserAccountService;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class UserAccountServiceImpl implements UserAccountService {

    private final UserAccountRepository userAccountRepository;

    public UserAccountServiceImpl(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public AuthResponse register(UserRegisterRequest request) {
        String maTaiKhoan = cleanText(request.getMaTaiKhoan());
        if (userAccountRepository.existsByMaTaiKhoan(maTaiKhoan)) {
            throw new IllegalArgumentException("MA_TAI_KHOAN already exists");
        }

        UserAccount userAccount = new UserAccount();
        userAccount.setMaTaiKhoan(maTaiKhoan);
        userAccount.setTenTaiKhoan(cleanText(request.getTenTaiKhoan()));
        userAccount.setMatKhau(request.getMatKhau());
        userAccount.setPhanQuyen(request.getPhanQuyen());
        userAccount.setMaCongTy(cleanText(request.getMaCongTy()));
        userAccount.setHienHd(request.getHienHd() == null ? 1 : request.getHienHd());
        userAccount.setMaCuaHang(cleanText(request.getMaCuaHang()));

        return new AuthResponse("REGISTER_SUCCESS", toResponse(userAccountRepository.save(userAccount)));
    }

    @Override
    public AuthResponse login(UserLoginRequest request) {
        String maTaiKhoan = cleanText(request.getMaTaiKhoan());
        UserAccount userAccount = findByMaTaiKhoan(maTaiKhoan);

        if (!userAccount.getMatKhau().equals(request.getMatKhau())) {
            throw new IllegalArgumentException("MA_TAI_KHOAN or MAT_KHAU is incorrect");
        }

        if (userAccount.getHienHd() == null || userAccount.getHienHd() != 1) {
            throw new IllegalArgumentException("User account is disabled");
        }

        return new AuthResponse("LOGIN_SUCCESS", toResponse(userAccount));
    }

    @Override
    public List<UserAccountResponse> getAll() {
        return userAccountRepository.findAll(Sort.by("maTaiKhoan"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public UserAccountResponse getByMaTaiKhoan(String maTaiKhoan) {
        return toResponse(findByMaTaiKhoan(maTaiKhoan));
    }

    @Override
    public UserAccountResponse update(String maTaiKhoan, UserAccountRequest request) {
        UserAccount userAccount = findByMaTaiKhoan(maTaiKhoan);
        userAccount.setTenTaiKhoan(cleanText(request.getTenTaiKhoan()));
        userAccount.setMatKhau(request.getMatKhau());
        userAccount.setPhanQuyen(request.getPhanQuyen());
        userAccount.setMaCongTy(cleanText(request.getMaCongTy()));
        userAccount.setHienHd(request.getHienHd());
        userAccount.setMaCuaHang(cleanText(request.getMaCuaHang()));

        return toResponse(userAccountRepository.save(userAccount));
    }

    @Override
    public void delete(String maTaiKhoan) {
        UserAccount userAccount = findByMaTaiKhoan(maTaiKhoan);
        userAccountRepository.delete(userAccount);
    }

    private UserAccount findByMaTaiKhoan(String maTaiKhoan) {
        String cleanMaTaiKhoan = cleanText(maTaiKhoan);
        return userAccountRepository.findByMaTaiKhoan(cleanMaTaiKhoan)
                .orElseThrow(() -> new ResourceNotFoundException("User account not found with MA_TAI_KHOAN: " + cleanMaTaiKhoan));
    }

    private UserAccountResponse toResponse(UserAccount userAccount) {
        UserAccountResponse response = new UserAccountResponse();
        response.setMaTaiKhoan(userAccount.getMaTaiKhoan());
        response.setTenTaiKhoan(userAccount.getTenTaiKhoan());
        response.setPhanQuyen(userAccount.getPhanQuyen());
        response.setMaCongTy(userAccount.getMaCongTy());
        response.setHienHd(userAccount.getHienHd());
        response.setMaCuaHang(userAccount.getMaCuaHang());
        return response;
    }

    private String cleanText(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }

        return value.trim().toUpperCase();
    }
}
