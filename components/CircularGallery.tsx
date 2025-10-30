"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';
import './CircularGallery.css';

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: any;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    } as T;
}

function lerp(p1: number, p2: number, t: number) {
    return p1 + (p2 - p1) * t;
}

function autoBind(instance: any) {
    const proto = Object.getPrototypeOf(instance);
    Object.getOwnPropertyNames(proto).forEach(key => {
        if (key !== 'constructor' && typeof instance[key] === 'function') {
            instance[key] = instance[key].bind(instance);
        }
    });
}

function createTextTexture(gl: any, text: string, font = 'bold 30px monospace', color = 'black') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = font;
    const metrics = context.measureText(text);
    const textWidth = Math.ceil(metrics.width);
    const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
    canvas.width = textWidth + 20;
    canvas.height = textHeight + 20;
    context.font = font;
    context.fillStyle = color;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new Texture(gl, { generateMipmaps: false });
    texture.image = canvas as any;
    return { texture, width: canvas.width, height: canvas.height };
}

class Title {
    gl: any;
    plane: any;
    renderer: any;
    text: string;
    textColor: string;
    font: string;
    mesh: any;
    constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }: any) {
        autoBind(this);
        this.gl = gl;
        this.plane = plane;
        this.renderer = renderer;
        this.text = text;
        this.textColor = textColor;
        this.font = font;
        this.createMesh();
    }
    createMesh() {
        const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
        const geometry = new Plane(this.gl);
        const program = new Program(this.gl, {
            vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
            uniforms: { tMap: { value: texture } },
            transparent: true
        });
        this.mesh = new Mesh(this.gl, { geometry, program });
        const aspect = width / height;
        const textHeight = this.plane.scale.y * 0.15;
        const textWidth = textHeight * aspect;
        this.mesh.scale.set(textWidth, textHeight, 1);
        this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
        this.mesh.setParent(this.plane);
    }
}

