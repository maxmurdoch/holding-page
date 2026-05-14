"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ShaderMount } from "@paper-design/shaders-react";
import {
  DitheringTypes,
  ShaderFitOptions,
  getShaderColorFromString,
  imageDitheringFragmentShader,
} from "@paper-design/shaders";

const DITHER_IMAGE_URL =
  "https://app.paper.design/file-assets/01KRM7V7Y8VM0560CA6NXHRCJP/01KRM7ZWTDTEEYQ8ZDQ5JJ0V1Q.png";

const MOUSE_REPULSION_RADIUS = 235;
const MOUSE_REPULSION_FORCE = 62;
const MOUSE_TAIL_RADIUS = 155;
const MOUSE_TAIL_STRENGTH = 0.9;
const MOUSE_REVEAL_STRENGTH = 0.9;
const MOUSE_INVERT_STRENGTH = 0.7;
const REVEAL_PIXEL_SIZE = 3;

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
uniform float u_revealStrength;
uniform float u_invertStrength;
uniform float u_revealPixelSize;`,
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
  vec2 mouseDirection = mouseDistance > 0.0001 ? deltaFromMouse / mouseDistance : vec2(0.0);

  float tailExtent = min(max(motionLength * 8.0, 0.0), u_tailRadius * 2.5);
  float alongTrail = dot(canvasPixelizedUV - mousePx, -motionDir);
  float acrossTrail = abs(dot(canvasPixelizedUV - mousePx, vec2(-motionDir.y, motionDir.x)));
  float tailStartMask = smoothstep(0.0, pxSize * 4.0, alongTrail);
  float tailEndMask = 1.0 - smoothstep(tailExtent, tailExtent + pxSize * 4.0, alongTrail);
  float tailWideMask = smoothstep(u_tailRadius, 0.0, acrossTrail);
  float tailMask = tailStartMask * tailEndMask * tailWideMask;
  tailMask *= smoothstep(0.0, 1.0, motionLength / 3.0) * u_tailStrength;

  vec2 displacedCanvasPixelizedUV = canvasPixelizedUV
    + mouseDirection * mouseFalloff * u_mouseForce
    + motionDir * tailMask * (u_mouseForce * 0.45);

  float revealMask = clamp(
    mouseFalloff * u_revealStrength + tailMask * (u_revealStrength * 0.6),
    0.0,
    1.0
  );
  float invertMask = clamp(
    smoothstep(u_mouseRadius * 0.85, 0.0, mouseDistance) * u_invertStrength
      + tailMask * (u_invertStrength * 0.45),
    0.0,
    1.0
  );

  vec2 normalizedUV = canvasPixelizedUV / u_resolution;
  pxSizeUV = (displacedCanvasPixelizedUV - .5 * u_resolution) / pxSize;`,
  )
  .replace(
    "vec4 image = texture(u_image, imageUV);",
    `float revealPx = max(1.0, u_revealPixelSize * u_pixelRatio);
  vec2 revealCanvasPixelizedUV = (floor(canvasPixelizedUV / revealPx) + 0.5) * revealPx;
  vec2 revealNormalizedUV = revealCanvasPixelizedUV / u_resolution;
  vec2 revealImageUV = getImageUV(revealNormalizedUV);
  vec4 image = texture(u_image, imageUV);
  vec4 revealImage = texture(u_image, revealImageUV);`,
  )
  .replace(
    `float lum = dot(vec3(.2126, .7152, .0722), image.rgb);
  lum = u_inverted ? (1. - lum) : lum;`,
    `float lum = dot(vec3(.2126, .7152, .0722), image.rgb);
  lum = u_inverted ? (1. - lum) : lum;
  lum = mix(lum, 1.0 - lum, invertMask);`,
  )
  .replace(
    "fragColor = vec4(color, opacity);",
    `color = mix(color, revealImage.rgb, revealMask);
  opacity = max(opacity, revealImage.a * revealMask);
  fragColor = vec4(color, opacity);`,
  )
  .replace(
    "vec2 ditheringNoiseUV = canvasPixelizedUV;",
    "vec2 ditheringNoiseUV = displacedCanvasPixelizedUV;",
  );

export function DitherBackground() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [mousePrev, setMousePrev] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const frameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  const scheduleMouseUpdate = () => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setMousePrev(pendingMousePrevRef.current);
      setMouse(pendingMouseRef.current);
    });
  };

  useEffect(() => {
    const handleWindowPointerMove = (event: PointerEvent) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

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
      scheduleMouseUpdate();
    };

    window.addEventListener("pointermove", handleWindowPointerMove);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
    };
  }, []);

  const uniforms = useMemo(
    () => ({
      u_image: DITHER_IMAGE_URL,
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
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 1,
      u_worldHeight: 1,
      u_mouse: [mouse.x, mouse.y],
      u_mousePrev: [mousePrev.x, mousePrev.y],
      u_mouseRadius: MOUSE_REPULSION_RADIUS,
      u_mouseForce: isHovering ? MOUSE_REPULSION_FORCE : 0,
      u_tailRadius: isHovering ? MOUSE_TAIL_RADIUS : 0,
      u_tailStrength: isHovering ? MOUSE_TAIL_STRENGTH : 0,
      u_revealStrength: isHovering ? MOUSE_REVEAL_STRENGTH : 0,
      u_invertStrength: isHovering ? MOUSE_INVERT_STRENGTH : 0,
      u_revealPixelSize: REVEAL_PIXEL_SIZE,
    }),
    [isHovering, mouse.x, mouse.y, mousePrev.x, mousePrev.y],
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <ShaderMount
        fragmentShader={imageDitheringInteractiveFragmentShader}
        uniforms={uniforms}
        width="100%"
        height="100%"
        style={{
          backgroundColor: "#003BFF",
        }}
      />
    </div>
  );
}
