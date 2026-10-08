import { Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="scene-error">La scène 3D nécessite un navigateur compatible WebGL.</div> : this.props.children; }
}

function Car({ color, interactive }: { color: string; interactive: boolean }) {
  const gltf = useGLTF('/models/ferrari.glb', '/models/draco/');
  const group = useRef<THREE.Group>(null);
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const { model, paint } = useMemo(() => {
    const model = gltf.scene.clone(true);
    const paint = new THREE.MeshPhysicalMaterial({ color: '#d5e935', metalness: .75, roughness: .22, clearcoat: 1, clearcoatRoughness: .06 });
    model.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        if (obj.name === 'body') obj.material = paint;
        else if (obj.name === 'glass') obj.material = new THREE.MeshPhysicalMaterial({ color: '#151b1c', metalness: .3, roughness: .08, clearcoat: 1 });
      }
    });
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.set(-center.x, -box.min.y, -center.z);
    return { model, paint };
  }, [gltf]);
  useEffect(() => { paint.color.set(color); }, [color, paint]);
  useFrame((state, dt) => {
    if (!group.current || interactive) return;
    const section = document.getElementById('experience');
    const progress = section ? THREE.MathUtils.clamp(-section.getBoundingClientRect().top / (section.offsetHeight - window.innerHeight), 0, 1) : 0;
    const target = reduced ? 2.5 : 2.5 + progress * Math.PI * 1.7;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 4, dt);
    const mobile = state.size.width < 760;
    const distance = mobile ? 8.4 : 6.3 - Math.sin(progress * Math.PI) * .7;
    state.camera.position.lerp(new THREE.Vector3(distance * .74, 2.7 + progress * 2.2, distance * .85), 1 - Math.exp(-dt * 3));
    state.camera.lookAt(0, .55, 0);
  });
  return <group ref={group} rotation={[0, 2.5, 0]}><primitive object={model} /></group>;
}

export default function CarScene({ color, interactive = false }: { color: string; interactive?: boolean }) {
  const [ready, setReady] = useState(false);
  return <SceneBoundary><Canvas dpr={[1, 1.6]} camera={{ position: [6, 2.7, 6.5], fov: 37 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.2; setReady(true); }}>
    <ambientLight intensity={.5} />
    <directionalLight position={[4, 7, 2]} intensity={3} color="#f6ffe6" />
    <Suspense fallback={<Html center><span className="loading-3d">CHARGEMENT DE LA SCÈNE 3D</span></Html>}>
      <Car color={color} interactive={interactive} />
      <Environment files="/models/studio.hdr" environmentIntensity={.65} />
      <Environment resolution={256}>
        <Lightformer intensity={5} position={[0, 5, -2]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 3, 1]} />
        <Lightformer intensity={3} position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[6, 1, 1]} />
        <Lightformer intensity={3} position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 1, 1]} />
      </Environment>
      <ContactShadows position={[0, -.02, 0]} opacity={.65} scale={14} blur={2.8} far={4} color="#000000" frames={1} />
      {interactive && <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={.55} maxPolarAngle={Math.PI / 2.2} target={[0, .55, 0]} autoRotate autoRotateSpeed={.4} />}
    </Suspense>
  </Canvas>{!ready && <span className="loading-3d">INITIALISATION 3D</span>}</SceneBoundary>;
}