class Media {
    extra = 0;
    geometry: any; gl: any; image: string; index: number; length: number; renderer: any; scene: any; screen: any; text: string; href?: string; viewport: any; bend: number; textColor: string; borderRadius: number; font: string;
    program!: any; plane!: any; title!: any; scale!: number; padding!: number; width!: number; widthTotal!: number; x!: number; speed!: number; isBefore!: boolean; isAfter!: boolean;
    baseScaleX!: number; baseScaleY!: number; currentScale!: number; targetScale!: number; activeScale!: number;
    constructor({ geometry, gl, image, index, length, renderer, scene, screen, text, href, viewport, bend, textColor, borderRadius = 0, font, activeScale = 1.15 }: any) {
        this.geometry = geometry;
        this.gl = gl;
        this.image = image;
        this.index = index;
        this.length = length;
        this.renderer = renderer;
        this.scene = scene;
        this.screen = screen;
        this.text = text;
        this.href = href;
        this.viewport = viewport;
        this.bend = bend;
        this.textColor = textColor;
        this.borderRadius = borderRadius;
        this.font = font;
        this.activeScale = activeScale;
        this.currentScale = 1;
        this.targetScale = 1;
        this.createShader();
        this.createMesh();
        this.createTitle();
        this.onResize({});
    }
    createShader() {
        const texture = new Texture(this.gl, { generateMipmaps: true });
        this.program = new Program(this.gl, {
            depthTest: false,
            depthWrite: false,
            vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
            uniforms: {
                tMap: { value: texture },
                uPlaneSizes: { value: [0, 0] },
                uImageSizes: { value: [0, 0] },
                uBorderRadius: { value: this.borderRadius }
            },
            transparent: true
        });
        const img = new Image();
        ; (img as any).crossOrigin = 'anonymous';
        img.src = this.image;
        img.onload = () => {
            texture.image = img as any;
            this.program.uniforms.uImageSizes.value = [img.naturalWidth, (img as any).naturalHeight];
        };
    }
    createMesh() {
        this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
        this.plane.setParent(this.scene);
    }
    createTitle() {
        this.title = new Title({
            gl: this.gl,
            plane: this.plane,
            renderer: this.renderer,
            text: this.text,
            textColor: this.textColor,
            font: this.font
        });
    }
    update(scroll: any, direction: 'left' | 'right') {
        this.plane.position.x = this.x - scroll.current - this.extra;
        const x = this.plane.position.x;
        const H = this.viewport.width / 2;
        if (this.bend === 0) {
            this.plane.position.y = 0;
            this.plane.rotation.z = 0;
        } else {
            const B_abs = Math.abs(this.bend);
            const R = (H * H + B_abs * B_abs) / (2 * B_abs);
            const effectiveX = Math.min(Math.abs(x), H);
            const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
            if (this.bend > 0) {
                this.plane.position.y = -arc;
                this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
            } else {
                this.plane.position.y = arc;
                this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
            }
        }
        // Smooth scale based on proximity to center
        const proximity = Math.max(0, Math.min(1, 1 - Math.abs(this.plane.position.x) / (this.baseScaleX || this.plane.scale.x)));
        const desired = 1 + (this.activeScale - 1) * (proximity * proximity);
        this.targetScale = desired;
        // lerp towards target scale (slightly faster for clearer effect)
        this.currentScale = lerp(this.currentScale, this.targetScale, 0.25);
        const sx = (this.baseScaleX || this.plane.scale.x) * this.currentScale;
        const sy = (this.baseScaleY || this.plane.scale.y) * this.currentScale;
        this.plane.scale.x = sx;
        this.plane.scale.y = sy;
        if (this.plane.program.uniforms.uPlaneSizes) {
            this.plane.program.uniforms.uPlaneSizes.value = [sx, sy];
        }
        this.speed = scroll.current - scroll.last;
        const planeOffset = this.plane.scale.x / 2;
        const viewportOffset = this.viewport.width / 2;
        this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
        this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
        if (direction === 'right' && this.isBefore) {
            this.extra -= this.widthTotal;
            this.isBefore = this.isAfter = false as any;
        }
        if (direction === 'left' && this.isAfter) {
            this.extra += this.widthTotal;
            this.isBefore = this.isAfter = false as any;
        }
    }
    onResize({ screen, viewport }: any = {}) {
        if (screen) this.screen = screen;
        if (viewport) {
            this.viewport = viewport;
            if (this.plane.program.uniforms.uViewportSizes) {
                this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
            }
        }
        this.scale = this.screen.height / 1500;
        this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
        this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
        this.baseScaleX = this.plane.scale.x;
        this.baseScaleY = this.plane.scale.y;
        this.currentScale = 1;
        this.targetScale = 1;
        this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
        this.padding = 2;
        this.width = this.plane.scale.x + this.padding;
        this.widthTotal = this.width * this.length;
        this.x = this.width * this.index;
    }
}

