/**
 * ComplianceParticles3D — Three.js particle system + shader background
 * Renders floating green particles with gentle motion for the Planificación section
 */
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Generate random positions and velocities
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 10;
      pos[i3 + 1] = (Math.random() - 0.5) * 8;
      pos[i3 + 2] = (Math.random() - 0.5) * 6;

      vel[i3] = (Math.random() - 0.5) * 0.005;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.003;

      // Green palette variations
      const greenVariant = 0.5 + Math.random() * 0.3;
      col[i3] = 0.3 + Math.random() * 0.2; // R
      col[i3 + 1] = greenVariant; // G
      col[i3 + 2] = 0.3 + Math.random() * 0.15; // B
    }
    return { positions: pos, velocities: vel, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += velocities[i3] + Math.sin(t * 0.3 + i) * 0.001;
      arr[i3 + 1] += velocities[i3 + 1] + Math.cos(t * 0.2 + i * 0.5) * 0.001;
      arr[i3 + 2] += velocities[i3 + 2];

      // Wrap around boundaries
      if (arr[i3] > 5) arr[i3] = -5;
      if (arr[i3] < -5) arr[i3] = 5;
      if (arr[i3 + 1] > 4) arr[i3 + 1] = -4;
      if (arr[i3 + 1] < -4) arr[i3 + 1] = 4;
      if (arr[i3 + 2] > 3) arr[i3 + 2] = -3;
      if (arr[i3 + 2] < -3) arr[i3 + 2] = 3;
    }
    posAttr.needsUpdate = true;

    // Gentle rotation
    meshRef.current.rotation.y = t * 0.02;
    meshRef.current.rotation.x = Math.sin(t * 0.01) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshBasicMaterial
        color="#4CAF50"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// Animated shader background plane
const shaderVertexSource = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shaderFragmentSource = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float wave1 = sin(uv.x * 3.0 + uTime * 0.3) * 0.5 + 0.5;
    float wave2 = cos(uv.y * 2.5 + uTime * 0.2) * 0.5 + 0.5;
    float blend = wave1 * wave2;
    vec3 color1 = vec3(0.42, 0.73, 0.42); // green
    vec3 color2 = vec3(0.30, 0.60, 0.50); // teal-green
    vec3 color3 = vec3(0.55, 0.80, 0.55); // light green
    vec3 finalColor = mix(mix(color1, color2, blend), color3, sin(uTime * 0.1) * 0.5 + 0.5);
    gl_FragColor = vec4(finalColor, 0.08);
  }
`;

function ShaderBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniformsRef = useRef({ uTime: { value: 0 } });

  useFrame(({ clock }) => {
    uniformsRef.current.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <planeGeometry args={[20, 16]} />
      <shaderMaterial
        vertexShader={shaderVertexSource}
        fragmentShader={shaderFragmentSource}
        uniforms={uniformsRef.current}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function ComplianceParticles3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <ShaderBackground />
        <Particles count={150} />
        <FloatingMesh />
      </Canvas>
    </div>
  );
}
