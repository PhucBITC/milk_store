import logoUrl from '../../assets/logo.svg'

function BrandLogo({ className = '' }) {
  return (
    <img
      className={`brand-logo ${className}`.trim()}
      src={logoUrl}
      alt="ME XIU"
    />
  )
}

export default BrandLogo
