import LanguageSwitcher from './LanguageSwitcher'
import BrandLogo from '../shared/BrandLogo'

function BrandPanel({ language, t, onLanguageChange }) {
  return (
    <section className="brand-panel" aria-label={t.overviewLabel}>
      <div className="brand-topline">
        <div className="brand-identity">
          <BrandLogo />
          <span>{t.brandName}</span>
        </div>

        <LanguageSwitcher
          currentLanguage={language}
          label={t.languageLabel}
          onChange={onLanguageChange}
        />
      </div>

      <div className="brand-copy">
        <p className="eyebrow">{t.brandEyebrow}</p>
        <h1>{t.brandTitle}</h1>
        <p>{t.brandDescription}</p>
      </div>

      <div className="metric-grid" aria-label={t.metricsLabel}>
        {t.metrics.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BrandPanel
