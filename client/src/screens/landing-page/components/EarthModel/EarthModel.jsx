import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import earthObj from '../../../../assets/images/icons/earth.obj?url';
import earthJson from '../../../../assets/images/icons/earth.json';
import earthTexture from '../../../../assets/images/icons/earth.png';
import './EarthModel.css';

// Component to set up renderer output encoding
function RendererSetup() {
  const { gl } = useThree();
  
  useEffect(() => {
    // Set output encoding for proper color rendering
    if (gl.outputEncoding !== undefined) {
      gl.outputEncoding = THREE.sRGBEncoding;
    } else if (gl.outputColorSpace !== undefined) {
      gl.outputColorSpace = THREE.SRGBColorSpace;
    }
  }, [gl]);
  
  return null;
}

// Earth 3D Model Component
function Earth({ isZoomed, onZoomComplete }) {
  const earthRef = useRef();
  const [scene, setScene] = useState(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  
  // Load OBJ, JSON material, and PNG texture
  useEffect(() => {
    const objLoader = new OBJLoader();
    const textureLoader = new TextureLoader();
    
    // Load texture
    const texture = textureLoader.load(earthTexture);
    if (texture.colorSpace !== undefined) {
      texture.colorSpace = THREE.SRGBColorSpace;
    } else if (texture.encoding !== undefined) {
      texture.encoding = THREE.sRGBEncoding;
    }
    
    // Create material from JSON
    const materialData = earthJson;
    const material = new THREE.MeshStandardMaterial();
    
    // Apply material properties from JSON
    if (materialData.color !== undefined) {
      // Handle both hex number and color object
      if (typeof materialData.color === 'number') {
        material.color.setHex(materialData.color);
      } else if (materialData.color.r !== undefined) {
        material.color.setRGB(
          materialData.color.r,
          materialData.color.g,
          materialData.color.b
        );
      }
    }
    if (materialData.roughness !== undefined) {
      material.roughness = materialData.roughness;
    }
    if (materialData.metalness !== undefined) {
      material.metalness = materialData.metalness;
    }
    if (materialData.emissive !== undefined) {
      if (typeof materialData.emissive === 'number') {
        material.emissive.setHex(materialData.emissive);
      } else if (materialData.emissive.r !== undefined) {
        material.emissive.setRGB(
          materialData.emissive.r,
          materialData.emissive.g,
          materialData.emissive.b
        );
      }
    }
    if (materialData.emissiveIntensity !== undefined) {
      material.emissiveIntensity = materialData.emissiveIntensity;
    }
    
    // Apply texture
    material.map = texture;
    material.needsUpdate = true;
    
    // Load OBJ file
    objLoader.load(
      earthObj,
      (object) => {
        // Apply material to all meshes
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = material;
            
            // Ensure proper texture color space
            if (child.material.map) {
              if (child.material.map.colorSpace !== undefined) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
              } else if (child.material.map.encoding !== undefined) {
                child.material.map.encoding = THREE.sRGBEncoding;
              }
              child.material.map.needsUpdate = true;
            }
            
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        setScene(object);
      },
      undefined,
      (error) => {
        console.error('Error loading OBJ:', error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    if (earthRef.current) {
      if (isZoomed && rotationProgress < 1) {
        // Animate 180-degree rotation when zooming
        const newProgress = Math.min(rotationProgress + delta * 0.5, 1);
        setRotationProgress(newProgress);
        earthRef.current.rotation.y = Math.PI * newProgress;
        
        if (newProgress >= 1 && onZoomComplete) {
          onZoomComplete();
        }
      } else if (!isZoomed) {
        // Gentle idle rotation when not zoomed
        earthRef.current.rotation.y += delta * 0.2;
      }
    }
  });

  if (!scene) {
    return null; // Loading state
  }

  return (
    <primitive 
      ref={earthRef} 
      object={scene} 
      scale={isZoomed ? 0.5 : 1.2}
      position={[0, 0, 0]}
    />
  );
}

// Main EarthModel Component
export default function EarthModel({ isZoomed, onEarthClick, onClose }) {
  const [isHovered, setIsHovered] = useState(false);
  const [zoomComplete, setZoomComplete] = useState(false);

  const handleClick = () => {
    if (!isZoomed) {
      onEarthClick();
    }
  };

  // Handle ESC key to close zoomed view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isZoomed && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, onClose]);

  // Reset zoom complete state when closing
  useEffect(() => {
    if (!isZoomed) {
      setZoomComplete(false);
    }
  }, [isZoomed]);

  return (
    <div 
      className={`earth-model-container ${isZoomed ? 'zoomed' : ''} ${isHovered && !isZoomed ? 'hovered' : ''}`}
      onMouseEnter={() => !isZoomed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ cursor: isZoomed ? 'grab' : 'pointer' }}
    >
      {/* Close button when zoomed */}
      {isZoomed && onClose && (
        <button 
          className="earth-close-button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close Earth view"
        >
          ✕
        </button>
      )}

      <Canvas
        camera={{ 
          position: isZoomed ? [0, 0, 3.5] : [0, 0, 3], 
          fov: 50 
        }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        <RendererSetup />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Earth 
            isZoomed={isZoomed} 
            onZoomComplete={() => setZoomComplete(true)}
          />
        </Suspense>
        
        {/* Enable orbit controls only when zoomed and animation is complete */}
        {isZoomed && zoomComplete && (
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={10}
          />
        )}
      </Canvas>

      {/* Instructions when zoomed */}
      {isZoomed && (
        <div className="earth-instructions">
          <p>Drag to rotate • Scroll to zoom • ESC or ✕ to close</p>
        </div>
      )}
    </div>
  );
}

