package com.milkstore.controller;

import com.milkstore.dto.request.NhomChuRequest;
import com.milkstore.dto.response.NhomChuResponse;
import com.milkstore.service.NhomChuService;
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
@RequestMapping("/api/nhom-chu")
@CrossOrigin(origins = "http://localhost:5173")
public class NhomChuController {

    private final NhomChuService nhomChuService;

    public NhomChuController(NhomChuService nhomChuService) {
        this.nhomChuService = nhomChuService;
    }

    @GetMapping
    public List<NhomChuResponse> getAll() {
        return nhomChuService.getAll();
    }

    @GetMapping("/search")
    public List<NhomChuResponse> search(@RequestParam(defaultValue = "") String keyword) {
        return nhomChuService.search(keyword);
    }

    @GetMapping("/{maNhom}")
    public NhomChuResponse getByMaNhom(@PathVariable String maNhom) {
        return nhomChuService.getByMaNhom(maNhom);
    }

    @PostMapping
    public ResponseEntity<NhomChuResponse> create(@Valid @RequestBody NhomChuRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(nhomChuService.create(request));
    }

    @PutMapping("/{maNhom}")
    public NhomChuResponse update(
            @PathVariable String maNhom,
            @Valid @RequestBody NhomChuRequest request
    ) {
        return nhomChuService.update(maNhom, request);
    }

    @DeleteMapping("/{maNhom}")
    public ResponseEntity<Void> delete(@PathVariable String maNhom) {
        nhomChuService.delete(maNhom);
        return ResponseEntity.noContent().build();
    }
}
