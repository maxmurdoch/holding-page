import Document, { Html, Head, Main, NextScript } from "next/document"
import { GA_TRACKING_ID } from "../helpers/gtag"

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title>Max Murdoch</title>
          <meta name="title" content="Max Murdoch" />
          <meta name="description" content="A Principal Product Designer in London, England." />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://maxmurdo.ch/" />
          <meta property="og:title" content="Max Murdoch" />
          <meta
            property="og:description"
            content="A Principal Product Designer in London, England."
          />
          <meta property="og:image" content="/meta.png" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://maxmurdo.ch/" />
          <meta property="twitter:title" content="Max Murdoch" />
          <meta
            property="twitter:description"
            content="A Principal Product Designer in London, England."
          />
          <meta property="twitter:image" content="/meta.png"></meta>
          <link rel="icon" href="/loading.png" />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
