import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'danger' | 'success' | 'outline' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:opacity-90 disabled:opacity-50',
  danger: 'bg-danger text-white hover:opacity-90 disabled:opacity-50',
  success: 'bg-success text-white hover:opacity-90 disabled:opacity-50',
  outline: 'border border-app-border text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50',
  ghost: 'text-muted hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', fullWidth, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={[
        'inline-flex items-center justify-center rounded-lg px-6 py-2 font-semibold text-sm transition-all min-h-[44px]',
        'active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
