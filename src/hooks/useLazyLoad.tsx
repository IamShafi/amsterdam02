'use client';

import { useEffect, useRef, useState } from "react";

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function useLazyLoad(options: UseLazyLoadOptions = {}) {
  const {
    rootMargin = "100px", // Start loading 100px before element is visible
    threshold = 0.1,
    triggerOnce = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || (triggerOnce && hasTriggered)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              setHasTriggered(true);
              observer.disconnect();
            }
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, triggerOnce, hasTriggered]);

  return { ref, isVisible };
}

