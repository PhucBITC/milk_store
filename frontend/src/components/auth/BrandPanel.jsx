import LanguageSwitcher from './LanguageSwitcher'

function BrandPanel({ language, t, onLanguageChange }) {
  return (
    <section className="brand-panel" aria-label={t.overviewLabel}>
      <div className="brand-topline">
        <div className="brand-identity">
          <span className="brand-mark">M</span>
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
