package com.milkstore.controller;

import com.milkstore.dto.request.UserLoginRequest;
import com.milkstore.dto.request.UserRegisterRequest;
import com.milkstore.dto.response.AuthResponse;
import com.milkstore.service.UserAccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserAccountService userAccountService;

    public AuthController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userAccountService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody UserLoginRequest request) {
        return userAccountService.login(request);
    }
}
