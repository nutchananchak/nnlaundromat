export default function Input({ label, type = 'text', value, onChange, placeholder = '', error = '', name }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-body font-medium uppercase tracking-wide text-ink-muted mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border bg-bg/40 font-body text-ink placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${
          error ? 'border-red-400' : 'border-ink/10'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}