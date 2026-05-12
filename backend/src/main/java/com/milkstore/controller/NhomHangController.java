package com.milkstore.controller;

import com.milkstore.dto.request.NhomHangRequest;
import com.milkstore.dto.response.NhomHangResponse;
import com.milkstore.service.NhomHangService;
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
@RequestMapping("/api/nhom-hang")
@CrossOrigin(origins = "http://localhost:5173")
public class NhomHangController {

    private final NhomHangService nhomHangService;

    public NhomHangController(NhomHangService nhomHangService) {
        this.nhomHangService = nhomHangService;
    }

    @GetMapping
    public List<NhomHangResponse> getAll() {
        return nhomHangService.getAll();
    }

    @GetMapping("/search")
    public List<NhomHangResponse> search(@RequestParam(defaultValue = "") String keyword) {
        return nhomHangService.search(keyword);
    }

    @GetMapping("/{maNhomHang}")
    public NhomHangResponse getByMaNhomHang(@PathVariable String maNhomHang) {
        return nhomHangService.getByMaNhomHang(maNhomHang);
    }

    @PostMapping
    public ResponseEntity<NhomHangResponse> create(@Valid @RequestBody NhomHangRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(nhomHangService.create(request));
    }

    @PutMapping("/{maNhomHang}")
    public NhomHangResponse update(
            @PathVariable String maNhomHang,
            @Valid @RequestBody NhomHangRequest request
    ) {
        return nhomHangService.update(maNhomHang, request);
    }

    @DeleteMapping("/{maNhomHang}")
    public ResponseEntity<Void> delete(@PathVariable String maNhomHang) {
        nhomHangService.delete(maNhomHang);
        return ResponseEntity.noContent().build();
    }
}
