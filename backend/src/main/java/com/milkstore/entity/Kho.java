package com.milkstore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    private String maKho;

    @Column(name = "TENKHO", length = 255)
    private String tenKho;

    @Column(name = "CANHBAO")
    private Integer canhBao;
}
