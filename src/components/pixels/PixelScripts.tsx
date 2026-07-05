"use client";

import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

import type { PublicPixelConfig } from "@/lib/pixel-settings-defaults";

type PixelScriptsProps = {
  config: PublicPixelConfig;
};

function extractGoogleAdsAccountId(sendTo: string): string | null {
  const match = sendTo.match(/^(AW-\d+)/);
  return match?.[1] ?? null;
}

export function PixelScripts({ config }: PixelScriptsProps) {
  if (config.testMode) return null;

  const metaActive =
    config.activePixels.includes("meta") && Boolean(config.metaPixelId?.trim());
  const tiktokActive =
    config.activePixels.includes("tiktok") && Boolean(config.tiktokPixelId?.trim());
  const ga4Active =
    config.activePixels.includes("ga4") && Boolean(config.ga4MeasurementId?.trim());
  const googleAdsActive =
    config.activePixels.includes("google_ads") &&
    Boolean(config.googleAdsConversionId?.trim());
  const snapchatActive =
    config.activePixels.includes("snapchat") && Boolean(config.snapchatPixelId?.trim());

  const googleAdsAccountId = googleAdsActive
    ? extractGoogleAdsAccountId(config.googleAdsConversionId!)
    : null;

  const primaryGoogleId = ga4Active
    ? config.ga4MeasurementId!
    : googleAdsAccountId ?? undefined;

  const needsExtraGoogleAdsConfig =
    ga4Active && googleAdsActive && googleAdsAccountId !== null;

  return (
    <>
      {metaActive && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${config.metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${config.metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {tiktokActive && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e+"_"+o]=+new Date;ttq._o=ttq._o||{};ttq._o[e+"_"+o]=n||{};var a=d.createElement("script");a.type="text/javascript";a.async=!0;a.src=r+"?sdkid="+e+"&lib="+t;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
              ttq.load('${config.tiktokPixelId}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}

      {primaryGoogleId && <GoogleAnalytics gaId={primaryGoogleId} />}

      {needsExtraGoogleAdsConfig && (
        <Script id="google-ads-config" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('config', '${googleAdsAccountId}');`}
        </Script>
      )}

      {snapchatActive && (
        <Script id="snapchat-pixel" strategy="afterInteractive">
          {`
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');
            snaptr('init', '${config.snapchatPixelId}');
            snaptr('track', 'PAGE_VIEW');
          `}
        </Script>
      )}
    </>
  );
}
