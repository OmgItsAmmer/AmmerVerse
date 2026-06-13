import { useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 1500;
const PARTICLE_SIZE_MIN = 0.005;
const PARTICLE_SIZE_MAX = 0.01;
const SPHERE_RADIUS = 9;
const POSITION_RANDOMNESS = 4;
const ROTATION_SPEED_Y = 0.0005;
const PARTICLE_OPACITY = 1;
const IMAGE_SIZE = 1.5;
const SNAP_LERP = 0.085;

const FALLBACK_TEXTURE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function normalizeImageUrls(images) {
    if (!Array.isArray(images) || images.length === 0) return [FALLBACK_TEXTURE];
    const urls = images
        .map((src) => (typeof src === 'string' ? src : src?.default ?? src?.src ?? ''))
        .filter(Boolean);
    return urls.length > 0 ? urls : [FALLBACK_TEXTURE];
}

function OrbitImagePlane({ position, rotation, texture, slotIndex, activeIndex, domainCount, ringRef }) {
    const meshRef = useRef(null);

    useFrame(() => {
        const mesh = meshRef.current;
        if (!mesh?.material || !ringRef.current) return;

        const step = (Math.PI * 2) / Math.max(domainCount, 1);
        const slotAngle = slotIndex * step;
        const worldAngle = slotAngle + ringRef.current.rotation.y;
        const facing = Math.cos(worldAngle);
        const isActive = slotIndex === activeIndex;

        mesh.material.opacity = isActive
            ? THREE.MathUtils.clamp(0.55 + facing * 0.45, 0.75, 1)
            : THREE.MathUtils.clamp(0.04 + Math.max(0, facing) * 0.12, 0.04, 0.18);
    });

    return (
        <mesh ref={meshRef} position={position} rotation={rotation}>
            <planeGeometry args={[IMAGE_SIZE, IMAGE_SIZE]} />
            <meshBasicMaterial
                map={texture}
                transparent
                opacity={slotIndex === activeIndex ? 1 : 0.12}
                side={THREE.DoubleSide}
                toneMapped={false}
                depthWrite={false}
            />
        </mesh>
    );
}

/**
 * Particle sphere + equatorial image ring — matches cosmos-3d-orbit-gallery spec.
 * `images` should be one URL per carousel slot (4 domains), not every project thumb.
 */
export function ParticleSphere({ images, activeIndex = 0, domainCount = 4 }) {
    const ringRef = useRef(null);
    const instancedRef = useRef(null);
    const targetRotationRef = useRef(0);

    const imageUrls = useMemo(() => normalizeImageUrls(images), [images]);
    const textures = useTexture(imageUrls, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
    });

    const IMAGE_COUNT = imageUrls.length;

    useEffect(() => {
        const step = (Math.PI * 2) / Math.max(domainCount, 1);
        targetRotationRef.current = -activeIndex * step;
    }, [activeIndex, domainCount]);

    const particles = useMemo(() => {
        const items = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
            const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
            const radiusVariation = SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS;

            items.push({
                position: [
                    radiusVariation * Math.cos(theta) * Math.sin(phi),
                    radiusVariation * Math.cos(phi),
                    radiusVariation * Math.sin(theta) * Math.sin(phi),
                ],
                scale: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
                color: new THREE.Color().setHSL(
                    Math.random() * 0.1 + 0.05,
                    0.8,
                    0.6 + Math.random() * 0.3
                ),
            });
        }

        return items;
    }, []);

    const orbitingImages = useMemo(() => {
        const items = [];

        for (let i = 0; i < IMAGE_COUNT; i++) {
            const angle = (i / IMAGE_COUNT) * Math.PI * 2;
            const x = SPHERE_RADIUS * Math.cos(angle);
            const y = 0;
            const z = SPHERE_RADIUS * Math.sin(angle);

            const position = new THREE.Vector3(x, y, z);
            const outwardDirection = position.clone().normalize();
            const matrix = new THREE.Matrix4();
            matrix.lookAt(position, position.clone().add(outwardDirection), new THREE.Vector3(0, 1, 0));
            const euler = new THREE.Euler().setFromRotationMatrix(matrix);

            items.push({
                position: [x, y, z],
                rotation: [euler.x, euler.y, euler.z],
                textureIndex: i % textures.length,
            });
        }

        return items;
    }, [IMAGE_COUNT, textures.length]);

    useLayoutEffect(() => {
        const mesh = instancedRef.current;
        if (!mesh) return;

        const dummy = new THREE.Object3D();
        particles.forEach((particle, index) => {
            dummy.position.set(...particle.position);
            dummy.scale.setScalar(particle.scale);
            dummy.updateMatrix();
            mesh.setMatrixAt(index, dummy.matrix);
            mesh.setColorAt(index, particle.color);
        });

        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [particles]);

    useFrame(() => {
        if (!ringRef.current) return;

        ringRef.current.rotation.y = THREE.MathUtils.lerp(
            ringRef.current.rotation.y,
            targetRotationRef.current,
            SNAP_LERP
        );
        ringRef.current.rotation.y += ROTATION_SPEED_Y;
    });

    return (
        <group ref={ringRef}>
            <instancedMesh
                ref={instancedRef}
                args={[undefined, undefined, PARTICLE_COUNT]}
                frustumCulled={false}
            >
                <sphereGeometry args={[1, 8, 6]} />
                <meshBasicMaterial transparent opacity={PARTICLE_OPACITY} vertexColors />
            </instancedMesh>

            {orbitingImages.map((image, index) => (
                <OrbitImagePlane
                    key={`image-${index}`}
                    position={image.position}
                    rotation={image.rotation}
                    texture={textures[image.textureIndex]}
                    slotIndex={index}
                    activeIndex={activeIndex}
                    domainCount={domainCount}
                    ringRef={ringRef}
                />
            ))}
        </group>
    );
}

export default ParticleSphere;
