package com.milkstore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TB_KHO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Kho {
    @Id
    @Column(name = "MAKHO", length = 50)
    @NotBlank(message = "Mã kho không được để trống")
    @Size(max = 50, message = "Mã kho không quá 50 ký tự")
    private String maKho;

    @Column(name = "TENKHO", length = 255)
    @NotBlank(message = "Tên kho không được để trống")
    @Size(max = 255, message = "Tên kho không quá 255 ký tự")
    private String tenKho;

    @Column(name = "CANHBAO")
    private Integer canhBao;
}
