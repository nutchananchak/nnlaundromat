export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) {
  const baseStyle = 'w-full py-3.5 rounded-xl font-display font-medium tracking-wide transition-all active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20 disabled:bg-ink/20 disabled:shadow-none',
    secondary: 'bg-bg text-ink hover:bg-ink/5 border border-ink/10',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}