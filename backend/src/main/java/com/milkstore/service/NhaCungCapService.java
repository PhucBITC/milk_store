package com.milkstore.service;

import com.milkstore.dto.request.NhaCungCapRequest;
import com.milkstore.dto.response.NhaCungCapResponse;
import java.util.List;

public interface NhaCungCapService {

    List<NhaCungCapResponse> getAll();

    List<NhaCungCapResponse> search(String keyword);

    NhaCungCapResponse getByMaNhaCungCap(String maNhaCungCap);

    NhaCungCapResponse create(NhaCungCapRequest request);

    NhaCungCapResponse update(String maNhaCungCap, NhaCungCapRequest request);

    void delete(String maNhaCungCap);
}
