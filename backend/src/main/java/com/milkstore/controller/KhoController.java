package com.milkstore.controller;

import com.milkstore.entity.Kho;
import com.milkstore.entity.KhoNhanVien;
import com.milkstore.entity.TonKho;
import com.milkstore.repository.KhoNhanVienRepository;
import com.milkstore.repository.KhoRepository;
import com.milkstore.repository.TonKhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/kho")
@CrossOrigin(origins = "*")
public class KhoController {

    @Autowired
    private KhoRepository khoRepository;

    @Autowired
    private KhoNhanVienRepository khoNhanVienRepository;

    @Autowired
    private TonKhoRepository tonKhoRepository;

    // Lấy tất cả kho
    @GetMapping
    public List<Kho> getAllKho() {
        return khoRepository.findAll();
    }

    // Lấy danh sách kho mà nhân viên được phép truy cập
    @GetMapping("/user/{username}")
    public List<Kho> getKhoByUser(@PathVariable String username) {
        List<KhoNhanVien> permissions = khoNhanVienRepository.findByMaNhanVienAndChonDung(username, 1);
        List<String> allowedMaKho = permissions.stream()
                .map(KhoNhanVien::getMaKho)
                .collect(Collectors.toList());
        
        return khoRepository.findAllById(allowedMaKho);
    }

    // Kiểm tra tồn kho của 1 sản phẩm tại 1 kho cụ thể
    @GetMapping("/tonkho/{maKho}/{maHang}")
    public Optional<TonKho> getStock(@PathVariable String maKho, @PathVariable String maHang) {
        return tonKhoRepository.findByMaHangHoaAndMaKho(maHang, maKho);
    }
}
