import { cn } from '../../lib/cn'

// Labeled input with inline error. Filled style (no visible border).
export default function TextField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  inputMode,
  error,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  placeholder?: string
  type?: string
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
  error?: string
  required?: boolean
}) {
  return (
    <label className="field">
      <span className="field__label">
        {label}
        {required && <span className="field__req">*</span>}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn('field__input', error && 'is-error')}
      />
      {error && <span className="field__error">{error}</span>}
    </label>
  )
}
