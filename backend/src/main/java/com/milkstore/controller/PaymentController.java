package com.milkstore.controller;

import com.milkstore.dto.PaymentStatus;
import com.milkstore.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*") // Cho phép các domain khác truy cập
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Frontend gọi cái này khi bắt đầu hiện mã QR
    @PostMapping("/create/{orderId}")
    public ResponseEntity<String> createPayment(@PathVariable String orderId) {
        paymentService.createPayment(orderId);
        return ResponseEntity.ok("Đã tạo yêu cầu thanh toán cho " + orderId);
    }

    // Frontend gọi cái này mỗi 2-3 giây để check xem khách trả chưa
    @GetMapping("/check/{orderId}")
    public ResponseEntity<Map<String, String>> checkStatus(@PathVariable String orderId) {
        PaymentStatus status = paymentService.getStatus(orderId);
        return ResponseEntity.ok(Map.of("status", status.name()));
    }

    // Endpoint giả lập: Bạn có thể gọi cái này bằng tay để test (VD: dùng Postman hoặc Browser)
    // Khi gọi endpoint này, Frontend sẽ tự động nhận diện là đã trả tiền
    @PostMapping("/simulate-confirm/{orderId}")
    public ResponseEntity<String> simulateConfirm(@PathVariable String orderId) {
        paymentService.confirmPayment(orderId);
        return ResponseEntity.ok("Giả lập: Đã xác nhận thanh toán thành công cho đơn " + orderId);
    }
}
