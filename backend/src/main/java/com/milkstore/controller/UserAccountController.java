package com.milkstore.controller;

import com.milkstore.dto.request.UserAccountRequest;
import com.milkstore.dto.request.UserRegisterRequest;
import com.milkstore.dto.response.AuthResponse;
import com.milkstore.dto.response.UserAccountResponse;
import com.milkstore.service.UserAccountService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserAccountController {

    private final UserAccountService userAccountService;

    public UserAccountController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @GetMapping
    public List<UserAccountResponse> getAll() {
        return userAccountService.getAll();
    }

    @GetMapping("/{maTaiKhoan}")
    public UserAccountResponse getByMaTaiKhoan(@PathVariable String maTaiKhoan) {
        return userAccountService.getByMaTaiKhoan(maTaiKhoan);
    }

    @PostMapping
    public ResponseEntity<AuthResponse> create(@Valid @RequestBody UserRegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userAccountService.register(request));
    }

    @PutMapping("/{maTaiKhoan}")
    public UserAccountResponse update(
            @PathVariable String maTaiKhoan,
            @Valid @RequestBody UserAccountRequest request
    ) {
        return userAccountService.update(maTaiKhoan, request);
    }

    @DeleteMapping("/{maTaiKhoan}")
    public ResponseEntity<Void> delete(@PathVariable String maTaiKhoan) {
        userAccountService.delete(maTaiKhoan);
        return ResponseEntity.noContent().build();
    }
}
