package com.milkstore.controller;

import com.milkstore.dto.request.HangHoaRequest;
import com.milkstore.dto.response.HangHoaResponse;
import com.milkstore.service.HangHoaService;
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
@RequestMapping("/api/hang-hoa")
@CrossOrigin(origins = "http://localhost:5173")
public class HangHoaController {

    private final HangHoaService hangHoaService;

    public HangHoaController(HangHoaService hangHoaService) {
        this.hangHoaService = hangHoaService;
    }

    @GetMapping
    public List<HangHoaResponse> getAll(@RequestParam(required = false) String maKho) {
        return hangHoaService.getAll(maKho);
    }

    @GetMapping("/search")
    public List<HangHoaResponse> search(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) String maKho
    ) {
        return hangHoaService.search(keyword, maKho);
    }

    @GetMapping("/{maHang}")
    public HangHoaResponse getByMaHang(@PathVariable String maHang) {
        return hangHoaService.getByMaHang(maHang);
    }

    @PostMapping
    public ResponseEntity<HangHoaResponse> create(@Valid @RequestBody HangHoaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hangHoaService.create(request));
    }

    @PutMapping("/{maHang}")
    public HangHoaResponse update(
            @PathVariable String maHang,
            @Valid @RequestBody HangHoaRequest request
    ) {
        return hangHoaService.update(maHang, request);
    }

    @DeleteMapping("/{maHang}")
    public ResponseEntity<Void> delete(@PathVariable String maHang) {
        hangHoaService.delete(maHang);
        return ResponseEntity.noContent().build();
    }
}
