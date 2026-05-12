function UnitConversionTable({ items, t, onCalculate, onDelete, onEdit }) {
  return (
    <div className="unit-table-wrap">
      <table className="unit-table">
        <thead>
          <tr>
            <th>{t.fields.MADVT}</th>
            <th>{t.fields.DVT1}</th>
            <th>{t.fields.DVT2}</th>
            <th>{t.fields.DVT3}</th>
            <th>{t.fields.QC1}</th>
            <th>{t.fields.QC2}</th>
            <th>{t.conversion}</th>
            <th>{t.actions}</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="8">{t.empty}</td>
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
                      {t.calculate}
                    </button>
                    <button type="button" onClick={() => onEdit(item)}>
                      {t.edit}
                    </button>
                    <button type="button" onClick={() => onDelete(item.MADVT)}>
                      {t.delete}
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
