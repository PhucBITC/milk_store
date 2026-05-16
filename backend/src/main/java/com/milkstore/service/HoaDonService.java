package com.milkstore.service;

import com.milkstore.dto.CheckoutRequest;
import com.milkstore.entity.HangHoa;
import com.milkstore.entity.HoaDon;
import com.milkstore.entity.HoaDonChiTiet;
import com.milkstore.repository.HangHoaRepository;
import com.milkstore.repository.HoaDonChiTietRepository;
import com.milkstore.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    @Autowired
    private HangHoaRepository hangHoaRepository;

    @Transactional
    public HoaDon checkout(CheckoutRequest request) {
        // 1. Sinh mã hóa đơn theo quy tắc: MACHINHANH + NGAYTHANGNAM + 00001
        String maHoaDon = generateMaHoaDon(request.getMaChiNhanh());

        // 2. Lưu Hóa đơn chính (Header)
        HoaDon hoadon = new HoaDon();
        hoadon.setMaHoaDon(maHoaDon);
        hoadon.setMaChiNhanh(request.getMaChiNhanh());
        hoadon.setSoTienHoaDon(request.getTongTien());
        hoadon.setMaKhachHang(request.getMaKhachHang());
        hoadon.setSdtKhachHang(request.getSdtKhachHang());
        hoadon.setNhanVienBan(request.getNhanVienBan());
        hoadon.setHinhThucThanhToan(request.getHinhThucThanhToan());
        hoadon.setXuatVat(request.getXuatVat());
        hoadon.setNgayGioTao(LocalDateTime.now());

        HoaDon savedHoaDon = hoaDonRepository.save(hoadon);

        // 3. Lưu Chi tiết hóa đơn và Trừ kho
        for (CheckoutRequest.CartItemDTO itemDTO : request.getItems()) {
            // Lưu chi tiết
            HoaDonChiTiet chiTiet = new HoaDonChiTiet();
            chiTiet.setMaHoaDon(maHoaDon);
            chiTiet.setMaHang(itemDTO.getMaHang());
            chiTiet.setSoLuong(itemDTO.getSoLuong());
            chiTiet.setDonGia(itemDTO.getDonGia());
            chiTiet.setThanhTien(itemDTO.getThanhTien());
            chiTiet.setDvt(itemDTO.getDvt());
            hoaDonChiTietRepository.save(chiTiet);

            // Trừ kho (Trừ số lượng thực tế từ TB_HANGHOA)
            HangHoa hangHoa = hangHoaRepository.findById(itemDTO.getMaHang())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy mặt hàng: " + itemDTO.getMaHang()));
            
            int currentStock = hangHoa.getTonKho() != null ? hangHoa.getTonKho() : 0;
            hangHoa.setTonKho(currentStock - itemDTO.getSoLuong());
            hangHoaRepository.save(hangHoa);
        }

        return savedHoaDon;
    }

    private String generateMaHoaDon(String maChiNhanh) {
        String todayStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyyyy"));
        String prefix = maChiNhanh + todayStr;

        // Tìm hóa đơn cuối cùng trong ngày của chi nhánh này
        Optional<HoaDon> lastInvoice = hoaDonRepository.findTopByMaHoaDonStartingWithOrderByMaHoaDonDesc(prefix);

        int nextNumber = 1;
        if (lastInvoice.isPresent()) {
            String lastMa = lastInvoice.get().getMaHoaDon();
            // Lấy 5 số cuối
            String lastFive = lastMa.substring(lastMa.length() - 5);
            nextNumber = Integer.parseInt(lastFive) + 1;
        }

        return prefix + String.format("%05d", nextNumber);
    }
}
