import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, placeholder, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'flex h-9 w-full appearance-none rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 pr-8 text-sm text-zinc-100',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-zinc-950 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-150',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-zinc-900 text-zinc-500">
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
    </div>
  )
)
Select.displayName = 'Select'

export { Select }
