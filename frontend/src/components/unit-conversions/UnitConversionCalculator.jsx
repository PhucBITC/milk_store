function UnitConversionCalculator({ result }) {
  if (!result) {
    return (
      <aside className="unit-calculator">
        <span>Y NGHIA QUY DOI</span>
        <p>CHON MOT DONG VA BAM TINH DE XEM QUY DOI DON VI.</p>
      </aside>
    )
  }

  return (
    <aside className="unit-calculator">
      <span>Y NGHIA QUY DOI</span>
      <strong>
        {result.DVT1} - {result.DVT2} - {result.DVT3}
      </strong>
      <p>
        1 {result.DVT1} = {result.QC1} {result.DVT2}
      </p>
      <p>
        1 {result.DVT2} = {result.QC2} {result.DVT3}
      </p>
      <p>
        1 {result.DVT1} = {result.SMALLEST_QUANTITY_PER_LARGEST_UNIT} {result.DVT3}
      </p>
      <small>{result.DESCRIPTION}</small>
    </aside>
  )
}

export default UnitConversionCalculator
