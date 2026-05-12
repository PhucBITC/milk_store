package com.milkstore.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UnitConversionResponse {

    @JsonProperty("MADVT")
    private String maDvt;
    @JsonProperty("DVT1")
    private String dvt1;
    @JsonProperty("DVT2")
    private String dvt2;
    @JsonProperty("DVT3")
    private String dvt3;
    @JsonProperty("QC1")
    private Integer qc1;
    @JsonProperty("QC2")
    private Integer qc2;
    @JsonProperty("SMALLEST_QUANTITY_PER_LARGEST_UNIT")
    private Integer smallestQuantityPerLargestUnit;
    @JsonProperty("DESCRIPTION")
    private String description;

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

    public Integer getSmallestQuantityPerLargestUnit() {
        return smallestQuantityPerLargestUnit;
    }

    public void setSmallestQuantityPerLargestUnit(Integer smallestQuantityPerLargestUnit) {
        this.smallestQuantityPerLargestUnit = smallestQuantityPerLargestUnit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
