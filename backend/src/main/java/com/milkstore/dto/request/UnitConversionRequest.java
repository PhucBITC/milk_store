package com.milkstore.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class UnitConversionRequest {

    @NotBlank(message = "MADVT is required")
    @JsonProperty("MADVT")
    private String maDvt;

    @NotBlank(message = "DVT1 is required")
    @JsonProperty("DVT1")
    private String dvt1;

    @NotBlank(message = "DVT2 is required")
    @JsonProperty("DVT2")
    private String dvt2;

    @NotBlank(message = "DVT3 is required")
    @JsonProperty("DVT3")
    private String dvt3;

    @NotNull(message = "QC1 is required")
    @Positive(message = "QC1 must be greater than 0")
    @JsonProperty("QC1")
    private Integer qc1;

    @NotNull(message = "QC2 is required")
    @Positive(message = "QC2 must be greater than 0")
    @JsonProperty("QC2")
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
