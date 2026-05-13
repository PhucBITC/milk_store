package com.milkstore.controller;

import com.milkstore.dto.request.KhachHangRequest;
import com.milkstore.dto.response.KhachHangResponse;
import com.milkstore.service.KhachHangService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/khach-hang")
@CrossOrigin(origins = "http://localhost:5173")
public class KhachHangController {

    private final KhachHangService khachHangService;

    public KhachHangController(KhachHangService khachHangService) {
        this.khachHangService = khachHangService;
    }

    @GetMapping
    public List<KhachHangResponse> getAll() {
        return khachHangService.getAll();
    }

    @GetMapping("/search")
    public List<KhachHangResponse> search(@RequestParam(defaultValue = "") String keyword) {
        return khachHangService.search(keyword);
    }

    @GetMapping("/{maKhachHang}")
    public KhachHangResponse getByMaKhachHang(@PathVariable String maKhachHang) {
        return khachHangService.getByMaKhachHang(maKhachHang);
    }

    @PostMapping
    public ResponseEntity<KhachHangResponse> create(@Valid @RequestBody KhachHangRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(khachHangService.create(request));
    }

    @PutMapping("/{maKhachHang}")
    public KhachHangResponse update(
            @PathVariable String maKhachHang,
            @Valid @RequestBody KhachHangRequest request
    ) {
        return khachHangService.update(maKhachHang, request);
    }

    @DeleteMapping("/{maKhachHang}")
    public ResponseEntity<Void> delete(@PathVariable String maKhachHang) {
        khachHangService.delete(maKhachHang);
        return ResponseEntity.noContent().build();
    }
}
