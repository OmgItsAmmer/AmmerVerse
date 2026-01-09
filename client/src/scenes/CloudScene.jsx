import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Cloud } from "@react-three/drei";
import colors from "../utils/colors.js";

export default function CloudScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }} style={{ height: "100vh" }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Purple Cloud in center with slight negative Y */}
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          color={colors.avatars.gamedev.main} // from your global colors
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Optional OrbitControls for smooth rotation */}
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
    </Canvas>
  );
}
