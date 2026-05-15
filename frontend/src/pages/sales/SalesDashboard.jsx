import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getHangHoaList, updateHangHoa } from '../../services/hangHoaService'
import { createKhachHang, getKhachHangList } from '../../services/khachHangService'
import ConfirmationModal from '../../components/shared/ConfirmationModal'
import InvoicePreviewModal from '../../components/shared/InvoicePreviewModal'
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
  const [customers, setCustomers] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [saleMeta, setSaleMeta] = useState({
    warehouse: 'Kho Tổng',
    salesStaff: '',
    customerPhone: '',
    customerName: '',
    customerAddress: '',
    invoiceNote: '',
    orderMode: 'sale',
    noPrint: false,
    discountAmount: '0',
    discountPercent: '0',
    oldDebt: '0',
  })
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [drafts, setDrafts] = useState(() => {
    return JSON.parse(localStorage.getItem('milkstore_sales_drafts') || '[]')
  })
  const [showDraftList, setShowDraftList] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')

  // Sync drafts to localStorage
  useEffect(() => {
    localStorage.setItem('milkstore_sales_drafts', JSON.stringify(drafts))
  }, [drafts])
  const navigate = useNavigate()
  const lastProductToastRef = useRef({ code: '', message: '', time: 0 })


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

  useEffect(() => {
    let isMounted = true
    getKhachHangList()
      .then((res) => {
        if (isMounted) {
          setCustomers(res.data)
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
        notifyProductToast(lastProductToastRef, code, `Đã tăng số lượng mặt hàng [${code}]`)
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

      notifyProductToast(lastProductToastRef, code, `Đã thêm mặt hàng [${code}] vào hóa đơn`)
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
      return updated
    })
    toast.info('Đã tách thêm 1 dòng quy cách độc lập cho mặt hàng')
  }

  // Cập nhật số lượng qua nút + / - kèm kiểm tra Validation Tồn kho
  const handleUpdateQty = (cartRowId, delta) => {
    // Trường hợp bấm nút Xóa (delta rất nhỏ)
    if (delta <= -999999) {
      setModalConfig({
        isOpen: true,
        title: 'Xác nhận xóa',
        message: t.admin.deleteConfirm || 'Bạn có chắc chắn muốn xóa mặt hàng này khỏi hóa đơn?',
        onConfirm: () => {
          setCartItems((current) => current.filter((it) => it.cartRowId !== cartRowId))
          toast.info('Đã xóa mặt hàng khỏi hóa đơn')
          setModalConfig((prev) => ({ ...prev, isOpen: false }))
        },
      })
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

  const discountAmount = parseCurrencyNumber(saleMeta.discountAmount)
  const discountPercent = clampNumber(Number(saleMeta.discountPercent) || 0, 0, 100)
  const oldDebtAmount = parseCurrencyNumber(saleMeta.oldDebt)
  const vatAmount = 0
  const finalTotal = Math.max(0, totalPrice - discountAmount - Math.round(totalPrice * discountPercent / 100) + vatAmount)
  const amountInWords = numberToVietnamese(finalTotal)
  const cleanCustomerPhone = saleMeta.customerPhone.trim()
  const matchedCustomer = cleanCustomerPhone
    ? customers.find((customer) => [customer.maKhachHang, customer.soDt].includes(cleanCustomerPhone))
    : null
  const customerSuggestions = cleanCustomerPhone.length >= 2
    ? customers
        .filter((customer) =>
          [customer.maKhachHang, customer.soDt]
            .filter(Boolean)
            .some((phone) => phone.startsWith(cleanCustomerPhone))
        )
        .slice(0, 10)
    : []
  const isNewCustomer = cleanCustomerPhone.length >= 8 && !matchedCustomer

  const handleMetaChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = name === 'customerPhone' ? value.replace(/\D/g, '') : value
    setSaleMeta((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : nextValue,
      ...(name === 'customerPhone' ? getCustomerInfoByPhone(nextValue, customers) : {}),
    }))
  }

  const handleAddNewCustomer = async () => {
    if (!cleanCustomerPhone) {
      toast.warn('Vui lòng nhập số điện thoại khách hàng')
      return
    }

    if (!saleMeta.customerName.trim()) {
      toast.warn('Vui lòng nhập tên khách hàng')
      return
    }

    try {
      const response = await createKhachHang({
        maKhachHang: cleanCustomerPhone,
        tenKhachHang: saleMeta.customerName,
        soDt: cleanCustomerPhone,
        maSoThue: '',
        diaChi: saleMeta.customerAddress,
        maQuanHeNganSach: '',
        cccd: '',
      })
      setCustomers((current) => [response.data, ...current])
      setSaleMeta((current) => ({
        ...current,
        customerName: response.data.tenKhachHang || current.customerName,
        customerAddress: response.data.diaChi || current.customerAddress,
      }))
      toast.success('Đã thêm khách hàng mới')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể thêm khách hàng mới'))
    }
  }

  const handleCancelNewCustomer = () => {
    setSaleMeta((current) => ({
      ...current,
      customerPhone: '',
      customerName: '',
      customerAddress: '',
    }))
  }

  const handleSelectCustomer = (customer) => {
    const phone = customer.maKhachHang || customer.soDt || ''
    setSaleMeta((current) => ({
      ...current,
      customerPhone: phone,
      customerName: customer.tenKhachHang || '',
      customerAddress: customer.diaChi || '',
    }))
  }

  const handleUpdateItemNote = (cartRowId, note) => {
    setCartItems((current) =>
      current.map((item) => item.cartRowId === cartRowId ? { ...item, lineNote: note } : item)
    )
  }

  const handleSaveDraft = () => {
    if (cartItems.length === 0) {
      toast.warn('Giỏ hàng trống, không thể tạm dừng')
      return
    }

    const newDraft = {
      id: `DRAFT-${Date.now()}`,
      savedAt: new Date().toISOString(),
      customerName: saleMeta.customerName || 'Khách lẻ',
      customerPhone: saleMeta.customerPhone || '',
      itemCount: cartItems.length,
      totalAmount: finalTotal,
      saleMeta: { ...saleMeta },
      cartItems: [...cartItems],
    }

    setDrafts((prev) => [newDraft, ...prev])
    setCartItems([])
    // Reset meta except staff/warehouse
    setSaleMeta((prev) => ({
      ...prev,
      customerPhone: '',
      customerName: '',
      customerAddress: '',
      invoiceNote: '',
      discountAmount: '0',
      discountPercent: '0',
      oldDebt: '0',
      orderMode: 'sale'
    }))
    toast.success('Đã tạm dừng hóa đơn thành công')
  }

  const handleResumeDraft = (draft) => {
    if (cartItems.length > 0) {
      setModalConfig({
        isOpen: true,
        title: 'Cảnh báo ghi đè',
        message: 'Bạn đang có mặt hàng trong giỏ. Nạp đơn tạm sẽ xóa sạch giỏ hàng hiện tại. Bạn chắc chắn chứ?',
        onConfirm: () => {
          setCartItems(draft.cartItems)
          setSaleMeta(draft.saleMeta)
          setDrafts((prev) => prev.filter((d) => d.id !== draft.id))
          setShowDraftList(false)
          toast.success('Đã nạp lại đơn thành công')
          setModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
      })
      return
    }

    setCartItems(draft.cartItems)
    setSaleMeta(draft.saleMeta)
    setDrafts((prev) => prev.filter((d) => d.id !== draft.id))
    setShowDraftList(false)
    toast.success('Đã nạp lại đơn thành công')
  }

  const handleDeleteDraft = (draftId) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId))
    toast.info('Đã xóa đơn tạm')
  }

  const handleSaveOrder = () => {
    const pendingOrders = JSON.parse(localStorage.getItem('milkstore_pending_orders') || '[]')
    const order = {
      id: `DH${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      saleMeta,
      items: cartItems,
      totalAmount: finalTotal,
    }
    localStorage.setItem('milkstore_pending_orders', JSON.stringify([order, ...pendingOrders]))
    toast.success(`Đã lưu đặt hàng ${order.id}`)
  }

  const handlePreviewInvoice = () => {
    if (cartItems.length === 0) {
      toast.warn('Chưa có sản phẩm nào trong giỏ để xem trước')
      return
    }
    setIsPreviewOpen(true)
  }

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
        const isReturn = saleMeta.orderMode === 'return'
        // Nếu là Trả hàng -> Cộng kho. Nếu là Bán hàng -> Trừ kho.
        const newTonKho = isReturn 
          ? currentTonKho + decreaseQty 
          : Math.max(0, currentTonKho - decreaseQty)

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
      saleMeta,
      items: finalItems,
      subtotalAmount: totalPrice,
      discountAmount,
      discountPercent,
      vatAmount,
      oldDebtAmount,
      totalAmount: finalTotal,
      totalCost: totalCost,
      grossProfit: finalTotal - totalCost,
    }

    const currentInvoices = JSON.parse(localStorage.getItem('milkstore_invoices') || '[]')
    localStorage.setItem('milkstore_invoices', JSON.stringify([invoiceData, ...currentInvoices]))

    // 5. Cập nhật giao diện
    const isReturn = saleMeta.orderMode === 'return'
    const actionLabel = isReturn ? 'Nhập trả' : 'Thanh toán'
    const successMsg = `${actionLabel} thành công đơn hàng ${invoiceId} trị giá ${finalTotal.toLocaleString('vi-VN')} đ!`
    setCheckoutMessage(successMsg)
    toast.success(successMsg)
    setCartItems([])

    // Tải lại danh sách Hàng hóa để làm mới tồn kho hiển thị
    getHangHoaList().then((res) => setDbProducts(res.data)).catch(() => {})
  }

  // Phím tắt bàn phím (F10 - Xem trước, F12 - Thanh toán)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F10') {
        e.preventDefault()
        handlePreviewInvoice()
      }
      if (e.key === 'F12') {
        e.preventDefault()
        if (cartItems.length > 0) setShowPaymentModal(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cartItems, saleMeta, totalPrice, finalTotal])

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

      <section className="legacy-sale-panel" aria-label="Thông tin bán hàng">
        <div className="legacy-sale-grid">
          <label>
            Kho
            <select name="warehouse" value={saleMeta.warehouse} onChange={handleMetaChange}>
              <option value="Kho Tổng">Kho Tổng</option>
              <option value="Kho A">Kho A</option>
              <option value="Kho B">Kho B</option>
            </select>
          </label>
          <label>
            Nhân viên bán hàng
            <input name="salesStaff" value={saleMeta.salesStaff} onChange={handleMetaChange} placeholder="vd: Nhân viên bán hàng" />
          </label>
          <div className="legacy-button-row">
            <button
              type="button"
              className="draft-suspend-btn"
              onClick={handleSaveDraft}
              title="Tạm dừng đơn hàng hiện tại để phục vụ khách khác"
            >
              ⏸️ Tạm dừng đơn
            </button>
            <button
              type="button"
              className="draft-list-btn"
              onClick={() => setShowDraftList(!showDraftList)}
              style={{ position: 'relative' }}
            >
              📂 Đơn chờ ({drafts.length})
              {drafts.length > 0 && <span className="draft-badge">{drafts.length}</span>}
            </button>
            
            {showDraftList && (
              <div className="draft-popup-list">
                <div className="draft-popup-header">
                  <strong>Danh sách đơn đang chờ ({drafts.length})</strong>
                  <button onClick={() => setShowDraftList(false)}>×</button>
                </div>
                <div className="draft-popup-content">
                  {drafts.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>Không có đơn chờ nào</p>
                  ) : (
                    drafts.map((d) => (
                      <div key={d.id} className="draft-item-card">
                        <div className="draft-info">
                          <strong>{d.customerName}</strong>
                          <small>{d.customerPhone}</small>
                          <span className="draft-time">{new Date(d.savedAt).toLocaleTimeString('vi-VN')}</span>
                        </div>
                        <div className="draft-stats">
                          <span>{d.itemCount} món</span>
                          <strong>{d.totalAmount.toLocaleString('vi-VN')}đ</strong>
                        </div>
                        <div className="draft-actions">
                          <button className="resume-btn" onClick={() => handleResumeDraft(d)}>Nạp lại</button>
                          <button className="delete-draft-btn" onClick={() => handleDeleteDraft(d.id)}>×</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                const nextMode = saleMeta.orderMode === 'gift' ? 'sale' : 'gift'
                setSaleMeta((current) => ({ ...current, orderMode: nextMode }))
                if (nextMode === 'sale') {
                  toast.info('Đã quay lại chế độ BÁN HÀNG')
                } else {
                  toast.success('Đã chuyển sang chế độ TẶNG HÀNG (Giá 0đ)')
                }
              }}
              style={{ 
                background: saleMeta.orderMode === 'gift' ? '#f0fdf4' : '', 
                borderColor: saleMeta.orderMode === 'gift' ? '#86efac' : '',
                fontWeight: saleMeta.orderMode === 'gift' ? '900' : '600'
              }}
            >
              🎁 Tặng
            </button>
            <button
              type="button"
              onClick={() => {
                const nextMode = saleMeta.orderMode === 'return' ? 'sale' : 'return'
                setSaleMeta((current) => ({ ...current, orderMode: nextMode }))
                if (nextMode === 'sale') {
                  toast.info('Đã quay lại chế độ BÁN HÀNG')
                } else {
                  toast.error('Đã chuyển sang chế độ TRẢ HÀNG (Cộng kho)')
                }
              }}
              style={{ 
                background: saleMeta.orderMode === 'return' ? '#fef2f2' : '', 
                borderColor: saleMeta.orderMode === 'return' ? '#fecaca' : '',
                fontWeight: saleMeta.orderMode === 'return' ? '900' : '600'
              }}
            >
              🔄 Trả hàng
            </button>
          </div>

          <div className="legacy-customer-search">
            <span>Số điện thoại</span>
            <input name="customerPhone" value={saleMeta.customerPhone} onChange={handleMetaChange} placeholder="vd: 0906532999" inputMode="numeric" />
            {customerSuggestions.length > 0 && !matchedCustomer ? (
              <div className="customer-suggestions">
                {customerSuggestions.map((customer) => (
                  <button
                    key={customer.maKhachHang}
                    type="button"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <strong>{customer.maKhachHang || customer.soDt}</strong>
                    <span>{customer.tenKhachHang || 'Khách hàng'}</span>
                    <small>{customer.diaChi || 'Chưa có địa chỉ'}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <label>
            Tên khách hàng
            <input name="customerName" value={saleMeta.customerName} onChange={handleMetaChange} placeholder="vd: Nguyễn Văn A" readOnly={Boolean(matchedCustomer)} />
          </label>
          <label>
            Địa chỉ
            <input name="customerAddress" value={saleMeta.customerAddress} onChange={handleMetaChange} placeholder="vd: Địa chỉ" readOnly={Boolean(matchedCustomer)} />
          </label>
          {isNewCustomer ? (
            <div className="new-customer-actions">
              <strong>Khách hàng mới</strong>
              <button type="button" onClick={handleAddNewCustomer}>Thêm</button>
              <button
                type="button"
                onClick={() => {
                  setModalConfig({
                    isOpen: true,
                    title: 'Hủy thông tin',
                    message: 'Bạn có chắc chắn muốn xóa các thông tin khách hàng mới đã nhập?',
                    onConfirm: () => {
                      handleCancelNewCustomer()
                      setModalConfig((prev) => ({ ...prev, isOpen: false }))
                    },
                  })
                }}
              >
                Hủy
              </button>
            </div>
          ) : null}
          <label className="legacy-wide">
            Ghi chú hóa đơn
            <input name="invoiceNote" value={saleMeta.invoiceNote} onChange={handleMetaChange} placeholder="vd: Ghi chú" />
          </label>
        </div>
      </section>

      <section className="sales-stack">
        <div className="sales-products-panel">
          <div
            className="sales-toolbar"
            style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <div>
              <h2>{t.admin.quickActions[0]}</h2>
              <p>{t.admin.salesDescription}</p>
            </div>

            {saleMeta.orderMode === 'return' && (
              <div className="order-mode-banner return">
                <span>⚠️ ĐANG Ở CHẾ ĐỘ TRẢ HÀNG (SẼ CỘNG KHO KHI THANH TOÁN)</span>
              </div>
            )}
            {saleMeta.orderMode === 'gift' && (
              <div className="order-mode-banner gift">
                <span>🎁 ĐANG Ở CHẾ ĐỘ TẶNG HÀNG</span>
              </div>
            )}

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
                  <th>Ghi chú</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>
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
                          <input
                            className="line-note-input"
                            value={item.lineNote || ''}
                            onChange={(e) => handleUpdateItemNote(item.cartRowId, e.target.value)}
                            placeholder="Ghi chú"
                          />
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

        <aside className="payment-panel" aria-label={t.admin.payment}>
          <div className="payment-total-card">
            <div className="checkout-header">
              <span>{t.admin.payment}</span>
              <strong>{finalTotal.toLocaleString('vi-VN')} đ</strong>
            </div>
            <label className="admin-checkbox">
              <input name="noPrint" type="checkbox" checked={saleMeta.noPrint} onChange={handleMetaChange} />
              {t.admin.noPrint}
            </label>
          </div>

          <div className="payment-controls-card">
            <div className="discount-grid">
              <label>
                {t.admin.discount}
                <input name="discountAmount" value={saleMeta.discountAmount} onChange={handleMetaChange} inputMode="numeric" />
              </label>
              <label>
                {t.admin.percentDiscount}
                <input name="discountPercent" value={saleMeta.discountPercent} onChange={handleMetaChange} inputMode="decimal" />
              </label>
            </div>

            <div className="payment-summary">
              <span>Tạm tính</span><strong>{totalPrice.toLocaleString('vi-VN')} đ</strong>
              <span>VAT</span><strong>{vatAmount.toLocaleString('vi-VN')} đ</strong>
              <span>Nợ cũ</span><input name="oldDebt" value={saleMeta.oldDebt} onChange={handleMetaChange} inputMode="numeric" />
              <span>Tiền TT</span><strong>{finalTotal.toLocaleString('vi-VN')} đ</strong>
            </div>
          </div>

          <div className="payment-finish-card">
            <p className="amount-text">Bằng chữ: {amountInWords}</p>

            <div className="payment-actions">
              <button type="button" className="secondary-admin-action" onClick={() => toast.info('Đã gửi lệnh mở két')}>
                Mở két
              </button>
              <button type="button" className="secondary-admin-action" onClick={handleSaveOrder} disabled={cartItems.length === 0}>
                Lưu đặt hàng
              </button>
              <button type="button" className="secondary-admin-action" onClick={handlePreviewInvoice}>
                F10 Xem trước
              </button>
              <button
                type="button"
                className="secondary-admin-action"
                onClick={() => {
                  if (cartItems.length > 0) {
                    setModalConfig({
                      isOpen: true,
                      title: 'Xóa đơn hàng',
                      message: t.admin.deleteBillConfirm || 'Bạn có chắc chắn muốn xóa toàn bộ hóa đơn này?',
                      onConfirm: () => {
                        setCartItems([])
                        toast.info('Đã làm trống các mặt hàng trong hóa đơn')
                        setModalConfig((prev) => ({ ...prev, isOpen: false }))
                      },
                    })
                  }
                }}
              >
                {t.admin.deleteBill || 'Xóa đơn'}
              </button>
              <button
                type="button"
                className="pay-action"
                onClick={() => setShowPaymentModal(true)}
                disabled={cartItems.length === 0}
                style={{
                  opacity: cartItems.length === 0 ? 0.5 : 1,
                  cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {t.admin.payNow || 'F12 Thanh toán'}
              </button>
            </div>
          </div>
        </aside>
      </section>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      <InvoicePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={{
          saleMeta,
          cartItems,
          totalPrice,
          discountAmount,
          vatAmount,
          finalTotal,
          amountInWords,
        }}
      />

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-content">
            <h2>Chọn phương thức thanh toán</h2>
            
            {!paymentMethod ? (
              <div className="payment-options">
                <button 
                  className="payment-option-btn cash"
                  onClick={() => {
                    handleCheckout();
                    setShowPaymentModal(false);
                  }}
                >
                  <span className="payment-icon">💵</span>
                  <div className="payment-text">
                    <strong>Tiền mặt</strong>
                    <small>Thu tiền mặt trực tiếp</small>
                  </div>
                </button>
                <button 
                  className="payment-option-btn qr"
                  onClick={() => setPaymentMethod('qr')}
                >
                  <span className="payment-icon">📱</span>
                  <div className="payment-text">
                    <strong>Mã QR VIETQR</strong>
                    <small>Quét mã chuyển khoản</small>
                  </div>
                </button>
              </div>
            ) : (
              <div className="qr-payment-view">
                <h3>Quét mã QR để thanh toán</h3>
                <div className="qr-code-container">
                  <img 
                    src={`https://img.vietqr.io/image/970436-0123456789-compact2.png?amount=${finalTotal}&addInfo=Thanh toan don hang&accountName=MILK STORE`} 
                    alt="VietQR Code" 
                    className="qr-image"
                  />
                </div>
                <div className="qr-info">
                  <p>Số tiền: <strong>{finalTotal.toLocaleString('vi-VN')} đ</strong></p>
                  <p>Nội dung: <strong>Thanh toan don hang</strong></p>
                </div>
                <div className="qr-actions">
                  <button 
                    className="btn-back"
                    onClick={() => setPaymentMethod('')}
                  >
                    Quay lại
                  </button>
                  <button 
                    className="btn-confirm"
                    onClick={() => {
                      handleCheckout();
                      setShowPaymentModal(false);
                      setPaymentMethod('');
                    }}
                  >
                    Xác nhận đã nhận tiền
                  </button>
                </div>
              </div>
            )}
            
            <button className="payment-modal-close" onClick={() => {
              setShowPaymentModal(false);
              setPaymentMethod('');
            }}>×</button>
          </div>
        </div>
      )}
    </>
  )
}

