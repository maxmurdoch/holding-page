import Head from "next/head"
import { useEffect } from "react"
import { css } from "@emotion/core"

import styled from "@emotion/styled"
import { motion } from "framer-motion"
import useWindowSize from "../hooks/use-window-size"
import mq from "../helpers/facepaint"

let Pixel = styled.span`
  font-family: Mondwest;
  font-size: 3.5vmax;
`

export default function Home() {
  let { height } = useWindowSize()

  useEffect(() => {
    if (height) {
      let vh = height * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }
  }, [height])

  return (
    <div
      css={mq({
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        backgroundColor: "#F9F7F0",
        color: "#111",
        gridGap: 20,
        height: "-webkit-fill-available",
        overflow: "hidden",
        width: "100vw",
        lineHeight: [1.4, 1.2],
        fontWeight: "300",
        padding: [24, 40, 60],
      })}
      style={{
        height: "100vh",
      }}>
      <header css={mq({ gridColumn: ["span 2", "1 / span 3"] })}>
        <a
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
            "&:hover h1:after": {
              transform: "translateY(2px) scaleY(1) translateZ(0)",
            },
          }}
          href="mailto:max@maxmurdo.ch">
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
          <h1
            css={{
              fontWeight: 300,
              marginTop: ["12px", "8px"],
              position: "relative",
              display: "inline-block",
              // "&:after": {
              //   content: "''",
              //   position: "absolute",
              //   bottom: 0,
              //   left: 0,
              //   width: "100%",
              //   height: "2px",
              //   background: "#111",
              //   opacity: 1,
              //   transformOrigin: "center",
              //   transform: "translateY(0) scaleY(0.5) translateZ(0)",
              //   transition: "transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)",
              // },
            }}>
            Max (@)
            <br />
            <Pixel> Murdoch</Pixel>
          </h1>
        </a>
      </header>

      <main
        css={mq({
          gridColumn: ["span 12", "5 / span 4"],
          alignSelf: "center",
          marginBottom: ["5%", "10%"],
        })}>
        <p>
          <Pixel>Tiny</Pixel>
          <br />
          design&nbsp;<Pixel>&</Pixel>&nbsp;dev
          <br />
          <Pixel>studio in</Pixel> London
        </p>
      </main>

      <footer css={mq({ gridColumn: ["span 12", "9 / span 4"], alignSelf: "end" })}>
        <p>
          <Pixel>
            New site
            <br />
            coming
          </Pixel>{" "}
          A/W 2020
        </p>
      </footer>
    </div>
  )
}
