import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';

const FloatingSpheres = () => (
  <group>
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <mesh position={[-2.1, 0.6, -4]}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial color="#2563EB" roughness={0.25} metalness={0.35} />
      </mesh>
    </Float>
    <Float speed={1.7} rotationIntensity={0.9} floatIntensity={2.2}>
      <mesh position={[1.6, 1.2, -3]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial color="#E11D48" roughness={0.18} metalness={0.45} />
      </mesh>
    </Float>
    <Float speed={1.2} rotationIntensity={0.7} floatIntensity={1.6}>
      <mesh position={[0.1, -0.5, -2]}>
        <torusKnotGeometry args={[0.45, 0.16, 120, 16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.35} metalness={0.6} opacity={0.45} transparent />
      </mesh>
    </Float>
  </group>
);

const Hero3DBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 ">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]} intensity={1} />
        <Suspense fallback={null}>
          <FloatingSpheres />
        </Suspense>
        <OrbitControls enabled={false} />
      </Canvas>
    </div>
  );
};

export default Hero3DBackground;
