package com.milkstore.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "DONVITINH")
public class UnitConversion {

    @Id
    @Column(name = "MADVT", nullable = false, length = 50)
    private String maDvt;

    @Column(name = "DVT1", nullable = false, length = 100)
    private String dvt1;

    @Column(name = "DVT2", nullable = false, length = 100)
    private String dvt2;

    @Column(name = "DVT3", nullable = false, length = 100)
    private String dvt3;

    @Column(name = "QC1", nullable = false)
    private Integer qc1;

    @Column(name = "QC2", nullable = false)
    private Integer qc2;

    public String getMaDvt() {
        return maDvt;
    }

    public void setMaDvt(String maDvt) {
        this.maDvt = maDvt;
    }

    public String getDvt1() {
        return dvt1;
    }

    public void setDvt1(String dvt1) {
        this.dvt1 = dvt1;
    }

    public String getDvt2() {
        return dvt2;
    }

    public void setDvt2(String dvt2) {
        this.dvt2 = dvt2;
    }

    public String getDvt3() {
        return dvt3;
    }

    public void setDvt3(String dvt3) {
        this.dvt3 = dvt3;
    }

    public Integer getQc1() {
        return qc1;
    }

    public void setQc1(Integer qc1) {
        this.qc1 = qc1;
    }

    public Integer getQc2() {
        return qc2;
    }

    public void setQc2(Integer qc2) {
        this.qc2 = qc2;
    }
}
