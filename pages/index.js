import { useEffect } from "react"

import { motion } from "framer-motion"
import useWindowSize from "../hooks/use-window-size"
import mq from "../helpers/facepaint"

let Pixel = ({ children, ...props }) => {
  return (
    <span
      css={mq({
        fontFamily: "Mondwest",
        fontSize: ["1.8rem", "3.6vmax"],
      })}>
      {children}
    </span>
  )
}

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
        color: "#F9F7F0",
        backgroundColor: "#000",
        gridGap: 20,
        height: "-webkit-fill-available",
        overflow: "hidden",
        width: "100vw",
        fontSize: ["1.6rem", "3vmax"],
        lineHeight: [1.4, 1.2],
        fontWeight: "300",
        padding: [24, 40, 60],
      })}
      style={{
        height: "100vh",
      }}>
      <header css={mq({ gridColumn: ["span 2", "1 / span 3"] })}>
        <motion.img
          src="/wave.svg"
          alt="A user icon"
          animate={{ rotate: 20 }}
          transition={{
            yoyo: Infinity,
            from: 0,
            duration: 0.3,
            ease: "easeInOut",
            type: "tween",
          }}
          css={mq({ color: "#F9F7F0", display: "inline", width: "2vmax" })}
        />
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
          <h1
            css={{
              fontWeight: 300,
              marginTop: ["12px", "8px"],
              position: "relative",
              display: "inline-block",
              fontSize: ["1.6rem", "3vmax"],
            }}>
            Max
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
          Product Design Lead
          <br />
          @&nbsp;
          <Pixel>
            <a
              css={{
                borderBottom: `2px solid #eee`,
              }}
              href="https://unmind.com">
              Unmind
            </a>
          </Pixel>
        </p>
      </main>

      <footer css={mq({ gridColumn: ["span 12", "9 / span 4"], alignSelf: "end" })}>
        <p>max@maxmurdo.ch</p>
      </footer>
    </div>
  )
}
