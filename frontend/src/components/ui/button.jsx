import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-white text-black hover:bg-zinc-200 transition-colors font-medium",
                destructive:
                    "bg-danger text-white hover:bg-danger/90",
                outline:
                    "border border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/40 transition-all font-medium",
                secondary:
                    "bg-bg-secondary text-white hover:bg-bg-secondary/80",
                ghost: "hover:bg-bg-card hover:text-white",
                link: "text-accent-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-8 py-2",
                sm: "h-9 rounded-md px-4",
                lg: "h-11 rounded-md px-10",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        (<Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props} />)
    );
})
Button.displayName = "Button"

export { Button, buttonVariants }
