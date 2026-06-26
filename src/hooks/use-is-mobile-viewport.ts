"use client";

import { useEffect, useState } from "react";

/** `null` until the client has measured the viewport (avoids loading both hero videos). */
export function useIsMobileViewport(breakpoint = 767) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
