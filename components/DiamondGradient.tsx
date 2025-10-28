"use client";

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import './DiamondGradient.css';

const vertex = `
attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);} 
`;

const fragment = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uCenterColor; // purple center
uniform float uSpeed;
uniform float uBandWidth;  // controls diamond falloff
uniform float uAspectY;    // squashes vertically to make it short
uniform float uSoftness;   // blur amount for edges
uniform float uAspectX;    // stretches horizontally to make it wider
uniform vec2 uCenterOffset; // manual center offset (in normalized, relative-to-height units)

// 2D rotation
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

// Soft diamond gradient with rotation and vertical/horizontal aspect control
vec3 diamondColor(vec2 p){
  // make band short: scale Y
  p.y *= uAspectY; 
  // make band wide: scale X
  p.x *= uAspectX;

  // shift center if needed
  // apply after rotation so perceived center aligns regardless of rotation

  // rotate diamond over time
  float a = uTime * uSpeed;
  p = rot(a) * p;

  // now apply offset so the bright core can be nudged precisely
  p -= uCenterOffset;

  // diamond distance (L1)
  float d = (abs(p.x) + abs(p.y));

  // smooth falloff from center color to black
  float g = 1.0 - smoothstep(0.0, uBandWidth, d);
  return mix(vec3(0.0), uCenterColor, g);
}

// simple 5-tap blur for softness
vec3 softSample(vec2 uv){
  vec2 res = uResolution;
  vec2 p = (uv - 0.5*res) / res.y;
  vec3 c0 = diamondColor(p);
  if(uSoftness <= 0.0001) return c0;
  float r = uSoftness / res.y; // normalize by height
  vec3 c1 = diamondColor(p + vec2( r, 0.0));
  vec3 c2 = diamondColor(p + vec2(-r, 0.0));
  vec3 c3 = diamondColor(p + vec2(0.0,  r));
  vec3 c4 = diamondColor(p + vec2(0.0, -r));
  return c0*0.36 + (c1+c2+c3+c4)*0.16;
}

void main(){
  vec2 uv = gl_FragCoord.xy;
  vec3 col = softSample(uv);
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function DiamondGradient({
    hex = '#BF60DE',
    speed = 0.4,
    bandWidth = 0.45,
    aspectY = 0.2,
    aspectX = 0.1,
    softness = 8.0,
    centerOffset = { x: 0, y: 0 },
    centerOffsetPx,
}: {
    hex?: string;
    speed?: number;
    bandWidth?: number;
    aspectY?: number;
    aspectX?: number;
    softness?: number;
    centerOffset?: { x: number; y: number };
    centerOffsetPx?: { x: number; y: number };
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const parent = canvas.parentElement as HTMLElement;

        const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), canvas });
        const gl = renderer.gl;
        const geometry = new Triangle(gl);

        const toRgb = (h: string) => {
            const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)!;
            return [
                parseInt(m[1], 16) / 255,
                parseInt(m[2], 16) / 255,
                parseInt(m[3], 16) / 255,
            ];
        };
        const rgb = toRgb(hex);

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uResolution: { value: new Vec2() },
                uTime: { value: 0 },
                uCenterColor: { value: new Float32Array(rgb) },
                uSpeed: { value: speed },
                uBandWidth: { value: bandWidth },
                uAspectY: { value: aspectY },
                uSoftness: { value: softness },
                uAspectX: { value: aspectX },
                uCenterOffset: { value: new Float32Array([centerOffset.x, centerOffset.y]) },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        const resize = () => {
            const w = parent.clientWidth || 1;
            const h = parent.clientHeight || 1;
            renderer.setSize(w, h);
            program.uniforms.uResolution.value.set(w, h);
            program.uniforms.uSoftness.value = softness * (gl.drawingBufferHeight / Math.max(1.0, h));
            program.uniforms.uAspectX.value = aspectX;
            program.uniforms.uAspectY.value = aspectY;
            if (centerOffsetPx) {
                program.uniforms.uCenterOffset.value[0] = centerOffsetPx.x / Math.max(1, h);
                program.uniforms.uCenterOffset.value[1] = -centerOffsetPx.y / Math.max(1, h);
            } else {
                program.uniforms.uCenterOffset.value[0] = centerOffset.x;
                program.uniforms.uCenterOffset.value[1] = centerOffset.y;
            }
        };
        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();

        const start = performance.now();
        let raf = 0 as number | any;
        const loop = () => {
            program.uniforms.uTime.value = (performance.now() - start) * 0.001;
            renderer.render({ scene: mesh });
            raf = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [hex, speed, bandWidth, aspectY, aspectX, softness, centerOffset.x, centerOffset.y, centerOffsetPx?.x, centerOffsetPx?.y]);

    return <canvas ref={canvasRef} className="diamond-gradient-canvas" />;
}


