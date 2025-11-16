import { useEffect } from "react";

export function useDynamicVH() {
  useEffect(() => {
    let rafId: number | null = null;

    const setVH = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const height = (window.visualViewport?.height ?? window.innerHeight) * 0.01;
        document.documentElement.style.setProperty("--vh", `${height}px`);
        rafId = null;
      });
    };

    setVH();

    const target = window.visualViewport ?? window;
    target.addEventListener("resize", setVH);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      target.removeEventListener("resize", setVH);
    };
  }, []);
}

