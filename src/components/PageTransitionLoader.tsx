"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { PageLoader } from "@/components/PageLoader";

const MIN_VISIBLE_MS = 280;

function isInternalNavigation(href: string, pathname: string) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin && url.pathname !== pathname;
  } catch {
    return false;
  }
}

export function PageTransitionLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const show = () => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    shownAtRef.current = Date.now();
    setVisible(true);
  };

  const hide = () => {
    const shownAt = shownAtRef.current;
    if (shownAt === null) {
      setVisible(false);
      return;
    }

    const elapsed = Date.now() - shownAt;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    hideTimerRef.current = window.setTimeout(() => {
      shownAtRef.current = null;
      hideTimerRef.current = null;
      setVisible(false);
    }, remaining);
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank") return;

      const href = anchor.getAttribute("href");
      if (!href || !isInternalNavigation(href, pathname)) return;

      show();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  useEffect(() => {
    hide();

    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, [pathname]);

  if (!visible) return null;

  return <PageLoader />;
}
