"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AnimationType = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-in";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  as?: "div" | "section" | "article" | "span";
}

export function AnimatedSection({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  as: Component = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      className={cn(
        "opacity-0",
        isVisible && `animate-${animation}`,
        className
      )}
      style={{
        animationDelay: isVisible ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </Component>
  );
}
