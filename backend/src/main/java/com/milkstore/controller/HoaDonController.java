package com.milkstore.controller;

import com.milkstore.dto.CheckoutRequest;
import com.milkstore.entity.HoaDon;
import com.milkstore.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hoadon")
@CrossOrigin(origins = "*")
public class HoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        try {
            HoaDon savedInvoice = hoaDonService.checkout(request);
            return ResponseEntity.ok(savedInvoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xử lý hóa đơn: " + e.getMessage());
        }
    }

    // Lấy danh sách tất cả hóa đơn
    @GetMapping
    public ResponseEntity<?> getAllInvoices() {
        return ResponseEntity.ok(hoaDonService.getAllInvoices());
    }

    // Lấy chi tiết của một hóa đơn
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getInvoiceDetails(@PathVariable String id) {
        return ResponseEntity.ok(hoaDonService.getInvoiceDetails(id));
    }
}
