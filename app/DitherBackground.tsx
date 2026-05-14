"use client";

import { ImageDithering } from "@paper-design/shaders-react";

const DITHER_IMAGE_URL =
  "https://app.paper.design/file-assets/01KRM7V7Y8VM0560CA6NXHRCJP/01KRM7ZWTDTEEYQ8ZDQ5JJ0V1Q.png";

export function DitherBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <ImageDithering
        originalColors={false}
        inverted={false}
        type="8x8"
        size={4.9}
        colorSteps={2}
        scale={1}
        fit="cover"
        image={DITHER_IMAGE_URL}
        colorBack="#00000000"
        colorFront="#8FC0FF"
        colorHighlight="#BFFBFF"
        style={{
          backgroundColor: "#003BFF",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
