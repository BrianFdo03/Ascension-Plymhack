import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"

// Installing class-variance-authority as it is standard with this pattern
// If not installed, I will use a simpler approach or install it. 
// For now, I'll use a simpler approach without cva to save an install if the user didn't ask for it specifically, 
// but sticking to the "shadcn-like" pattern usually implies cva. 
// I'll stick to a simple implementation first to avoid extra deps if possible, but cva is very helpful.
// Actually, I'll just use simple string concatenation or clsx for now to be safe, 
// or I can add cva. The user asked for "radix-ui/react-slot clsx tailwind-merge". 
// I will assume they might not have cva.

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:bg-primary/90", // Default styles (mimicking shadcn default)
          "h-10 px-4 py-2", // Default size
          "bg-[#2563EB] text-white shadow-lg shadow-blue-500/30", // Custom override for this app
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
