package com.milkstore.controller;

import com.milkstore.entity.Kho;
import com.milkstore.entity.KhoNhanVien;
import com.milkstore.entity.TonKho;
import com.milkstore.repository.KhoNhanVienRepository;
import com.milkstore.repository.KhoRepository;
import com.milkstore.repository.TonKhoRepository;
import jakarta.validation.Valid;
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

    // Thêm kho mới
    @PostMapping
    public Kho createKho(@Valid @RequestBody Kho kho) {
        return khoRepository.save(kho);
    }

    // Cập nhật thông tin kho
    @PutMapping("/{id}")
    public Kho updateKho(@PathVariable String id, @Valid @RequestBody Kho kho) {
        kho.setMaKho(id);
        return khoRepository.save(kho);
    }

    // Xóa kho
    @DeleteMapping("/{id}")
    public void deleteKho(@PathVariable String id) {
        khoRepository.deleteById(id);
    }

    // Cập nhật quyền truy cập kho cho nhân viên
    @PostMapping("/permissions")
    public void updatePermissions(@RequestBody List<KhoNhanVien> permissions) {
        if (permissions != null && !permissions.isEmpty()) {
            // Xóa quyền cũ của nhân viên này trước khi gán mới (giả sử tất cả thuộc về 1 nhân viên trong 1 lần gửi)
            String username = permissions.get(0).getMaNhanVien();
            List<KhoNhanVien> old = khoNhanVienRepository.findByMaNhanVienAndChonDung(username, 1);
            khoNhanVienRepository.deleteAll(old);
            khoNhanVienRepository.saveAll(permissions);
        }
    }
}