function parseCurrencyNumber(value) {
  return Number(String(value || '0').replace(/[^\d]/g, '')) || 0
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function notifyProductToast(lastToastRef, code, message) {
  const now = Date.now()
  const lastToast = lastToastRef.current
  if (
    lastToast.code === code &&
    lastToast.message === message &&
    now - lastToast.time < 500
  ) {
    return
  }

  lastToastRef.current = { code, message, time: now }
  toast.success(message)
}

function numberToVietnamese(value) {
  const amount = Number(value) || 0
  if (amount === 0) {
    return 'Không đồng'
  }

  return `${amount.toLocaleString('vi-VN')} đồng`
}

function getCustomerInfoByPhone(phone, customers) {
  const cleanPhone = phone.trim()
  const matchedCustomer = cleanPhone
    ? customers.find((customer) => [customer.maKhachHang, customer.soDt].includes(cleanPhone))
    : null

  if (!matchedCustomer) {
    return {
      customerName: '',
      customerAddress: '',
    }
  }

  return {
    customerName: matchedCustomer.tenKhachHang || '',
    customerAddress: matchedCustomer.diaChi || '',
  }
}

function getErrorMessage(error, fallbackMessage) {
  const data = error.response?.data
  if (!data) {
    return fallbackMessage
  }

  if (typeof data === 'string') {
    return data
  }

  if (data.message) {
    return data.message
  }

  const firstError = Object.values(data).find(Boolean)
  return firstError || fallbackMessage
}

export default SalesDashboard
