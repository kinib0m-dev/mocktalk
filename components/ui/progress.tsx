"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max = 100, ...props }, ref) => {
  // Ensure max is never less than 1
  const safeMax = Math.max(max || 100, 1);
  // Calculate percentage safely
  const percentage =
    value != null ? Math.min(100, Math.max(0, (value / safeMax) * 100)) : 0;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/10",
        className
      )}
      style={{
        // Fix for Safari causing text overflow issues
        transform: "translateZ(0)",
      }}
      max={safeMax}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
