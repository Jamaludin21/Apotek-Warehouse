"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

function capitalize(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatTitleFromPath(pathname) {
  if (!pathname || pathname === "/") return "Dashboard";
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  return capitalize(last);
}

export function useDocumentTitle(customTitle = null) {
  const pathname = usePathname();

  useEffect(() => {
    const baseTitle = "Apotek Warehouse & POS";
    const pageTitle = customTitle || formatTitleFromPath(pathname);
    document.title = `${pageTitle} | ${baseTitle}`;
  }, [pathname, customTitle]);
}

export function useHeadTitle(customTitle = null) {
  const pathname = usePathname();

  const pageTitle = useMemo(() => {
    return customTitle || formatTitleFromPath(pathname);
  }, [pathname, customTitle]);

  return pageTitle;
}
