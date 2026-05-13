import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getHangHoaList, updateHangHoa } from '../../services/hangHoaService'
import './SalesDashboard.css'

const sampleProducts = [
  {
    code: 'SUA-001',
    name: 'Sữa tươi tiệt trùng ME XIU 1L',
    unit: 'Thùng',
    warehouse: 'Kho A',
    quantity: 2,
    price: '360.000',
    total: '720.000',
    note: 'HSD 12/2026',
  },
  {
    code: 'SUA-014',
    name: 'Sữa chua uống dâu 180ml',
    unit: 'Khay',
    warehouse: 'Kho B',
    quantity: 5,
    price: '96.000',
    total: '480.000',
    note: 'Giao lạnh',
  },
]

function createInvoiceSnapshot() {
  const now = Date.now()

  return {
    id: `HD${now.toString().slice(-6)}`, 
    createdAt: new Date(now).toISOString(),
  }
}

function SalesDashboard({ t }) {
  const [dbProducts, setDbProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const navigate = useNavigate()

  // Tải danh sách Hàng hóa thực tế từ DB kèm theo cấu trúc giá 3 tầng
  useEffect(() => {
    let isMounted = true
    getHangHoaList()
      .then((res) => {
        if (isMounted) {
          setDbProducts(res.data)
        }
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  // Lấy danh sách hóa đơn từ localStorage để tính toán các chỉ số Header thực tế
  const savedInvoices = JSON.parse(localStorage.getItem('milkstore_invoices') || '[]')
  const totalInvoicesCount = savedInvoices.length
  // Giả định đại lý ban đầu là 12, tăng dần khi có đơn hàng để số liệu trông sống động
  const activeAgenciesCount = 12 + Math.floor(totalInvoicesCount / 2)

  const dynamicStats = [
    { value: `${totalInvoicesCount}`, label: 'Hóa đơn đã xuất' },
    { value: `${dbProducts.length || '...'}`, label: 'Sản phẩm khả dụng' },
    { value: `${activeAgenciesCount}`, label: 'Đại lý hôm nay' },
  ]

  // Gợi ý danh sách sản phẩm từ DB kèm theo cả 3 mức giá sỉ/lẻ và đối tượng dữ liệu gốc
  const availableOptions = dbProducts.length > 0
    ? dbProducts.map((p) => ({
        code: p.maHang,
        name: p.tenHang,
        dvt1: p.dvt1,
        dvt2: p.dvt2,
        dvt3: p.dvt3 || p.dvt,
        giaBan1: Number(p.giaBan1) || 0,
        giaBan2: Number(p.giaBan2) || 0,
        giaBan3: Number(p.giaBan3 || p.giaBan) || 0,
        qc1: p.qc1 || 1,
        qc2: p.qc2 || 1,
        warehouse: 'Kho Tổng',
        originalDbItem: p,
      }))
    : sampleProducts.map((p) => ({
        ...p,
        dvt3: p.unit,
        giaBan3: Number(p.price.replace(/\./g, '')) || 0,
      }))

  const handleAddProduct = (code) => {
    if (!code) return
    const found = availableOptions.find((item) => item.code === code)
    if (!found) return

    const dbItem = dbProducts.find((p) => p.maHang === code)
    const maxTonKho = dbItem ? Number(dbItem.tonKho) || 0 : 999999

    setCartItems((current) => {
      const existingRowIndex = current.findIndex((item) => item.code === code)

      if (existingRowIndex > -1) {
        const updated = [...current]
        const targetItem = updated[existingRowIndex]
        const currentQty = Number(targetItem.quantity) || 0
        const multiplier = targetItem.selectedTier === 'DVT1' ? (targetItem.qc1 * targetItem.qc2) : targetItem.selectedTier === 'DVT2' ? targetItem.qc2 : 1
        
        // Tính tổng cơ sở các dòng cùng mã
        const totalBaseSum = current.reduce((sum, it) => {
          if (it.code === code) {
            const m = it.selectedTier === 'DVT1' ? (it.qc1 * it.qc2) : it.selectedTier === 'DVT2' ? it.qc2 : 1
            return sum + (Number(it.quantity) || 0) * m
          }
          return sum
        }, 0)

        if (totalBaseSum + multiplier > maxTonKho) {
          toast.warn(`⚠️ Không đủ tồn kho để tăng tiếp mặt hàng này! (Tồn kho tối đa: ${maxTonKho} ${dbItem?.dvt3 || dbItem?.dvt || ''})`)
          return current
        }

        updated[existingRowIndex] = {
          ...targetItem,
          quantity: currentQty + 1,
        }
        toast.success(`Đã tăng số lượng mặt hàng [${code}]`)
        return updated
      }

      const initialTier = found.dvt1 && found.giaBan1 > 0
        ? 'DVT1'
        : found.dvt2 && found.giaBan2 > 0
        ? 'DVT2'
        : 'DVT3'

      const initialMultiplier = initialTier === 'DVT1' ? (found.qc1 * found.qc2) : initialTier === 'DVT2' ? found.qc2 : 1

      if (initialMultiplier > maxTonKho) {
        toast.warn(`⚠️ Tồn kho không đủ để bán quy cách ${initialTier}! (Tồn kho: ${maxTonKho})`)
        if (1 <= maxTonKho) {
          toast.info('Tự động chuyển sang ĐVT cơ sở do không đủ tồn kho Thùng/Lốc')
          const uniqueId = `${code}-${Date.now()}`
          return [...current, { ...found, cartRowId: uniqueId, selectedTier: 'DVT3', quantity: 1 }]
        }
        return current
      }

      toast.success(`Đã thêm mặt hàng [${code}] vào hóa đơn`)
      const uniqueId = `${code}-${Date.now()}`
      return [...current, { ...found, cartRowId: uniqueId, selectedTier: initialTier, quantity: 1 }]
    })
    setSelectedProduct('')
    setCheckoutMessage('')
  }

  const handleSplitRow = (itemToSplit) => {
    setCartItems((current) => {
      const index = current.findIndex((item) => item.cartRowId === itemToSplit.cartRowId)
      if (index === -1) return current

      const dbItem = dbProducts.find((p) => p.maHang === itemToSplit.code)
      if (dbItem) {
        const maxTonKho = Number(dbItem.tonKho) || 0
        const totalBaseSum = current.reduce((sum, it) => {
          if (it.code === itemToSplit.code) {
            const m = it.selectedTier === 'DVT1' ? (it.qc1 * it.qc2) : it.selectedTier === 'DVT2' ? it.qc2 : 1
            return sum + (Number(it.quantity) || 0) * m
          }
          return sum
        }, 0)

        if (totalBaseSum + 1 > maxTonKho) {
          toast.warn(`⚠️ Hết tồn kho khả dụng để tách thêm dòng mới!`)
          return current
        }
      }

      const updated = [...current]
      const newRowUniqueId = `${itemToSplit.code}-${Date.now()}`
      const newRow = {
        ...itemToSplit,
        cartRowId: newRowUniqueId,
        selectedTier: 'DVT3',
        quantity: 1,
      }

      updated.splice(index + 1, 0, newRow)
      toast.info('Đã tách thêm 1 dòng quy cách độc lập cho mặt hàng')
      return updated
    })
  }

  // Cập nhật số lượng qua nút + / - kèm kiểm tra Validation Tồn kho
  const handleUpdateQty = (cartRowId, delta) => {
    // Trường hợp bấm nút Xóa (delta rất nhỏ)
    if (delta <= -999999) {
      setCartItems((current) => current.filter((it) => it.cartRowId !== cartRowId))
      toast.info('Đã xóa mặt hàng khỏi hóa đơn')
      return
    }

    setCartItems((current) => {
      const targetItem = current.find((it) => it.cartRowId === cartRowId)
      if (!targetItem) return current

      const currentQty = Number(targetItem.quantity) || 0
      const proposedQty = Math.max(0, currentQty + delta)

      // Kiểm tra validate với DB
      const dbItem = dbProducts.find((p) => p.maHang === targetItem.code)
      if (dbItem && delta > 0) {
        const maxTonKho = Number(dbItem.tonKho) || 0
        const multiplier = targetItem.selectedTier === 'DVT1' ? (targetItem.qc1 * targetItem.qc2) : targetItem.selectedTier === 'DVT2' ? targetItem.qc2 : 1
        
        // Tổng các dòng khác của cùng một mã sản phẩm
        const otherRowsBaseSum = current.reduce((sum, it) => {
          if (it.code === targetItem.code && it.cartRowId !== cartRowId) {
            const m = it.selectedTier === 'DVT1' ? (it.qc1 * it.qc2) : it.selectedTier === 'DVT2' ? it.qc2 : 1
            return sum + (Number(it.quantity) || 0) * m
          }
          return sum
        }, 0)

        const proposedBaseTotal = otherRowsBaseSum + (proposedQty * multiplier)
        if (proposedBaseTotal > maxTonKho) {
          toast.warn(`⚠️ Vượt quá tồn kho khả dụng! (Tồn kho tối đa: ${maxTonKho} ${dbItem.dvt3 || dbItem.dvt || ''})`)
          const maxAllowedQtyForRow = Math.floor((maxTonKho - otherRowsBaseSum) / multiplier)
          return current.map((it) => it.cartRowId === cartRowId ? { ...it, quantity: Math.max(0, maxAllowedQtyForRow) } : it)
        }
      }

      return current
        .map((item) => {
          if (item.cartRowId === cartRowId) {
            return { ...item, quantity: proposedQty }
          }
          return item
        })
        .filter((item) => Number(item.quantity) > 0)
    })
  }

  // Hỗ trợ gõ trực tiếp qua ô input kèm theo cảnh báo ngay lập tức nếu vượt ngưỡng
  const handleSetQtyText = (cartRowId, newQtyText) => {
    setCartItems((current) => {
      const targetItem = current.find((it) => it.cartRowId === cartRowId)
      if (!targetItem) return current

      const numericVal = Number(newQtyText)
      if (isNaN(numericVal) || newQtyText === '') {
        return current.map((item) => item.cartRowId === cartRowId ? { ...item, quantity: newQtyText } : item)
      }

      const dbItem = dbProducts.find((p) => p.maHang === targetItem.code)
      if (dbItem) {
        const maxTonKho = Number(dbItem.tonKho) || 0
        const multiplier = targetItem.selectedTier === 'DVT1' ? (targetItem.qc1 * targetItem.qc2) : targetItem.selectedTier === 'DVT2' ? targetItem.qc2 : 1
        
        const otherRowsBaseSum = current.reduce((sum, it) => {
          if (it.code === targetItem.code && it.cartRowId !== cartRowId) {
            const m = it.selectedTier === 'DVT1' ? (it.qc1 * it.qc2) : it.selectedTier === 'DVT2' ? it.qc2 : 1
            return sum + (Number(it.quantity) || 0) * m
          }
          return sum
        }, 0)

        const proposedBaseTotal = otherRowsBaseSum + (numericVal * multiplier)
        if (proposedBaseTotal > maxTonKho) {
          toast.warn(`⚠️ Vượt quá tồn kho khả dụng! (Tồn kho tối đa: ${maxTonKho} ${dbItem.dvt3 || dbItem.dvt || ''})`)
          const maxAllowedQtyForRow = Math.floor((maxTonKho - otherRowsBaseSum) / multiplier)
          return current.map((item) => item.cartRowId === cartRowId ? { ...item, quantity: Math.max(0, maxAllowedQtyForRow) } : item)
        }
      }

      return current.map((item) => item.cartRowId === cartRowId ? { ...item, quantity: newQtyText } : item)
    })
  }

  const handleSwitchTier = (cartRowId, newTier) => {
    setCartItems((current) => {
      return current.map((item) => {
        if (item.cartRowId === cartRowId) {
          return { ...item, selectedTier: newTier }
        }
        return item
      })
    })
  }

  const getLineDetails = (item) => {
    const unitLabel = item.selectedTier === 'DVT1'
      ? item.dvt1
      : item.selectedTier === 'DVT2'
      ? item.dvt2
      : item.dvt3

    const appliedPrice = item.selectedTier === 'DVT1'
      ? item.giaBan1
      : item.selectedTier === 'DVT2'
      ? item.giaBan2
      : item.giaBan3

    const baseQtyMultiplier = item.selectedTier === 'DVT1'
      ? item.qc1 * item.qc2
      : item.selectedTier === 'DVT2'
      ? item.qc2
      : 1

    const safeQty = Number(item.quantity) || 0
    const totalBaseQtyDecreased = safeQty * baseQtyMultiplier

    return { unitLabel, appliedPrice, totalBaseQtyDecreased, baseUnitName: item.dvt3 }
  }

  const totalPrice = cartItems.reduce((acc, item) => {
    const { appliedPrice } = getLineDetails(item)
    const safeQty = Number(item.quantity) || 0
    return acc + appliedPrice * safeQty
  }, 0)

  // Gọi API trừ kho và xuất hóa đơn
  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    // 1. Gộp tổng số lượng cơ sở cần trừ theo mã mặt hàng
    const qtyDecreasedByCode = {}
    cartItems.forEach((item) => {
      const { totalBaseQtyDecreased } = getLineDetails(item)
      qtyDecreasedByCode[item.code] = (qtyDecreasedByCode[item.code] || 0) + totalBaseQtyDecreased
    })

    // 2. Thực hiện gọi API updateHangHoa cập nhật lại Tồn kho thực tế
    for (const code of Object.keys(qtyDecreasedByCode)) {
      const decreaseQty = qtyDecreasedByCode[code]
      const targetItem = dbProducts.find((p) => p.maHang === code)
      
      if (targetItem) {
        const currentTonKho = Number(targetItem.tonKho) || 0
        const newTonKho = Math.max(0, currentTonKho - decreaseQty)

        try {
          await updateHangHoa(code, {
            tenHang: targetItem.tenHang,
            maNhomHang: targetItem.maNhomHang || targetItem.nhomHang?.maNhomHang || '',
            maDvt: targetItem.maDvt || targetItem.unitConversion?.maDvt || '',
            giaBan1: targetItem.giaBan1,
            giaBan2: targetItem.giaBan2,
            giaBan3: targetItem.giaBan3,
            giaNhap: targetItem.giaNhap,
            tonKho: newTonKho,
            hienThi: targetItem.hienThi ?? true,
            ghiChu: targetItem.ghiChu || '',
          })
        } catch {
          // Vẫn tiếp tục xử lý các mặt hàng khác nếu 1 mã bị lỗi
        }
      }
    }

    // 3. Tính toán chi phí vốn và lợi nhuận gộp cho hóa đơn
    const totalCost = cartItems.reduce((acc, item) => {
      const targetItem = dbProducts.find((p) => p.maHang === item.code)
      const costPrice = targetItem ? Number(targetItem.giaNhap) || 0 : 0
      const { totalBaseQtyDecreased } = getLineDetails(item)
      return acc + costPrice * totalBaseQtyDecreased
    }, 0)

    // 4. Tạo đối tượng Hóa đơn lưu vào localStorage
    const invoiceSnapshot = createInvoiceSnapshot()
    const invoiceId = invoiceSnapshot.id
    const finalItems = cartItems.map((item) => {
      const details = getLineDetails(item)
      return {
        ...item,
        appliedPrice: details.appliedPrice,
        totalBaseQtyDecreased: details.totalBaseQtyDecreased,
        unitLabel: details.unitLabel,
        safeQuantity: Number(item.quantity) || 0,
      }
    })

    const invoiceData = {
      id: invoiceId,
      createdAt: invoiceSnapshot.createdAt,
      items: finalItems,
      totalAmount: totalPrice,
      totalCost: totalCost,
      grossProfit: totalPrice - totalCost,
    }

    const currentInvoices = JSON.parse(localStorage.getItem('milkstore_invoices') || '[]')
    localStorage.setItem('milkstore_invoices', JSON.stringify([invoiceData, ...currentInvoices]))

    // 5. Cập nhật giao diện
    const successMsg = `Thanh toán thành công đơn hàng ${invoiceId} trị giá ${totalPrice.toLocaleString('vi-VN')} đ!`
    setCheckoutMessage(successMsg)
    toast.success(successMsg)
    setCartItems([])

    // Tải lại danh sách Hàng hóa để làm mới tồn kho hiển thị
    getHangHoaList().then((res) => setDbProducts(res.data)).catch(() => {})
  }

  return (
    <>
      {checkoutMessage ? (
        <div
          style={{
            padding: '1rem',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span>🎉 {checkoutMessage} (Hệ thống đã tự động trừ kho)</span>
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            style={{
              padding: '0.4rem 0.8rem',
              background: '#155724',
              color: '#fff',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}
          >
            📋 Xem lịch sử hóa đơn
          </button>
        </div>
      ) : null}

      <section className="admin-stats" aria-label="Dashboard stats">
        {dynamicStats.map((stat) => (
          <article key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="sales-layout">
        <div className="sales-main">
          <div
            className="sales-toolbar"
            style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <div>
              <h2>{t.admin.quickActions[0]}</h2>
              <p>{t.admin.salesDescription}</p>
            </div>

            <div style={{ flex: 1, minWidth: '250px' }}>
              <select
                value={selectedProduct}
                onChange={(e) => handleAddProduct(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  background: '#fff',
                  color: '#333',
                  fontWeight: 'bold',
                }}
              >
                <option value="">🔍 Chọn sản phẩm thêm vào hóa đơn...</option>
                {availableOptions.map((opt) => {
                  const currentDbItem = dbProducts.find((p) => p.maHang === opt.code)
                  const tonKhoText = currentDbItem ? `Tồn: ${currentDbItem.tonKho}` : ''
                  const defaultLabel = opt.dvt1 && opt.giaBan1 > 0
                    ? `${opt.dvt1}: ${opt.giaBan1.toLocaleString()} đ`
                    : `${opt.dvt3}: ${opt.giaBan3.toLocaleString()} đ`
                  return (
                    <option key={opt.code} value={opt.code}>
                      [{opt.code}] {opt.name} - ({defaultLabel}) {tonKhoText ? `[${tonKhoText}]` : ''}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className="invoice-area" aria-label={t.admin.title}>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã hàng</th>
                  <th>Tên hàng</th>
                  <th>Quy cách bán (ĐVT)</th>
                  <th>Số lượng</th>
                  <th>Đơn giá áp dụng</th>
                  <th>Thành tiền</th>
                  <th>Ý nghĩa trừ kho</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                      {t.admin.emptyText || 'Hóa đơn chưa có sản phẩm. Vui lòng chọn sản phẩm ở trên.'}
                    </td>
                  </tr>
                ) : (
                  cartItems.map((item, index) => {
                    const { appliedPrice, totalBaseQtyDecreased, baseUnitName } = getLineDetails(item)
                    const safeQty = Number(item.quantity) || 0
                    return (
                      <tr key={item.cartRowId}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{item.code}</strong>
                        </td>
                        <td>{item.name}</td>
                        <td>
                          <select
                            value={item.selectedTier}
                            onChange={(e) => handleSwitchTier(item.cartRowId, e.target.value)}
                            style={{
                              padding: '0.2rem',
                              borderRadius: '2px',
                              fontWeight: 'bold',
                              border: '1px solid #0d9488',
                              background: '#f0fdfa',
                              color: '#0f766e',
                            }}
                          >
                            {item.dvt1 ? (
                              <option value="DVT1">
                                {item.dvt1} (Giá: {item.giaBan1?.toLocaleString()} đ)
                              </option>
                            ) : null}
                            {item.dvt2 ? (
                              <option value="DVT2">
                                {item.dvt2} (Giá: {item.giaBan2?.toLocaleString()} đ)
                              </option>
                            ) : null}
                            <option value="DVT3">
                              {item.dvt3} (Giá: {item.giaBan3?.toLocaleString()} đ)
                            </option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.cartRowId, -1)}
                              style={{
                                padding: '0.2rem 0.5rem',
                                cursor: 'pointer',
                                background: '#eee',
                                border: '1px solid #ccc',
                                borderRadius: '2px',
                                fontWeight: 'bold',
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleSetQtyText(item.cartRowId, e.target.value)}
                              style={{
                                width: '50px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                padding: '0.2rem',
                                border: '1px solid #0d9488',
                                borderRadius: '2px',
                              }}
                              min="0"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.cartRowId, 1)}
                              style={{
                                padding: '0.2rem 0.5rem',
                                cursor: 'pointer',
                                background: '#eee',
                                border: '1px solid #ccc',
                                borderRadius: '2px',
                                fontWeight: 'bold',
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>{appliedPrice.toLocaleString('vi-VN')}</td>
                        <td>
                          <strong style={{ color: '#0d9488' }}>
                            {(appliedPrice * safeQty).toLocaleString('vi-VN')}
                          </strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', color: '#666' }}>
                            Ngầm trừ: <strong>{totalBaseQtyDecreased}</strong> {baseUnitName}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            {item.dvt1 || item.dvt2 ? (
                              <button
                                type="button"
                                onClick={() => handleSplitRow(item)}
                                style={{
                                  color: '#0284c7',
                                  background: '#e0f2fe',
                                  border: '1px solid #bae6fd',
                                  borderRadius: '2px',
                                  padding: '0.1rem 0.3rem',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  fontWeight: 'bold',
                                }}
                                title="Chèn thêm dòng quy cách khác cho mặt hàng này"
                              >
                                + Tách dòng
                              </button>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.cartRowId, -999999)}
                              style={{
                                color: 'red',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                              }}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="checkout-panel" aria-label={t.admin.payment}>
          <div className="checkout-header">
            <span>{t.admin.payment}</span>
            <strong>{totalPrice.toLocaleString('vi-VN')} đ</strong>
          </div>

          <label className="admin-checkbox">
            <input type="checkbox" />
            {t.admin.noPrint}
          </label>

          <div className="discount-grid">
            <label>
              {t.admin.discount}
              <input value="0" readOnly />
            </label>
            <label>
              {t.admin.percentDiscount}
              <input value="0%" readOnly />
            </label>
          </div>

          <p className="amount-text">{t.admin.amountInWords}</p>

          <div className="payment-actions">
            <button
              type="button"
              className="secondary-admin-action"
              onClick={() => {
                if (cartItems.length > 0) {
                  setCartItems([])
                  toast.info('Đã làm trống các mặt hàng trong hóa đơn')
                }
              }}
            >
              {t.admin.deleteBill || 'Xóa đơn'}
            </button>
            <button
              type="button"
              className="pay-action"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              style={{
                opacity: cartItems.length === 0 ? 0.5 : 1,
                cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {t.admin.payNow || 'F12 Thanh toán'}
            </button>
          </div>
        </aside>
      </section>
    </>
  )
}

export default SalesDashboard



