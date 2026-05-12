package com.milkstore.service;

import com.milkstore.dto.request.UserAccountRequest;
import com.milkstore.dto.request.UserLoginRequest;
import com.milkstore.dto.request.UserRegisterRequest;
import com.milkstore.dto.response.AuthResponse;
import com.milkstore.dto.response.UserAccountResponse;
import java.util.List;

public interface UserAccountService {

    AuthResponse register(UserRegisterRequest request);

    AuthResponse login(UserLoginRequest request);

    List<UserAccountResponse> getAll();

    UserAccountResponse getByMaTaiKhoan(String maTaiKhoan);

    UserAccountResponse update(String maTaiKhoan, UserAccountRequest request);

    void delete(String maTaiKhoan);
}
