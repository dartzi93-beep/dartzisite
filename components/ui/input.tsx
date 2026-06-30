import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100',
        'placeholder:text-zinc-500',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-zinc-950 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-colors duration-150',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
