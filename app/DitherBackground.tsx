"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ShaderMount } from "@paper-design/shaders-react";
import {
  DitheringTypes,
  ShaderFitOptions,
  getShaderColorFromString,
  imageDitheringFragmentShader,
} from "@paper-design/shaders";

const PHOTO_IMAGE_URL = "/images/dither-source-384.png";
const WIDE_IMAGE_URL = "/images/dither-source-wide.png";

const MOUSE_REPULSION_RADIUS = 300;
const MOUSE_REPULSION_FORCE = 72;
const MOUSE_TAIL_RADIUS = 155;
const MOUSE_TAIL_STRENGTH = 0.9;
const MOUSE_SWIRL_STRENGTH = 0.85;

const imageDitheringInteractiveFragmentShader = imageDitheringFragmentShader
  .replace(
    "uniform float u_colorSteps;",
    `uniform float u_colorSteps;
uniform vec2 u_mouse;
uniform vec2 u_mousePrev;
uniform float u_mouseRadius;
uniform float u_mouseForce;
uniform float u_tailRadius;
uniform float u_tailStrength;
uniform float u_swirlStrength;`,
  )
  .replace(
    `vec2 pxSizeUV = gl_FragCoord.xy - .5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + .5) * pxSize;
  vec2 normalizedUV = canvasPixelizedUV / u_resolution;`,
    `vec2 pxSizeUV = gl_FragCoord.xy - .5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + .5) * pxSize;

  vec2 mousePx = vec2(
    (u_mouse.x - 0.5) * u_resolution.x,
    (0.5 - u_mouse.y) * u_resolution.y
  );
  vec2 prevMousePx = vec2(
    (u_mousePrev.x - 0.5) * u_resolution.x,
    (0.5 - u_mousePrev.y) * u_resolution.y
  );
  vec2 motionVec = mousePx - prevMousePx;
  float motionLength = length(motionVec);
  vec2 motionDir = motionLength > 0.0001 ? motionVec / motionLength : vec2(0.0);

  vec2 deltaFromMouse = canvasPixelizedUV - mousePx;
  float mouseDistance = length(deltaFromMouse);
  float mouseFalloff = smoothstep(u_mouseRadius, 0.0, mouseDistance);
  float mouseCoreFalloff = pow(mouseFalloff, 1.9);
  vec2 mouseDirection = mouseDistance > 0.0001 ? deltaFromMouse / mouseDistance : vec2(0.0);
  vec2 swirlDirection = vec2(-mouseDirection.y, mouseDirection.x);

  float tailExtent = min(max(motionLength * 8.0, 0.0), u_tailRadius * 2.5);
  float alongTrail = dot(canvasPixelizedUV - mousePx, -motionDir);
  float acrossTrail = abs(dot(canvasPixelizedUV - mousePx, vec2(-motionDir.y, motionDir.x)));
  float tailStartMask = smoothstep(0.0, pxSize * 4.0, alongTrail);
  float tailEndMask = 1.0 - smoothstep(tailExtent, tailExtent + pxSize * 4.0, alongTrail);
  float tailWideMask = smoothstep(u_tailRadius, 0.0, acrossTrail);
  float tailMask = tailStartMask * tailEndMask * tailWideMask;
  tailMask *= smoothstep(0.0, 1.0, motionLength / 3.0) * u_tailStrength;

  vec2 displacedCanvasPixelizedUV = canvasPixelizedUV
    + mouseDirection * mouseCoreFalloff * u_mouseForce
    + motionDir * tailMask * (u_mouseForce * 0.45)
    + swirlDirection * mouseCoreFalloff * u_mouseForce * u_swirlStrength * 0.35;

  vec2 normalizedUV = canvasPixelizedUV / u_resolution;
  pxSizeUV = (displacedCanvasPixelizedUV - .5 * u_resolution) / pxSize;`,
  )
  .replace(
    "vec2 ditheringNoiseUV = canvasPixelizedUV;",
    "vec2 ditheringNoiseUV = displacedCanvasPixelizedUV;",
  );

