import { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';
import { useScroll, useSpring } from 'framer-motion';

interface CyberneticGridShaderProps {
    scrollRef?: React.RefObject<HTMLDivElement | null>;
}

const CyberneticGridShader = memo(({ scrollRef }: CyberneticGridShaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const uniformsRef = useRef<{
        iTime: { value: number };
        iResolution: { value: THREE.Vector2 };
        iMouse: { value: THREE.Vector2 };
        uDistortion: { value: number };
    } | null>(null);

    // Track scroll distortion internally using Framer Motion
    const { scrollYProgress } = useScroll({
        container: scrollRef as React.RefObject<HTMLElement>
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 20
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 1) Renderer, Scene, Camera, Clock
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const clock = new THREE.Clock();

        // 2) GLSL Shaders
        const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform float uDistortion;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))
                     * 43758.5453123);
      }

      void main() {
        // normalize coords around center
        vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy)
                     / iResolution.y;
        vec2 mouse = (iMouse - 0.5 * iResolution.xy)
                     / iResolution.y;

        float t         = iTime * 0.2;
        float mouseDist = length(uv - mouse);

        // BASE MATRIX FORM (Refined Amplitude to prevent ultra-wide distortion)
        float d = length(uv);
        // Flatter curvature for better consistency on large monitors
        uv *= 1.05 - d * 0.15; 

        // NAVIGATION (Move between different sectors)
        vec2 navOffset = vec2(0.0, uDistortion * 2.0); 
        vec2 scrolledUv = uv + navOffset;

        // CURSOR DISTORTION (Warp)
        float currentMouseDist = length(scrolledUv - (mouse + navOffset));
        float warp = sin(currentMouseDist * 25.0 - t * 4.0) * 0.08;
        warp *= smoothstep(0.1, 0.0, currentMouseDist);
        scrolledUv += warp;

        // ZOOM control
        float zoom = 4.0;
        vec2 zoomedUv = scrolledUv * zoom;

        // grid lines
        vec2 gridUv = abs(fract(zoomedUv * 10.0) - 0.5);
        float line  = pow(1.0 - min(gridUv.x, gridUv.y), 50.0);

        // base grid color pulsing (ORANGE)
        vec3 gridColor = vec3(1.0, 0.4, 0.0); 
        vec3 color     = gridColor
                       * line
                       * (0.5 + sin(t * 2.0) * 0.2);

        // energetic pulses along grid (BRIGHTER ORANGE/YELLOW)
        float energy = sin(zoomedUv.x * 20.0 + t * 5.0)
                     * sin(zoomedUv.y * 20.0 + t * 3.0);
        energy = smoothstep(0.8, 1.0, energy);
        color += vec3(1.0, 0.6, 0.1) * energy * line;

        // glow around mouse (ORANGE GLOW)
        float glow = smoothstep(0.08, 0.0, mouseDist);
        color += vec3(1.0, 0.5, 0.0) * glow * 0.4;

        // subtle noise
        color += random(uv + t * 0.1) * 0.05;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

        // 3) Uniforms, Material, Mesh
        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2() },
            uDistortion: { value: smoothProgress.get() },
            iMouse: {
                value: new THREE.Vector2(
                    (window.innerWidth / 2) * window.devicePixelRatio,
                    (window.innerHeight / 2) * window.devicePixelRatio
                )
            }
        };
        uniformsRef.current = uniforms;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // 4) Resize handler
        const onResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            uniforms.iResolution.value.set(
                width * window.devicePixelRatio,
                height * window.devicePixelRatio
            );
        };
        window.addEventListener('resize', onResize);
        onResize(); // set initial size

        // 5) Mouse handler
        const onMouseMove = (e: MouseEvent) => {
            uniforms.iMouse.value.set(
                e.clientX * window.devicePixelRatio,
                (container.clientHeight - e.clientY) * window.devicePixelRatio
            );
        };
        window.addEventListener('mousemove', onMouseMove);

        // 6) Animation loop
        renderer.setAnimationLoop(() => {
            uniforms.iTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
        });

        // 7) Cleanup on unmount
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);

            renderer.setAnimationLoop(null);

            const canvas = renderer.domElement;
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }

            material.dispose();
            geometry.dispose();
            renderer.dispose();
        };
    }, []);

    // Update uDistortion uniform when smoothProgress changes
    useEffect(() => {
        return smoothProgress.on("change", (v) => {
            if (uniformsRef.current) {
                uniformsRef.current.uDistortion.value = v;
            }
        });
    }, [smoothProgress]);

    return (
        <div
            ref={containerRef}
            className="shader-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none'
            }}
            aria-label="Cybernetic Grid animated background"
        />
    );
});

export default CyberneticGridShader;
