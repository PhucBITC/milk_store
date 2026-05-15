package com.milkstore.service;

import com.milkstore.dto.PaymentStatus;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PaymentService {
    // Lưu trữ trạng thái thanh toán tạm thời trong bộ nhớ
    // Key: OrderId (HD123456), Value: PaymentStatus
    private final Map<String, PaymentStatus> paymentTracker = new ConcurrentHashMap<>();

    public void createPayment(String orderId) {
        paymentTracker.put(orderId, PaymentStatus.PENDING);
    }

    public PaymentStatus getStatus(String orderId) {
        return paymentTracker.getOrDefault(orderId, PaymentStatus.PENDING);
    }

    public void confirmPayment(String orderId) {
        paymentTracker.put(orderId, PaymentStatus.PAID);
    }

    public void cancelPayment(String orderId) {
        paymentTracker.remove(orderId);
    }
}
