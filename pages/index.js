import { useEffect } from "react"

import PropTypes from "prop-types"
import { motion } from "framer-motion"
import useWindowSize from "../hooks/use-window-size"
import mq from "../helpers/facepaint"

let sansFontSize = ["1.6rem", "2.5vmax"]

let Pixel = ({ children }) => {
  return (
    <span
      css={mq({
        fontFamily: "Mondwest",
        fontSize: ["1.8rem", "2.8vmax"],
      })}>
      {children}
    </span>
  )
}

Pixel.propTypes = {
  children: PropTypes.children,
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
        fontSize: sansFontSize,
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
          css={mq({ color: "#F9F7F0", display: "inline", width: ["2rem", "3vmax"] })}
        />
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
          }}>
          <h1
            css={mq({
              fontWeight: 300,
              marginTop: ["12px", "8px"],
              position: "relative",
              display: "inline-block",
              fontSize: sansFontSize,
            })}>
            Max
            <br />
            <Pixel> Murdoch</Pixel>
          </h1>
        </div>
      </header>

      <main
        css={mq({
          gridColumn: ["span 12", "5 / span 4"],
          alignSelf: "center",
          marginBottom: ["5%", "10%"],
        })}>
        <p>
          Principal Product Designer
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
        <a
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
          }}
          href="mailto:max@maxmurdo.ch">
          <p>max@maxmurdo.ch</p>
        </a>
      </footer>
    </div>
  )
}
