import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useResidencyStore } from '../../hooks/useResidencyStore';

// Map of room names to camera target positions & orientation targets
const ROOM_CAMERA_RIGS = {
  exterior: {
    pos: new THREE.Vector3(0, 2.5, 15),
    lookAt: new THREE.Vector3(0, 1.8, 0)
  },
  'living-room': {
    pos: new THREE.Vector3(0, 1.8, 7),
    lookAt: new THREE.Vector3(0, 1.2, -1)
  },
  'dj-corner': {
    pos: new THREE.Vector3(-3.2, 1.5, -3.2),
    lookAt: new THREE.Vector3(-5, 1.1, -5)
  },
  'sneaker-wall': {
    pos: new THREE.Vector3(2.5, 1.4, 0.8),
    lookAt: new THREE.Vector3(5, 1.2, 0.8)
  },
  'clothing-rack': {
    pos: new THREE.Vector3(-1.2, 1.3, 2.2),
    lookAt: new THREE.Vector3(-4, 1.2, 2.2)
  },
  'magazine-rack': {
    pos: new THREE.Vector3(1.2, 1.2, -2.2),
    lookAt: new THREE.Vector3(3.2, 0.9, -3.5)
  }
};

export default function CameraController({ updateSpatialListener }) {
  const { camera } = useThree();
  const activeRoom = useResidencyStore((state) => state.activeRoom);
  
  // Keep track of target lookAt as a reference vector
  const currentLookAt = useRef(new THREE.Vector3(0, 1.8, 0));
  const dummyTarget = useRef(new THREE.Object3D());

  // Handle immediate snap or trigger state resets on transition
  useEffect(() => {
    // We can clear active hovers on transition to keep UX clean
    useResidencyStore.getState().clearHover();
  }, [activeRoom]);

  useFrame((state, delta) => {
    const rig = ROOM_CAMERA_RIGS[activeRoom] || ROOM_CAMERA_RIGS['exterior'];

    // 1. Lerp camera position smoothly (damped camera spring physics)
    camera.position.lerp(rig.pos, delta * 3.2);

    // 2. Lerp target look-at coordinate
    currentLookAt.current.lerp(rig.lookAt, delta * 3.5);

    // 3. Make camera look at target coordinate
    camera.lookAt(currentLookAt.current);

    // 4. Update the spatial 3D audio listener location
    if (updateSpatialListener) {
      updateSpatialListener(camera.position, camera.quaternion);
    }
  });

  return null;
}
