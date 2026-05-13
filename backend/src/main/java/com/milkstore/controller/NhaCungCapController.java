package com.milkstore.controller;

import com.milkstore.dto.request.NhaCungCapRequest;
import com.milkstore.dto.response.NhaCungCapResponse;
import com.milkstore.service.NhaCungCapService;
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
@RequestMapping("/api/nha-cung-cap")
@CrossOrigin(origins = "http://localhost:5173")
public class NhaCungCapController {

    private final NhaCungCapService nhaCungCapService;

    public NhaCungCapController(NhaCungCapService nhaCungCapService) {
        this.nhaCungCapService = nhaCungCapService;
    }

    @GetMapping
    public List<NhaCungCapResponse> getAll() {
        return nhaCungCapService.getAll();
    }

    @GetMapping("/search")
    public List<NhaCungCapResponse> search(@RequestParam(defaultValue = "") String keyword) {
        return nhaCungCapService.search(keyword);
    }

    @GetMapping("/{maNhaCungCap}")
    public NhaCungCapResponse getByMaNhaCungCap(@PathVariable String maNhaCungCap) {
        return nhaCungCapService.getByMaNhaCungCap(maNhaCungCap);
    }

    @PostMapping
    public ResponseEntity<NhaCungCapResponse> create(@Valid @RequestBody NhaCungCapRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(nhaCungCapService.create(request));
    }

    @PutMapping("/{maNhaCungCap}")
    public NhaCungCapResponse update(
            @PathVariable String maNhaCungCap,
            @Valid @RequestBody NhaCungCapRequest request
    ) {
        return nhaCungCapService.update(maNhaCungCap, request);
    }

    @DeleteMapping("/{maNhaCungCap}")
    public ResponseEntity<Void> delete(@PathVariable String maNhaCungCap) {
        nhaCungCapService.delete(maNhaCungCap);
        return ResponseEntity.noContent().build();
    }
}
