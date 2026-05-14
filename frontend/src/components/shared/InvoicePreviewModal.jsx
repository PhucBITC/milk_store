import React from 'react';

const InvoicePreviewModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const { saleMeta, cartItems, finalTotal, totalPrice, discountAmount, vatAmount, invoiceId, amountInWords } = data;
  const now = new Date().toLocaleString('vi-VN');

  return (
    <div className="modal-overlay">
      <div className="modal-content invoice-preview-content">
        <div className="preview-header-actions">
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="invoice-container">
          <div className="invoice-header">
            <h1 className="store-name">MILK STORE</h1>
            <p className="store-info">Địa chỉ: 55 Đà Nẵng, Ngô Quyền, Hải Phòng</p>
            <p className="store-info">Hotline: 0906.532.999</p>
            <h2 className="invoice-title">HÓA ĐƠN BÁN LẺ</h2>
            <div className="invoice-meta">
              <span>Số HD: {invoiceId || 'MỚI'}</span>
              <span>Ngày: {now}</span>
            </div>
          </div>

          <div className="invoice-customer">
            <p><strong>Khách hàng:</strong> {saleMeta.customerName || 'Khách lẻ'}</p>
            <p><strong>SĐT:</strong> {saleMeta.customerPhone || 'N/A'}</p>
            <p><strong>Địa chỉ:</strong> {saleMeta.customerAddress || 'N/A'}</p>
            <p><strong>Nhân viên:</strong> {saleMeta.salesStaff || 'N/A'}</p>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>SL</th>
                <th>ĐVT</th>
                <th>Đơn giá</th>
                <th>T.Tiền</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.selectedTier === 'DVT1' ? item.dvt1 : item.selectedTier === 'DVT2' ? item.dvt2 : item.dvt3}</td>
                  <td>{(item.selectedTier === 'DVT1' ? item.giaBan1 : item.selectedTier === 'DVT2' ? item.giaBan2 : item.giaBan3).toLocaleString()}</td>
                  <td>{((item.selectedTier === 'DVT1' ? item.giaBan1 : item.selectedTier === 'DVT2' ? item.giaBan2 : item.giaBan3) * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-footer">
            <div className="footer-row">
              <span>Tạm tính:</span>
              <span>{totalPrice.toLocaleString()} đ</span>
            </div>
            {discountAmount > 0 && (
              <div className="footer-row">
                <span>Giảm giá:</span>
                <span>-{discountAmount.toLocaleString()} đ</span>
              </div>
            )}
            {vatAmount > 0 && (
              <div className="footer-row">
                <span>VAT:</span>
                <span>{vatAmount.toLocaleString()} đ</span>
              </div>
            )}
            <div className="footer-row grand-total">
              <span>TỔNG THANH TOÁN:</span>
              <span>{finalTotal.toLocaleString()} đ</span>
            </div>
            <p className="amount-words"><i>Bằng chữ: {amountInWords}</i></p>
          </div>

          <div className="invoice-signatures">
            <div className="signature-box">
              <p>Khách hàng</p>
              <small>(Ký, họ tên)</small>
            </div>
            <div className="signature-box">
              <p>Người bán hàng</p>
              <small>(Ký, họ tên)</small>
            </div>
          </div>
          
          <div className="invoice-note">
            <p>Cảm ơn Quý khách! Hẹn gặp lại!</p>
          </div>
        </div>

        <div className="preview-footer-actions">
          <button className="modal-btn cancel" onClick={onClose}>Đóng (Esc)</button>
          <button className="modal-btn confirm" onClick={() => window.print()}>In hóa đơn (F11)</button>
        </div>
      </div>

      <style jsx>{`
        .invoice-preview-content {
          max-width: 600px !important;
          max-height: 90vh;
          overflow-y: auto;
          background: #fdfdfd !important;
        }
        .invoice-container {
          background: #fff;
          padding: 20px;
          color: #000;
          font-family: 'Courier New', Courier, monospace;
        }
        .store-name { font-size: 24px; text-align: center; margin-bottom: 5px; color: #1d6b61; }
        .store-info { text-align: center; margin: 2px 0; font-size: 14px; }
        .invoice-title { text-align: center; margin: 20px 0; font-size: 20px; text-decoration: underline; }
        .invoice-meta { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 20px; }
        .invoice-customer { margin-bottom: 20px; font-size: 14px; line-height: 1.6; }
        .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
        .invoice-table th { border-bottom: 1px solid #000; padding: 8px; text-align: left; }
        .invoice-table td { padding: 8px; border-bottom: 1px dashed #eee; }
        .invoice-footer { border-top: 2px solid #000; padding-top: 10px; }
        .footer-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .grand-total { font-weight: bold; font-size: 18px; margin-top: 10px; border-top: 1px solid #000; padding-top: 5px; }
        .amount-words { margin-top: 10px; font-size: 12px; }
        .invoice-signatures { display: flex; justify-content: space-around; margin-top: 40px; margin-bottom: 60px; text-align: center; }
        .signature-box p { font-weight: bold; margin-bottom: 0; }
        .invoice-note { text-align: center; border-top: 1px dashed #000; padding-top: 10px; font-style: italic; }
        .preview-header-actions { display: flex; justify-content: flex-end; }
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #666; }
        .preview-footer-actions { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
        
        @media print {
          .modal-overlay { background: none; position: static; display: block; }
          .preview-header-actions, .preview-footer-actions { display: none; }
          .modal-content { box-shadow: none; padding: 0; max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default InvoicePreviewModal;
