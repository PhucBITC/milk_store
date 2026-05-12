function UnitConversionTable({ items, onCalculate, onDelete, onEdit }) {
  return (
    <div className="unit-table-wrap">
      <table className="unit-table">
        <thead>
          <tr>
            <th>MADVT</th>
            <th>DVT1</th>
            <th>DVT2</th>
            <th>DVT3</th>
            <th>QC1</th>
            <th>QC2</th>
            <th>Quy đổi</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="8">Chưa có đơn vị tính.</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.MADVT}>
                <td>{item.MADVT}</td>
                <td>{item.DVT1}</td>
                <td>{item.DVT2}</td>
                <td>{item.DVT3}</td>
                <td>{item.QC1}</td>
                <td>{item.QC2}</td>
                <td>
                  1 {item.DVT1} = {item.SMALLEST_QUANTITY_PER_LARGEST_UNIT} {item.DVT3}
                </td>
                <td>
                  <div className="unit-row-actions">
                    <button type="button" onClick={() => onCalculate(item.MADVT)}>
                      Tính
                    </button>
                    <button type="button" onClick={() => onEdit(item)}>
                      Sửa
                    </button>
                    <button type="button" onClick={() => onDelete(item.MADVT)}>
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UnitConversionTable
