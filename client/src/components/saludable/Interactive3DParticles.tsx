/**
 * Interactive3DParticles — 3D particle field that reacts to cursor movement
 * Uses React Three Fiber with window-level mouse tracking for reliable interaction
 */
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Global mouse position shared across all instances
const globalMouse = { x: 0, y: 0 };

interface ParticleFieldProps {
  count?: number;
  color?: string;
  spread?: number;
  size?: number;
  speed?: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function ParticleField({
  count = 800,
  color = "#66BB6A",
  spread = 6,
  size = 0.04,
  speed = 0.3,
  containerRef,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Generate initial positions
  const [positions, velocities, originalPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread * 0.6;
      const z = (Math.random() - 0.5) * 3;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;
    }
    return [pos, vel, orig];
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !containerRef.current) return;
    const positionAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const posArray = positionAttr.array as Float32Array;
    const time = clock.elapsedTime * speed;

    // Get container bounds to calculate relative mouse position
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (globalMouse.x - rect.left) / rect.width;
    const relY = (globalMouse.y - rect.top) / rect.height;

    // Convert to normalized coordinates (-1 to 1)
    const mouseNormX = relX * 2 - 1;
    const mouseNormY = -(relY * 2 - 1);

    // Convert to world space
    const mouseWorldX = mouseNormX * viewport.width * 0.5;
    const mouseWorldY = mouseNormY * viewport.height * 0.5;

    // Only apply repulsion if mouse is within the container bounds
    const mouseInBounds = relX >= 0 && relX <= 1 && relY >= 0 && relY <= 1;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      if (mouseInBounds) {
        // Distance from mouse in world space
        const dx = posArray[i3] - mouseWorldX;
        const dy = posArray[i3 + 1] - mouseWorldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 2.0;

        if (dist < maxDist) {
          // Repulsion force from cursor
          const force = (1 - dist / maxDist) * 0.08;
          velocities[i3] += dx * force;
          velocities[i3 + 1] += dy * force;
        }
      }

      // Spring back to original position
      const springX = (originalPositions[i3] - posArray[i3]) * 0.015;
      const springY = (originalPositions[i3 + 1] - posArray[i3 + 1]) * 0.015;
      const springZ = (originalPositions[i3 + 2] - posArray[i3 + 2]) * 0.015;

      velocities[i3] += springX;
      velocities[i3 + 1] += springY;
      velocities[i3 + 2] += springZ;

      // Organic floating motion
      const floatX = Math.sin(time + i * 0.1) * 0.002;
      const floatY = Math.cos(time + i * 0.15) * 0.003;

      velocities[i3] += floatX;
      velocities[i3 + 1] += floatY;

      // Apply velocity with damping
      velocities[i3] *= 0.92;
      velocities[i3 + 1] *= 0.92;
      velocities[i3 + 2] *= 0.92;

      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];
    }

    positionAttr.needsUpdate = true;

    // Gentle overall rotation
    pointsRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface Interactive3DParticlesProps {
  count?: number;
  color?: string;
  spread?: number;
  size?: number;
  speed?: number;
  className?: string;
}

export default function Interactive3DParticles({
  count = 800,
  color = "#66BB6A",
  spread = 6,
  size = 0.04,
  speed = 0.3,
  className = "",
}: Interactive3DParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse at window level for reliable cursor reactivity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      globalMouse.x = e.clientX;
      globalMouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-[2] ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: "none" }}
      >
        <ParticleField
          count={count}
          color={color}
          spread={spread}
          size={size}
          speed={speed}
          containerRef={containerRef}
        />
      </Canvas>
    </div>
  );
}
