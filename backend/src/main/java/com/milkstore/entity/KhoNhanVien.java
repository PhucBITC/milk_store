package com.milkstore.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
class KhoNhanVienId implements Serializable {
    private String maNhanVien;
    private String maKho;
}

@Entity
@Table(name = "TB_KHO_NHANVIEN")
@IdClass(KhoNhanVienId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhoNhanVien {
    @Id
    @Column(name = "MANHANVIEN", length = 50)
    private String maNhanVien;

    @Id
    @Column(name = "MAKHO", length = 50)
    private String maKho;

    @Column(name = "CHONDUNG")
    private Integer chonDung; // 1: Có quyền, 0: Không
}
