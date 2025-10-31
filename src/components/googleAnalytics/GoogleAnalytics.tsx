"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

export const GoogleAnalytics = () => {
  const pathname = usePathname();
  const gaMeasurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag || !gaMeasurementId) return;

    window.gtag("config", gaMeasurementId, {
      page_path: pathname,
    });
  }, [pathname, gaMeasurementId]);

  if (!gaMeasurementId) {
    console.warn("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID is not set. Analytics will not be loaded.");
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};
