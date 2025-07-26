import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import { useControls } from "leva";

export default function ScrollClouds() {
  // Leva 面板：把 range 调小一点让云更集中
  /* leva 默认值，全部往“小 + 慢 + 稀疏”调一点 */
  const { color, x, y, z, range, ...config } = useControls("clouds", {
    seed: 1,
    segments: 10,
    volume: 20,      // 6 → 4  ↓云体积
    opacity: 0.75,  // 0.8 → 0.75
    fade: 15,       // 稍大一点，边缘更柔
    growth: 2,      // 4 → 2   ↓膨胀程度
    speed: 0.04,    // 0.1 → 0.04  ↓整体云动画速度
    x: 6,
    y: 1,
    z: 4,           // 1 → 4   ↑z bounds 让云体更扁平
    range: 100,      // 40 ~ 60 让小云更集中
    color: "#ffffff",
  })


  const group = useRef(null);
  const cloud0 = useRef(null);

  /* 自转动画 */
  useFrame(({ clock }, delta) => {
    group.current.rotation.y = Math.cos(clock.elapsedTime / 2) / 3;
    group.current.rotation.x = Math.sin(clock.elapsedTime / 2) / 6;
    cloud0.current.rotation.y -= delta;
  });

  // ------------ 这里用 ( 不是 { ------------
  return (
    <group ref={group} position={[0, -3.5, 0]}>   {/* 整组下移 3.5 单位 */}
      {/* 主云，体积适当放大一倍 */}
      <Cloud ref={cloud0}
             {...config}
             bounds={[x * 2, y * 2, z * 2]}
             color={color}
      />
  
      {/* 装饰云：比原来体积减半，并挪得更靠外一点 */}
      <Cloud {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#eed0d0" seed={2} position={[18,  -6,   0]} />
      <Cloud {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#d0e0d0" seed={3} position={[-18, -6,   0]} />
      <Cloud {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#a0b0d0" seed={4} position={[  0,  -6, -15]} />
      <Cloud {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#c0c0dd" seed={5} position={[  0,  -6,  15]} />
  
      {/* 外圈大云，整体缩小 + 向下移一点 */}
      <Cloud
        concentrate="outside"
        growth={15}          /* 100 → 80 */
        color="#ffccdd"
        opacity={1.1}        /* 1.25 → 1.1 */
        seed={0.1}
        bounds={38}          /* 130 → 90 */
        volume={30}         /* 200 → 150 */
        segments={10}
        position={[-10, -49, 0]}/* 向下 2 单位 */
      />
    </group>
  )
  
}
