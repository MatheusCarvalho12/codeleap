import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={[
          'w-full rounded-lg border border-app-border px-3 py-2.5 text-sm outline-none',
          'focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all',
          'placeholder:text-gray-400',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  ),
)
Input.displayName = 'Input'
