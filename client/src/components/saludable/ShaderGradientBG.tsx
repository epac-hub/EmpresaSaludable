/**
 * ShaderGradientBG — Animated simplex noise gradient shader background
 * Replaces static section backgrounds with a living, breathing gradient
 * Uses React Three Fiber + custom GLSL fragment shader
 */
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Simplex noise GLSL (2D) — compact implementation
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uOpacity;
  varying vec2 vUv;

  // Simplex 2D noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    
    // Multi-octave noise for organic flow
    float n1 = snoise(uv * 2.0 + uTime * 0.08);
    float n2 = snoise(uv * 4.0 - uTime * 0.12 + 100.0);
    float n3 = snoise(uv * 1.5 + uTime * 0.05 + 50.0);
    
    // Combine octaves with different weights
    float noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    noise = noise * 0.5 + 0.5; // Normalize to 0-1
    
    // Blend three colors based on noise
    vec3 color = mix(uColor1, uColor2, smoothstep(0.2, 0.6, noise));
    color = mix(color, uColor3, smoothstep(0.5, 0.9, noise + sin(uTime * 0.1) * 0.15));
    
    // Subtle vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.2) * 0.3;
    color *= vignette;
    
    gl_FragColor = vec4(color, uOpacity);
  }
`;

interface ShaderPlaneProps {
  color1: [number, number, number];
  color2: [number, number, number];
  color3: [number, number, number];
  opacity: number;
  speed?: number;
}

function ShaderPlane({ color1, color2, color3, opacity, speed = 1 }: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Vector3(...color1) },
    uColor2: { value: new THREE.Vector3(...color2) },
    uColor3: { value: new THREE.Vector3(...color3) },
    uOpacity: { value: opacity },
  });

  useFrame(({ clock }) => {
    uniformsRef.current.uTime.value = clock.getElapsedTime() * speed;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[20, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniformsRef.current}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

interface ShaderGradientBGProps {
  /** Primary color as RGB 0-1 array */
  color1?: [number, number, number];
  /** Secondary color as RGB 0-1 array */
  color2?: [number, number, number];
  /** Tertiary color as RGB 0-1 array */
  color3?: [number, number, number];
  /** Opacity of the shader layer (0-1) */
  opacity?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Additional className */
  className?: string;
}

export default function ShaderGradientBG({
  color1 = [0.91, 0.96, 0.88],   // #E8F5E0 light green
  color2 = [0.78, 0.90, 0.79],   // #C8E6C9 medium green
  color3 = [0.65, 0.84, 0.65],   // #A5D6A7 sage green
  opacity = 0.6,
  speed = 1,
  className = "",
}: ShaderGradientBGProps) {
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
      >
        <ShaderPlane
          color1={color1}
          color2={color2}
          color3={color3}
          opacity={opacity}
          speed={speed}
        />
      </Canvas>
    </div>
  );
}