class App {
    container!: HTMLElement; renderer!: any; gl!: any; camera!: any; scene!: any; planeGeometry!: any; mediasImages!: any[]; medias!: any[]; screen!: any; viewport!: any; scroll!: any; onCheckDebounce!: any; raf: number | undefined; isDown!: boolean; start!: number; lastPointerX!: number; scrollSpeed!: number; didDrag!: boolean; suppressClick!: boolean;
    boundOnResize!: () => void; boundOnWheel!: (e: any) => void; boundOnPointerDown!: (e: any) => void; boundOnPointerMove!: (e: any) => void; boundOnPointerUp!: (e: any) => void; boundOnClick!: (e: any) => void;
    constructor(container: HTMLElement, { items, bend, textColor = '#ffffff', borderRadius = 0, font = 'bold 30px Figtree', scrollSpeed = 2, scrollEase = 0.05, activeScale = 1.15 }: any = {}) {
        document.documentElement.classList.remove('no-js');
        this.container = container;
        this.scrollSpeed = scrollSpeed;
        this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
        this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.onResize();
        this.createGeometry();
        this.createMedias(items, bend, textColor, borderRadius, font, activeScale);
        this.update();
        this.addEventListeners();
    }
    createRenderer() {
        this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min((window.devicePixelRatio || 1), 2) });
        this.gl = this.renderer.gl;
        this.gl.clearColor(0, 0, 0, 0);
        this.container.appendChild(this.gl.canvas);
    }
    createCamera() { this.camera = new Camera(this.gl); this.camera.fov = 45; this.camera.position.z = 20; }
    createScene() { this.scene = new Transform(); }
    createGeometry() { this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 }); }
    createMedias(items: any[], bend = 1, textColor: string, borderRadius: number, font: string, activeScale: number) {
        const defaultItems = [
            { image: `https://picsum.photos/seed/1/800/600?grayscale`, text: 'Bridge' },
            { image: `https://picsum.photos/seed/2/800/600?grayscale`, text: 'Desk Setup' },
            { image: `https://picsum.photos/seed/3/800/600?grayscale`, text: 'Waterfall' },
            { image: `https://picsum.photos/seed/4/800/600?grayscale`, text: 'Strawberries' },
            { image: `https://picsum.photos/seed/5/800/600?grayscale`, text: 'Deep Diving' },
            { image: `https://picsum.photos/seed/16/800/600?grayscale`, text: 'Train Track' },
            { image: `https://picsum.photos/seed/17/800/600?grayscale`, text: 'Santorini' },
            { image: `https://picsum.photos/seed/8/800/600?grayscale`, text: 'Blurry Lights' },
            { image: `https://picsum.photos/seed/9/800/600?grayscale`, text: 'New York' },
            { image: `https://picsum.photos/seed/10/800/600?grayscale`, text: 'Good Boy' },
            { image: `https://picsum.photos/seed/21/800/600?grayscale`, text: 'Coastline' },
            { image: `https://picsum.photos/seed/12/800/600?grayscale`, text: 'Palm Trees' }
        ];
        const normalized = (items && items.length ? items : defaultItems).map((it: any) => ({ image: it.image || it.src, text: it.text || it.title, href: it.href }));
        this.mediasImages = normalized.concat(normalized);
        this.medias = this.mediasImages.map((data: any, index: number) => new Media({
            geometry: this.planeGeometry,
            gl: this.gl,
            image: data.image,
            index,
            length: this.mediasImages.length,
            renderer: this.renderer,
            scene: this.scene,
            screen: this.screen,
            text: data.text,
            href: data.href,
            viewport: this.viewport,
            bend,
            textColor,
            borderRadius,
            font,
            activeScale
        }));
    }
    onPointerDown(e: PointerEvent) {
        this.isDown = true; this.didDrag = false; this.suppressClick = false; (this as any).scroll.position = this.scroll.current; this.start = e.clientX; this.lastPointerX = this.start; try { (e.target as Element).setPointerCapture?.(e.pointerId); } catch { }
    }
    onPointerMove(e: PointerEvent) { if (!this.isDown) return; const x = e.clientX; this.lastPointerX = x; const deltaPx = Math.abs(this.start - x); if (deltaPx > 6) this.didDrag = true; const distance = (this.start - x) * (this.scrollSpeed * 0.025); this.scroll.target = this.scroll.position + distance; }
    onPointerUp(e: PointerEvent) {
        if (!this.isDown) return;
        this.isDown = false;
        const dragDistance = Math.abs(this.start - this.lastPointerX);
        if (dragDistance < 6) {
            const target = this.getCenteredMedia();
            if (target && target.href) { this.suppressClick = true; window.location.href = target.href; return; }
        } else {
            this.suppressClick = true; // prevent subsequent click after a drag
        }
        this.onCheck();
    }
    onClick(e: any) {
        if (this.suppressClick) { this.suppressClick = false; return; }
        const target = this.getCenteredMedia();
        if (target && target.href) { e.preventDefault(); window.location.href = target.href; }
    }
    getCenteredMedia() {
        if (!this.medias || !this.medias.length) return null;
        let best: any = null; let bestAbs = Infinity;
        for (const m of this.medias) {
            const ax = Math.abs(m.plane.position.x);
            if (ax < bestAbs) { bestAbs = ax; best = m; }
        }
        return best;
    }
    getMediaAtClientX(clientX: number) {
        if (!this.medias || !this.medias.length) return null;
        const rect = this.container.getBoundingClientRect();
        const relX = clientX - rect.left;
        const worldX = ((relX / rect.width) - 0.5) * this.viewport.width;
        let best: any = null; let bestAbs = Infinity;
        for (const m of this.medias) {
            const dx = Math.abs(m.plane.position.x - worldX);
            if (dx < bestAbs) { bestAbs = dx; best = m; }
        }
        return best;
    }
    onWheel(e: any) { const delta = e.deltaY || e.wheelDelta || e.detail; this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2; this.onCheckDebounce(); }
    onCheck() {
        if (!this.medias || !this.medias[0]) return;
        const width = this.medias[0].width;
        const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
        const item = width * itemIndex;
        this.scroll.target = this.scroll.target < 0 ? -item : item;
    }
    onResize() {
        this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
        this.renderer.setSize(this.screen.width, this.screen.height);
        this.camera.perspective({ aspect: this.screen.width / this.screen.height });
        const fov = (this.camera.fov * Math.PI) / 180;
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
        const width = height * this.camera.aspect;
        this.viewport = { width, height };
        if (this.medias) this.medias.forEach((media: any) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
    update() {
        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
        const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
        if (this.medias) this.medias.forEach((media: any) => media.update(this.scroll, direction));
        this.renderer.render({ scene: this.scene, camera: this.camera });
        this.scroll.last = this.scroll.current;
        this.raf = window.requestAnimationFrame(this.update.bind(this));
    }
    addEventListeners() {
        this.boundOnResize = this.onResize.bind(this);
        this.boundOnWheel = this.onWheel.bind(this);
        this.boundOnPointerDown = this.onPointerDown.bind(this);
        this.boundOnPointerMove = this.onPointerMove.bind(this);
        this.boundOnPointerUp = this.onPointerUp.bind(this);
        this.boundOnClick = this.onClick.bind(this);
        window.addEventListener('resize', this.boundOnResize);
        window.addEventListener('mousewheel', this.boundOnWheel as any);
        window.addEventListener('wheel', this.boundOnWheel as any);
        this.container.addEventListener('pointerdown', this.boundOnPointerDown as any);
        this.container.addEventListener('pointermove', this.boundOnPointerMove as any);
        this.container.addEventListener('pointerup', this.boundOnPointerUp as any);
        this.container.addEventListener('pointercancel', this.boundOnPointerUp as any);
        this.container.addEventListener('click', this.boundOnClick as any);
    }
    destroy() {
        if (this.raf) window.cancelAnimationFrame(this.raf);
        window.removeEventListener('resize', (this as any).boundOnResize);
        window.removeEventListener('mousewheel', (this as any).boundOnWheel);
        window.removeEventListener('wheel', (this as any).boundOnWheel);
        this.container.removeEventListener('pointerdown', (this as any).boundOnPointerDown);
        this.container.removeEventListener('pointermove', (this as any).boundOnPointerMove);
        this.container.removeEventListener('pointerup', (this as any).boundOnPointerUp);
        this.container.removeEventListener('pointercancel', (this as any).boundOnPointerUp);
        if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
            this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
        }
        this.container.removeEventListener('click', (this as any).boundOnClick);
    }
}

export default function CircularGallery({
    items,
    bend = 3,
    textColor = '#ffffff',
    borderRadius = 0.05,
    font = 'bold 30px Figtree',
    scrollSpeed = 2,
    scrollEase = 0.05,
    activeScale = 1.15
}: any) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!containerRef.current) return;
        const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, activeScale });
        return () => { app.destroy(); };
    }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, activeScale]);
    return <div className="circular-gallery" ref={containerRef} />;
}


