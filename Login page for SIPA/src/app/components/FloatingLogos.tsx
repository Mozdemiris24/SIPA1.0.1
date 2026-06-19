import React, { useRef, useMemo, useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ReactThreeFiber } from '@react-three/fiber';

// R3F elementleri için TypeScript tanımlamaları
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>;
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      ambientLight: ReactThreeFiber.LightNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: ReactThreeFiber.LightNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      pointLight: ReactThreeFiber.LightNode<THREE.PointLight, typeof THREE.PointLight>;
    }
  }
}

// 1 Devasa ana logo ve 6 küçük arka plan logosu
const LOGOS_CONFIG = [
  // Büyük (Ön planda, devasa boyut, çok yavaş)
  { type: 'main', scale: 1.0, moveDuration: 60, delay: 1, rotSpeed: [0.01, 0.015, 0.005], z: 0 },
  // Küçükler (Arka planda, düz rotalarda uçuşan, hızları yarı yarıya düşürüldü)
  { type: 'bg', scale: 0.1, moveDuration: 80, delay: 0, rotSpeed: [0.05, 0.08, 0.02], z: -4 },
  { type: 'bg', scale: 0.15, moveDuration: 120, delay: 0, rotSpeed: [0.06, 0.04, 0.03], z: -6 },
  { type: 'bg', scale: 0.08, moveDuration: 70, delay: 0, rotSpeed: [0.04, 0.06, 0.04], z: -8 },
  { type: 'bg', scale: 0.12, moveDuration: 100, delay: 0, rotSpeed: [0.05, 0.03, 0.05], z: -5 },
  { type: 'bg', scale: 0.2, moveDuration: 140, delay: 0, rotSpeed: [0.02, 0.05, 0.02], z: -7 },
  { type: 'bg', scale: 0.09, moveDuration: 90, delay: 0, rotSpeed: [0.05, 0.05, 0.05], z: -9 },
];

