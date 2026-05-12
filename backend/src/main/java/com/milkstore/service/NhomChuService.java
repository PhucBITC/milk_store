package com.milkstore.service;

import com.milkstore.dto.request.NhomChuRequest;
import com.milkstore.dto.response.NhomChuResponse;
import java.util.List;

public interface NhomChuService {

    List<NhomChuResponse> getAll();

    List<NhomChuResponse> search(String keyword);

    NhomChuResponse getByMaNhom(String maNhom);

    NhomChuResponse create(NhomChuRequest request);

    NhomChuResponse update(String maNhom, NhomChuRequest request);

    void delete(String maNhom);
}
