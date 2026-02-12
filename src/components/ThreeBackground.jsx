import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Simple rotating box component
const SpinningBox = () => {
  const mesh = useRef();
  useFrame((state, delta) => (mesh.current.rotation.x += delta));
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const ThreeBackground = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '50vw', // Right half
        height: '100vh',
        zIndex: 0,
        background: 'blue', // Debug background
      }}
    >
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <SpinningBox />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
