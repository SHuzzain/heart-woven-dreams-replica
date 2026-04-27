import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Petals({ count = 60 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 14,
        y: Math.random() * 12 + 2,
        z: (Math.random() - 0.5) * 8,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        speed: 0.2 + Math.random() * 0.4,
        sway: 0.5 + Math.random() * 0.8,
        scale: 0.12 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
      })),
    [count]
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    data.forEach((p, i) => {
      const y = p.y - ((t * p.speed) % 14);
      const x = p.x + Math.sin(t * 0.4 + p.phase) * p.sway;
      const z = p.z + Math.cos(t * 0.3 + p.phase) * 0.4;
      dummy.position.set(x, y - 5, z);
      dummy.rotation.set(p.rx + t * 0.2, p.ry + t * 0.3, p.rz + t * 0.15);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  // Petal shape via custom geometry — soft rounded oval
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.5, 0.2, 0.6, 0.9, 0, 1);
    shape.bezierCurveTo(-0.6, 0.9, -0.5, 0.2, 0, 0);
    const geo = new THREE.ShapeGeometry(shape, 16);
    geo.translate(0, -0.5, 0);
    return geo;
  }, []);

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, count]}>
      <meshStandardMaterial
        color="#f7c5cc"
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
        roughness={0.6}
        metalness={0.05}
        emissive="#fbe5e8"
        emissiveIntensity={0.15}
      />
    </instancedMesh>
  );
}

function FloatingRing() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.3;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={group} position={[0, 0, -2]}>
        <mesh rotation={[0.35, 0.2, -0.24]} position={[-0.44, 0.02, 0]}>
          <torusGeometry args={[1.16, 0.075, 32, 128]} />
          <meshStandardMaterial
            color="#d4a05a"
            metalness={0.95}
            roughness={0.15}
            emissive="#f0c97a"
            emissiveIntensity={0.45}
          />
        </mesh>
        <mesh rotation={[0.35, -0.2, 0.24]} position={[0.44, -0.02, 0]}>
          <torusGeometry args={[1.16, 0.075, 32, 128]} />
          <meshStandardMaterial
            color="#f2cf7b"
            metalness={0.95}
            roughness={0.14}
            emissive="#ffe4a3"
            emissiveIntensity={0.35}
          />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingHearts({ count = 18 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 8 - 3,
        z: -1 - Math.random() * 4,
        speed: 0.25 + Math.random() * 0.35,
        scale: 0.12 + Math.random() * 0.14,
        phase: Math.random() * Math.PI * 2,
      })),
    [count]
  );

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.32);
    shape.bezierCurveTo(0, 0.7, -0.62, 0.72, -0.62, 0.25);
    shape.bezierCurveTo(-0.62, -0.18, -0.2, -0.42, 0, -0.68);
    shape.bezierCurveTo(0.2, -0.42, 0.62, -0.18, 0.62, 0.25);
    shape.bezierCurveTo(0.62, 0.72, 0, 0.7, 0, 0.32);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.025,
      bevelThickness: 0.025,
    });
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    data.forEach((heart, i) => {
      dummy.position.set(
        heart.x + Math.sin(t * heart.speed + heart.phase) * 0.45,
        heart.y + Math.sin(t * 0.5 + heart.phase) * 0.35,
        heart.z
      );
      dummy.rotation.set(0.18, t * heart.speed + heart.phase, Math.sin(t + heart.phase) * 0.2);
      dummy.scale.setScalar(heart.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, count]}>
      <meshStandardMaterial
        color="#e7a0aa"
        metalness={0.2}
        roughness={0.28}
        transparent
        opacity={0.72}
        emissive="#ffd6dc"
        emissiveIntensity={0.35}
      />
    </instancedMesh>
  );
}

function GlowOrb() {
  return (
    <mesh position={[0, 0, -3]}>
      <sphereGeometry args={[2.4, 32, 32]} />
      <meshBasicMaterial color="#fbe2c4" transparent opacity={0.18} />
    </mesh>
  );
}

export const HeroScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffd9b3" />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color="#f7c5cc" />
      <directionalLight position={[0, 10, 5]} intensity={0.4} color="#fff5e6" />

      <GlowOrb />
      <FloatingRing />
      <FloatingHearts count={20} />
      <Petals count={70} />
      <Sparkles count={120} scale={[12, 8, 6]} size={2.5} speed={0.4} color="#f0c97a" opacity={0.7} />
    </Canvas>
  );
};