type DitherLayerProps = {
  imageUrl: string;
  originX: number;
  mouse: { x: number; y: number };
  mousePrev: { x: number; y: number };
  isHovering: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

function DitherLayer({
  imageUrl,
  originX,
  mouse,
  mousePrev,
  isHovering,
  containerRef,
}: DitherLayerProps) {
  const uniforms = useMemo(
    () => ({
      u_image: imageUrl,
      u_colorFront: getShaderColorFromString("#8FC0FF"),
      u_colorBack: getShaderColorFromString("#00000000"),
      u_colorHighlight: getShaderColorFromString("#BFFBFF"),
      u_type: DitheringTypes["8x8"],
      u_pxSize: 7,
      u_colorSteps: 2,
      u_originalColors: false,
      u_inverted: false,
      u_fit: ShaderFitOptions.cover,
      u_scale: 1,
      u_rotation: 0,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: originX,
      u_originY: 0.5,
      u_worldWidth: 1,
      u_worldHeight: 1,
      u_mouse: [mouse.x, mouse.y],
      u_mousePrev: [mousePrev.x, mousePrev.y],
      u_mouseRadius: MOUSE_REPULSION_RADIUS,
      u_mouseForce: isHovering ? MOUSE_REPULSION_FORCE : 0,
      u_tailRadius: isHovering ? MOUSE_TAIL_RADIUS : 0,
      u_tailStrength: isHovering ? MOUSE_TAIL_STRENGTH : 0,
      u_swirlStrength: isHovering ? MOUSE_SWIRL_STRENGTH : 0,
    }),
    [imageUrl, originX, isHovering, mouse.x, mouse.y, mousePrev.x, mousePrev.y],
  );

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
      <ShaderMount
        fragmentShader={imageDitheringInteractiveFragmentShader}
        uniforms={uniforms}
        width="100%"
        height="100%"
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
}

type LayerMouseState = {
  mouse: { x: number; y: number };
  mousePrev: { x: number; y: number };
  isHovering: boolean;
};

function useLayerMouse(containerRef: React.RefObject<HTMLDivElement | null>): LayerMouseState {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [mousePrev, setMousePrev] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const frameRef = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const pendingMouseRef = useRef({ x: 0.5, y: 0.5 });
  const pendingMousePrevRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const schedule = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setMousePrev(pendingMousePrevRef.current);
        setMouse(pendingMouseRef.current);
      });
    };

    const handle = (event: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) {
        if (hoveringRef.current) {
          hoveringRef.current = false;
          setIsHovering(false);
        }
        return;
      }

      const normalizedX = (event.clientX - rect.left) / rect.width;
      const normalizedY = (event.clientY - rect.top) / rect.height;
      pendingMousePrevRef.current = pendingMouseRef.current;
      pendingMouseRef.current = { x: normalizedX, y: normalizedY };
      if (!hoveringRef.current) {
        hoveringRef.current = true;
        setIsHovering(true);
      }
      schedule();
    };

    window.addEventListener("pointermove", handle);
    return () => window.removeEventListener("pointermove", handle);
  }, [containerRef]);

  return { mouse, mousePrev, isHovering };
}

export function DitherBackground() {
  const wideRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const wideMouse = useLayerMouse(wideRef);
  const portraitMouse = useLayerMouse(portraitRef);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        backgroundColor: "#003BFF",
        overflow: "hidden",
      }}
    >
      <div data-dither-wide style={{ position: "absolute", inset: 0 }}>
        <DitherLayer
          imageUrl={WIDE_IMAGE_URL}
          originX={1}
          mouse={wideMouse.mouse}
          mousePrev={wideMouse.mousePrev}
          isHovering={wideMouse.isHovering}
          containerRef={wideRef}
        />
      </div>
      <div data-dither-portrait style={{ position: "absolute", inset: 0 }}>
        <DitherLayer
          imageUrl={PHOTO_IMAGE_URL}
          originX={0.5}
          mouse={portraitMouse.mouse}
          mousePrev={portraitMouse.mousePrev}
          isHovering={portraitMouse.isHovering}
          containerRef={portraitRef}
        />
      </div>
    </div>
  );
}
