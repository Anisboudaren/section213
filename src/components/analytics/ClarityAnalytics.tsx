"use client";

import Clarity from "@microsoft/clarity";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const EXCLUDED_PATH_PREFIXES = ["/admin", "/login"];

function isExcludedPath(pathname: string) {
  return EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

type ClarityAnalyticsProps = {
  disabled?: boolean;
};

export function ClarityAnalytics({ disabled = false }: ClarityAnalyticsProps) {
  const pathname = usePathname();
  const initialized = useRef(false);
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();

  useEffect(() => {
    if (disabled || !projectId || isExcludedPath(pathname) || initialized.current) return;

    Clarity.init(projectId);
    initialized.current = true;
  }, [disabled, pathname, projectId]);

  return null;
}
