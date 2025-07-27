import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'



// VolumetricClouds.jsx
const vertexShader = `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform float uTime;
  varying vec2 vUv;

  void main(){
    float alpha = 0.6 + 0.4 * sin(uTime + vUv.y * 8.0);
    vec3 cloudColor = vec3(0.0); // 黑色
    gl_FragColor = vec4(cloudColor, alpha); // 输出带 alpha 的黑色
  }
`;



export default function VolumetricClouds() {
  const materialRef = useRef()
  const { viewport, size } = useThree()

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(size.width, size.height) },
        }}
      />
    </mesh>
  )
}
