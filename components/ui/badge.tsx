import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./badge.module.css";

type BadgeVariant = "neutral" | "accent" | "success" | "warning";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  children,
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(styles.badge, styles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
