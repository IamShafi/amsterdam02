import { ReactNode } from "react";
import { useLazyLoad } from "@/hooks/useLazyLoad";
import { Skeleton } from "../components/ui/skeleton";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
}

export function LazySection({
  children,
  fallback,
  rootMargin = "100px",
  className,
}: LazySectionProps) {
  const { ref, isVisible } = useLazyLoad({
    rootMargin,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback || <Skeleton className="w-full h-64" />}
    </div>
  );
}

