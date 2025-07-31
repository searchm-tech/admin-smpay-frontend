import Script from "next/script";
import { Noto_Sans_KR } from "next/font/google";

import QueryProvider from "@/lib/providers/QueryProvider";
import { SessionProvider } from "@/lib/providers/SessionProvider";

import "./globals.css";
import "antd/dist/reset.css"; // antd 리셋 css

import type { Metadata } from "next";

const url =
  process.env.NODE_ENV === "production"
    ? process.env.NEXTAUTH_URL
    : "http://localhost:8081";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(url || "https://smpay.co.kr"),
  title:
    "SM Pay - 광고 효율은 높이고, 결제 부담은 낮춘 새로운 광고비 결제 방식",
  description:
    "부담스러운 광고비, SM Pay가 미리 결제해드립니다. 광고비를 선결제해주는 광고비 최적화 솔루션으로, 광고 효율 기반의 자동 상환 시스템을 통해 유연한 광고 운영을 지원합니다.",
  keywords:
    "SM Pay, 광고비 결제, 광고비 선결제, 광고비 최적화, 광고 운영, 자동 상환",
  openGraph: {
    title:
      "SM Pay - 광고 효율은 높이고, 결제 부담은 낮춘 새로운 광고비 결제 방식",
    description:
      "부담스러운 광고비, SM Pay가 미리 결제해드립니다. 광고비를 선결제해주는 광고비 최적화 솔루션으로, 광고 효율 기반의 자동 상환 시스템을 통해 유연한 광고 운영을 지원합니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "SM Pay",
    url,
    images: [
      {
        url: `${url}/images/og-image.png`, // 절대 URL로 변경
        width: 1200,
        height: 630,
        alt: "SM Pay - 광고비 결제 솔루션",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "SM Pay - 광고 효율은 높이고, 결제 부담은 낮춘 새로운 광고비 결제 방식",
    description:
      "부담스러운 광고비, SM Pay가 미리 결제해드립니다. 광고비를 선결제해주는 광고비 최적화 솔루션으로, 광고 효율 기반의 자동 상환 시스템을 통해 유연한 광고 운영을 지원합니다.",
    images: [`${url}/images/og-image.png`], // 절대 URL로 변경
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          id="channel-plugin"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              var w = window;
              if (w.ChannelIO) {
                return w.console && w.console.error && w.console.error('ChannelIO script included twice.');
              }
              var ch = function() {
                ch.c(arguments);
              };
              ch.q = [];
              ch.c = function(args) {
                ch.q.push(args);
              };
              w.ChannelIO = ch;
              function l() {
                if (w.ChannelIOInitialized) {
                  return;
                }
                w.ChannelIOInitialized = true;
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
                var x = document.getElementsByTagName('script')[0];
                if (x.parentNode) {
                  x.parentNode.insertBefore(s, x);
                }
              }
              if (document.readyState === 'complete') {
                l();
              } else {
                w.addEventListener('DOMContentLoaded', l);
                w.addEventListener('load', l);
              }
            })();
          `,
          }}
        />
      </head>
      <body className={notoSansKr.className}>
        <SessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
