'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm',
  primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm',
  outline: 'border border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white',
  ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-800',
  destructive: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
}

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  default: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2',
  icon: 'h-9 w-9',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
        'disabled:pointer-events-none disabled:opacity-40',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = 'Button'

export { Button }
