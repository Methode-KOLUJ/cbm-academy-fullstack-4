"use client";

import { useEffect, ReactNode } from "react";
import Lenis, { LenisOptions } from "lenis";

interface ScrollSmoothProps {
  children: ReactNode;
}

export default function ScrollSmooth({ children }: ScrollSmoothProps) {
  useEffect(() => {
    const options: LenisOptions = {
      duration: 1.1,
      easing: (t: number) => t * (2 - t),
      lerp: 0.1, // contrôle de l’interpolation (plus petit = plus fluide)
    };

    const lenis = new Lenis(options);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