function FloatingLogo({ config, meshes }: { config: any; meshes: { geometry: any; material: any }[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Rastgele başlangıç pozisyonu (animasyon döngüsü için offset)
  const offset = useMemo(() => Math.random() * 100, []);
  
  // Başlangıç rotasyonu
  const initialRot = useMemo(() => [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ], []);

  // Arka plan logoları için sabit, düz bir doğrultu (ekran dışından ekran dışına)
  const bgPath = useMemo(() => {
    const isHorizontal = Math.random() > 0.5;
    let startX, startY, endX, endY;
    
    // Kameraya uzaklık (z) arttıkça görünür alan genişlediği için sınırları biraz daha büyük tutuyoruz
    const bound = Math.abs(config.z) * 0.8 + 5; 
    
    if (isHorizontal) {
      startX = Math.random() > 0.5 ? -bound : bound;
      endX = -startX;
      startY = (Math.random() - 0.5) * bound;
      endY = startY + (Math.random() - 0.5) * (bound / 2); 
    } else {
      startY = Math.random() > 0.5 ? -bound : bound;
      endY = -startY;
      startX = (Math.random() - 0.5) * bound;
      endX = startX + (Math.random() - 0.5) * (bound / 2);
    }
    return { start: new THREE.Vector3(startX, startY, config.z), end: new THREE.Vector3(endX, endY, config.z) };
  }, [config.z]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();

    if (config.type === 'main') {
      // Ana büyük logo animasyonu (Sol alttan sağ üste)
      const moveDuration = config.moveDuration; 
      const delay = config.delay; 
      const cycleTotal = moveDuration + delay;
      
      const cycleTime = time % cycleTotal;
      
      if (cycleTime < delay) {
        // İlk yüklemede ve her döngü başında 1 saniye bekle
        groupRef.current.position.set(-20, -20, config.z);
      } else {
        // Harekete başla
        const progress = (cycleTime - delay) / moveDuration; // 0'dan 1'e ilerleme
        
        // Kamera z=5 konumunda, z=0'daki görünür alan yaklaşık x:[-3, 3], y:[-2, 2]'dir.
        // Logonun ekran dışından başlayıp ekran dışına çıkması için -4'ten +4'e gitmesi yeterlidir!
        const startX = -4;
        const endX = 4;
        const startY = -3;
        const endY = 3;
        
        groupRef.current.position.x = startX + (endX - startX) * progress;
        groupRef.current.position.y = startY + (endY - startY) * progress;
        groupRef.current.position.z = config.z;
      }
    } else {
      // Arka plan küçük logolar (Düz rotada uçuşan)
      const cycleTime = time % config.moveDuration;
      const progress = cycleTime / config.moveDuration;
      
      groupRef.current.position.lerpVectors(bgPath.start, bgPath.end, progress);
    }
    
    // Her iki tip için de kendi ekseninde dönme
    groupRef.current.rotation.x = initialRot[0] + time * config.rotSpeed[0];
    groupRef.current.rotation.y = initialRot[1] + time * config.rotSpeed[1];
    groupRef.current.rotation.z = initialRot[2] + time * config.rotSpeed[2];
  });

  return (
    <group 
      ref={groupRef} 
      scale={[config.scale, config.scale, config.scale]} 
    >
      {meshes.map((m, i) => (
        <mesh key={i} geometry={m.geometry} material={m.material} />
      ))}
    </group>
  );
}

function Scene() {
  const [obj, setObj] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load(
      `${import.meta.env.BASE_URL}Logo3D.obj`,
      (loadedObj: THREE.Group) => {
        setObj(loadedObj);
      },
      (xhr: ProgressEvent) => {
        // Yükleme ilerlemesi
        console.log((xhr.loaded / xhr.total * 100) + '% yüklendi');
      },
      (err: unknown) => {
        console.error("OBJ Yükleme Hatası:", err);
        setError("Dosya bulunamadı veya okunamadı.");
      }
    );
  }, []);

  // Cam materyalleri
  const redGlass = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#E82A2A', // Kırmızı
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9, 
    thickness: 1.5, 
    ior: 1.5, 
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }), []);

  const blueGlass = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#0B84E8', // Canlı Mavi (SIPA / İstanbul Enerji tonlarına uygun)
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9, 
    thickness: 1.5, 
    ior: 1.5, 
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }), []);

  const meshes = useMemo(() => {
    if (!obj) return [];
    const list: { geometry: THREE.BufferGeometry; material: THREE.Material }[] = [];
    
    // Tüm objeyi baz alan merkez
    const box = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Tüm çocukları güvenli bir şekilde tara
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry.clone();
        
        geom.translate(-center.x, -center.y, -center.z);
        geom.computeVertexNormals();
        
        list.push({ geometry: geom, material: blueGlass });
      }
    });

    // En büyük parçayı vertex sayısına göre bul (BoundingBox hesaplaması bazen çökebilir)
    if (list.length > 0) {
      let maxVertices = 0;
      let largestIndex = 0;
      
      list.forEach((item, index) => {
        if (item.geometry.attributes.position.count > maxVertices) {
          maxVertices = item.geometry.attributes.position.count;
          largestIndex = index;
        }
      });
      
      // En büyük parçayı kırmızı yapıyoruz
      list[largestIndex].material = redGlass;
    }

    return list;
  }, [obj, redGlass, blueGlass]);

  if (error) {
    return (
      <Html center>
        <div className="text-red-500 font-bold bg-black/50 p-4 rounded whitespace-nowrap">Hata: {error}</div>
      </Html>
    );
  }

  if (!obj) {
    return (
      <Html center>
        <div className="text-white/80 font-medium whitespace-nowrap">Model İndiriliyor...</div>
      </Html>
    );
  }

  return (
    <>
      {/* Işıklandırmalar */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={1.5} color="#0B1F3A" />
      <pointLight position={[10, -10, 5]} intensity={2} color="#E8841A" />
      
      {/* Logolar */}
      {LOGOS_CONFIG.map((config, index) => (
        <FloatingLogo key={index} config={config} meshes={meshes} />
      ))}

      {/* Alan Derinliği (Depth of Field) Efekti */}
      <EffectComposer multisampling={4}>
        <DepthOfField 
          focusDistance={0} // Kameraya yakın olan (z: 0) net olsun
          focalLength={0.08} // Arka plan bulanıklık şiddeti
          bokehScale={5} // Bulanıklık boyutu
          height={480} 
        />
      </EffectComposer>
    </>
  );
}

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("3D Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center text-red-500 z-50 bg-black/50 p-4">
          <p>3D Yükleme Hatası: {this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function FloatingLogos() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ background: "linear-gradient(135deg, #0B1F3A 0%, #1A4A7A 100%)", zIndex: 0 }}>
      {/* Arka plan noktalı deseni koruyoruz (isteğe bağlı) */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
          zIndex: 1
        }}
      />
      
      <ErrorBoundary>
        <div className="absolute inset-0 z-20 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Scene />
          </Canvas>
        </div>
      </ErrorBoundary>
    </div>
  );
}
