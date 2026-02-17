import { useState, forwardRef } from 'react'
import CurrencyInput from 'react-currency-input-field';
import Input, { type InputProps } from "@cloudscape-design/components/input";
import '@cloudscape-design/global-styles/index.css';
import './App.css'

// ── Static data ────────────────────────────────────────────────────────────────

const LOCALES = [
  { value: 'en-US', label: 'US Dollar (en-US)', currency: 'USD' },
  { value: 'en-GB', label: 'British Pound (en-GB)', currency: 'GBP' },
  { value: 'de-DE', label: 'Euro - Germany (de-DE) [. separator]', currency: 'EUR' },
  { value: 'fr-FR', label: 'Euro - France (fr-FR) [space separator]', currency: 'EUR' },
  { value: 'ja-JP', label: 'Japanese Yen (ja-JP) [no decimals]', currency: 'JPY' },
  { value: 'hi-IN', label: 'Indian Rupee (hi-IN)', currency: 'INR' },
  { value: 'pt-BR', label: 'Brazilian Real (pt-BR) [. separator]', currency: 'BRL' },
  { value: 'es-ES', label: 'Euro - Spain (es-ES) [. separator]', currency: 'EUR' },
];

const FORMAT_EXAMPLES = [
  ['en-US', '1,000,000.00 (comma thousands, period decimal)'],
  ['de-DE', '1.000.000,00 (period thousands, comma decimal)'],
  ['fr-FR', '1 000 000,00 (space thousands, comma decimal)'],
  ['ja-JP', '¥1,000,000 (no decimal places)'],
  ['hi-IN', '₹10,00,000.00 (Indian numbering system)'],
  ['pt-BR', 'R$ 1.000.000,00 (period thousands, comma decimal)'],
];

// ── Cloudscape ↔ react-currency-input-field bridge ────────────────────────────
interface CloudscapeInputBridgeProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CloudscapeCurrencyInput = forwardRef<
  InputProps.Ref,
  CloudscapeInputBridgeProps
>(({ value, onChange, ...rest }, ref) => (
  <Input
    {...rest}
    ref={ref}
    value={value}
    onChange={({ detail }) =>
      onChange({ target: { value: detail.value } } as any)
    }
  />
));

CloudscapeCurrencyInput.displayName = "CloudscapeCurrencyInput";


// ── App ────────────────────────────────────────────────────────────────────────

function App() {
  const [selectedLocale, setSelectedLocale] = useState('en-US');
  const [overrideDraft, setOverrideDraft] = useState('');
  const [appliedOverride, setAppliedOverride] = useState('');
  const [currencyValue, setCurrencyValue] = useState('1000000');

  const baseCurrency = LOCALES.find(l => l.value === selectedLocale)?.currency ?? 'USD';
  const activeOverride = appliedOverride.trim();
  const intlConfig = { locale: activeOverride || selectedLocale, currency: baseCurrency };
  const inputKey = activeOverride ? `override-${activeOverride}` : selectedLocale;

  const applyOverride = () => {
    setAppliedOverride(overrideDraft.trim());
  };

  const clearOverride = () => {
    setOverrideDraft('');
    setAppliedOverride('');
  };

  const changeLocale = (v: string) => {
    setSelectedLocale(v);
    setOverrideDraft('');
    setAppliedOverride('');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Currency Input Locale Tester</h1>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="locale-select" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Select Locale:
        </label>
        <select
          id="locale-select"
          value={selectedLocale}
          onChange={e => changeLocale(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {LOCALES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Override Locale:
        </label>
        <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666' }}>
          Type any BCP 47 tag (e.g. <code>en-ZA</code>, <code>ar-EG</code>, <code>zh-CN</code>) then press{' '}
          <strong>Apply</strong>. The currency from the selected locale is kept.
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <Input
              value={overrideDraft}
              placeholder="e.g. en-ZA"
              onChange={({ detail }) => setOverrideDraft(detail.value)}
              onKeyDown={({ detail }) => { if (detail.key === 'Enter') applyOverride(); }}
            />
          </div>
          <button onClick={applyOverride} disabled={!overrideDraft.trim()}
            style={{
              padding: '6px 16px', fontSize: '14px', borderRadius: '4px', border: '1px solid #0073bb',
              backgroundColor: '#0073bb', color: '#fff', cursor: overrideDraft.trim() ? 'pointer' : 'not-allowed',
              opacity: overrideDraft.trim() ? 1 : 0.5, whiteSpace: 'nowrap'
            }}>
            Apply
          </button>
          {activeOverride && (
            <button onClick={clearOverride}
              style={{
                padding: '6px 16px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc',
                cursor: 'pointer', whiteSpace: 'nowrap'
              }}>
              Clear
            </button>
          )}
        </div>
        {activeOverride && (
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#0073bb' }}>
            Active override: <strong>{activeOverride}</strong> with currency <strong>{baseCurrency}</strong>
          </p>
        )}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Currency Input:</label>
        <CurrencyInput
          key={inputKey}
          customInput={CloudscapeCurrencyInput}
          intlConfig={intlConfig}
          placeholder="Please enter a number"
          value={currencyValue}
          decimalsLimit={2}
          onValueChange={value => setCurrencyValue(value ?? '')}
        />
      </div>
      <div style={{ padding: '15px', borderRadius: '4px', fontSize: '14px', lineHeight: '1.6' }}>
        <strong>Format Info:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          {FORMAT_EXAMPLES.map(([locale, desc]) => (
            <li key={locale}><strong>{locale}:</strong> {desc}</li>
          ))}
        </ul>
      </div>
      <h3>CODE: <a href="https://github.com/AlejandroV01/currency-input">https://github.com/AlejandroV01/currency-input</a></h3>
    </div>
  );
}

export default App