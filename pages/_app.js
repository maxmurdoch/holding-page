import NextApp from "next/app"
import { Global, CacheProvider, css } from "@emotion/core"
import { cache } from "emotion"

import "../styles/globals.css"

let globalStyles = css`
  * {
    font-size: 3vmax;
    line-height: 1.4;
    box-sizing: border-box;
  }

  html {
    height: -webkit-fill-available;
  }
  body {
    font-feature-settings: "ss01";
    background-color: #f9f7f0;
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
  }

  @font-face {
    font-family: "ABC";
    font-style: normal;
    font-weight: 300;
    src: url("/ABCDiatype-Light.woff") format("woff");
  }

  @font-face {
    font-family: "Mondwest";
    font-style: normal;
    font-weight: 400;
    src: url("/Mondwest-Regular.woff") format("woff");
  }
`

class MyApp extends NextApp {
  render() {
    let { Component, pageProps } = this.props

    return (
      <CacheProvider value={cache}>
        <Global styles={globalStyles} />
        <Component {...pageProps} />
      </CacheProvider>
    )
  }
}

export default MyApp
