import { type TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        rows={4}
        className={[
          'w-full rounded-lg border border-app-border px-3 py-2 text-sm outline-none focus:border-primary transition-colors placeholder:text-gray-400 resize-none',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  ),
)
Textarea.displayName = 'Textarea'
