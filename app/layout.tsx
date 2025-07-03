import { Noto_Sans_KR } from "next/font/google";

import QueryProvider from "@/lib/providers/QueryProvider";
import { SessionProvider } from "@/lib/providers/SessionProvider";
import Layout from "@/components/layout/Layout";

import "./globals.css";
import "antd/dist/reset.css"; // antd 리셋 css

import type { Metadata } from "next";
import Script from "next/script";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SM Pay",
  description: "SM Pay Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script id="channel-talk-loader" strategy="afterInteractive">
          {`
            (function(){var w=window;if(w.ChannelIO){return w.console.error("ChannelIO script included twice.");}var ch=function(){ch.c(arguments);};ch.q=[];ch.c=function(args){ch.q.push(args);};w.ChannelIO=ch;function l(){if(w.ChannelIOInitialized){return;}w.ChannelIOInitialized=true;var s=document.createElement("script");s.type="text/javascript";s.async=true;s.src="https://cdn.channel.io/plugin/ch-plugin-web.js";var x=document.getElementsByTagName("script")[0];if(x.parentNode){x.parentNode.insertBefore(s,x);}}if(document.readyState==="complete"){l();}else{w.addEventListener("DOMContentLoaded",l);w.addEventListener("load",l);}})();
          `}
        </Script>
      </head>
      <body className={notoSansKr.className}>
        <SessionProvider>
          <QueryProvider>
            <Layout>{children}</Layout>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
