import { translations } from '../../translations'

function LanguageSwitcher({ currentLanguage, label, onChange }) {
  return (
    <div className="language-switcher" aria-label={label}>
      {Object.keys(translations).map((languageKey) => (
        <button
          key={languageKey}
          type="button"
          className={currentLanguage === languageKey ? 'active' : ''}
          onClick={() => onChange(languageKey)}
          aria-pressed={currentLanguage === languageKey}
          title={translations[languageKey].languageName}
        >
          {languageKey.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
