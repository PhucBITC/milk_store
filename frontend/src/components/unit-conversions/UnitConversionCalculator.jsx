function UnitConversionCalculator({ result, t }) {
  if (!result) {
    return (
      <aside className="unit-calculator">
        <span>{t.calculatorTitle}</span>
        <p>{t.calculatorEmpty}</p>
      </aside>
    )
  }

  return (
    <aside className="unit-calculator">
      <span>{t.calculatorTitle}</span>
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
    </aside>
  )
}

export default UnitConversionCalculator
