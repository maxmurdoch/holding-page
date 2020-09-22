import Head from "next/head"
import { useEffect, useState } from "react"
import styles from "../styles/Home.module.css"
import { css } from "@emotion/core"

import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { useWindowHeight } from "@react-hook/window-size"
import mq from "../helpers/facepaint"

let Pixel = styled.span`
  font-family: Mondwest;
  font-size: 4vmax;
`

export default function Home() {
  let [fullPageHeight, setFullPageHeight] = useState(0)
  let windowHeight = useWindowHeight()
  useEffect(() => {
    if (windowHeight !== 0) {
      setFullPageHeight(windowHeight)
    }
  }, [windowHeight])

  console.log("window height", windowHeight)
  return (
    <div className={styles.container}>
      <Head>
        <title>Max Murdoch</title>
        <meta name="title" content="Max Murdoch" />
        <meta
          name="description"
          content="A tiny design & development studio in London. New site coming A/W 2020."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://maxmurdo.ch/" />
        <meta property="og:title" content="Max Murdoch" />
        <meta
          property="og:description"
          content="A tiny design & development studio in London. New site coming A/W 2020."
        />
        <meta property="og:image" content="/meta.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://maxmurdo.ch/" />
        <meta property="twitter:title" content="Max Murdoch" />
        <meta
          property="twitter:description"
          content="A tiny design & development studio in London. New site coming A/W 2020."
        />
        <meta property="twitter:image" content="/meta.png"></meta>
        <link rel="icon" href="/loading.png" />
      </Head>

      <main
        css={mq({
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          backgroundColor: "#F9F7F0",
          color: "#111",
          gridGap: 20,
          height: fullPageHeight || "100vh",
          width: "100vw",
          fontFamily: "ABC",
          fontWeight: "300",
          padding: [24, 40, 60],
        })}>
        <header css={mq({ gridColumn: ["span 2", "1 / span 3"] })}>
          <a
            css={{
              display: "flex",
              alignItems: "baseline",
              "&:hover h1:after": {
                transform: "skew(0) translateZ(0)",
              },
            }}
            href="mailto:max@maxmurdo.ch">
            <h1
              css={css`
                font-family: "Mondwest", Helvetica Neue, Helvetica, sans-serif;
                font-weight: 300;
                margin-right: 16px;
                position: relative;
                display: inline-block;
                line-height: 1;
                &:after {
                  content: " ";
                  position: absolute;
                  bottom: 0px;
                  left: 0;
                  width: 100%;
                  height: 2px;
                  background: #111;
                  opacity: 1;
                  transform-origin: center;
                  transform: skew(70deg, 4deg) translateZ(0);
                  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
              `}>
              Max
            </h1>
            <motion.img
              animate={{ rotate: 180 }}
              transition={{
                type: "spring",
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
              src="/loading.svg"
              alt="A loading icon"
              css={mq({ width: "2vmax" })}
            />
          </a>
        </header>

        <section
          css={mq({
            gridColumn: ["span 12", "5 / span 4"],
            alignSelf: "center",
            marginBottom: ["5%", "10%"],
          })}>
          <p>
            <Pixel>Tiny</Pixel>
            <br />
            design&nbsp;<Pixel>&</Pixel>&nbsp;development
            <br />
            <Pixel>studio in</Pixel> London
          </p>
        </section>

        <section css={mq({ gridColumn: ["span 12", "9 / span 4"], alignSelf: "end" })}>
          <p>
            <Pixel>New site coming</Pixel>
            <br />
            A/W 2020
          </p>
        </section>
      </main>
    </div>
  )
}
