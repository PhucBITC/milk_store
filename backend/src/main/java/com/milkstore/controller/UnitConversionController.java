package com.milkstore.controller;

import com.milkstore.dto.request.UnitConversionRequest;
import com.milkstore.dto.response.UnitConversionResponse;
import com.milkstore.service.UnitConversionService;
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
@RequestMapping("/api/unit-conversions")
@CrossOrigin(origins = "http://localhost:5173")
public class UnitConversionController {

    private final UnitConversionService unitConversionService;

    public UnitConversionController(UnitConversionService unitConversionService) {
        this.unitConversionService = unitConversionService;
    }

    @PostMapping
    public ResponseEntity<UnitConversionResponse> create(@Valid @RequestBody UnitConversionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(unitConversionService.create(request));
    }

    @GetMapping
    public List<UnitConversionResponse> getAll() {
        return unitConversionService.getAll();
    }

    @GetMapping("/{maDvt}")
    public UnitConversionResponse getByMaDvt(@PathVariable String maDvt) {
        return unitConversionService.getByMaDvt(maDvt);
    }

    @PutMapping("/{maDvt}")
    public UnitConversionResponse update(@PathVariable String maDvt, @Valid @RequestBody UnitConversionRequest request) {
        return unitConversionService.update(maDvt, request);
    }

    @DeleteMapping("/{maDvt}")
    public ResponseEntity<Void> delete(@PathVariable String maDvt) {
        unitConversionService.delete(maDvt);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{maDvt}/calculate")
    public UnitConversionResponse calculate(@PathVariable String maDvt) {
        return unitConversionService.calculate(maDvt);
    }
}
