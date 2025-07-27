import * as THREE from "three";
import React, { useRef } from "react";
import { Cloud } from "@react-three/drei";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";

export default function ScrollClouds() {
  const { color, x, y, z, range, speed, ...config } = useControls("clouds", {
    seed: 1,
    segments: 10,
    volume: 20,
    opacity: 0.75,
    fade: 15,
    growth: 10,
    speed: 0.15,    // 云的动画速度
    x: 6,
    y: 1,
    z: 4,
    range: 100,
    color: "#ffffff",
  });

  const group = useRef(null);
  const cloud0 = useRef(null);
  const cloud1 = useRef(null);
  const cloud2 = useRef(null);
  const cloud3 = useRef(null);
  const cloud4 = useRef(null); // 新增云
  const cloud5 = useRef(null); // 新增云
  const cloud6 = useRef(null); // 新增云
  const cloud7 = useRef(null); // 新增云，填补空缺位置

  // 最大和最小大小的设置
  const minScale = 1.4;  // 设置最小大小
  const maxScale = 1.8;  // 设置最大大小

  // 让云的大小随着时间发生变化
 useFrame(({ clock }) => {
  if (cloud0.current) {
    const scaleFactor0 = Math.sin(clock.elapsedTime * speed * 0.1) * 0.5 + 1.5;
    cloud0.current.scale.set(
      Math.min(Math.max(scaleFactor0, minScale), maxScale),
      Math.min(Math.max(scaleFactor0, minScale), maxScale),
      Math.min(Math.max(scaleFactor0, minScale), maxScale)
    );
  }

  if (cloud1.current) {
    const scaleFactor1 = Math.sin(clock.elapsedTime * (speed * 1.5)) * 0.5 + 1.3;  // cloud1 稍微小一点
    cloud1.current.scale.set(
      Math.min(Math.max(scaleFactor1, minScale), maxScale),
      Math.min(Math.max(scaleFactor1, minScale), maxScale),
      Math.min(Math.max(scaleFactor1, minScale), maxScale)
    );
  }

  if (cloud2.current) {
    const scaleFactor2 = Math.sin(clock.elapsedTime * (speed * 1)) * 0.6 + 1.7;  // cloud2 更大
    cloud2.current.scale.set(
      Math.min(Math.max(scaleFactor2, minScale), maxScale),
      Math.min(Math.max(scaleFactor2, minScale), maxScale),
      Math.min(Math.max(scaleFactor2, minScale), maxScale)
    );
  }

  if (cloud3.current) {
    const scaleFactor3 = Math.sin(clock.elapsedTime * (speed * 1.2)) * 0.4 + 1.8;  // cloud3 更大
    cloud3.current.scale.set(
      Math.min(Math.max(scaleFactor3, minScale), maxScale),
      Math.min(Math.max(scaleFactor3, minScale), maxScale),
      Math.min(Math.max(scaleFactor3, minScale), maxScale)
    );
  }

  if (cloud4.current) {
    const scaleFactor4 = Math.sin(clock.elapsedTime * (speed * 1.8)) * 0.4 + 1.9;  // cloud4 更大
    cloud4.current.scale.set(
      Math.min(Math.max(scaleFactor4, minScale), maxScale),
      Math.min(Math.max(scaleFactor4, minScale), maxScale),
      Math.min(Math.max(scaleFactor4, minScale), maxScale)
    );
  }

  if (cloud5.current) {
    const scaleFactor5 = Math.sin(clock.elapsedTime * (speed * 0.5)) * 0.3 + 1.6;  // cloud5 更小
    cloud5.current.scale.set(
      Math.min(Math.max(scaleFactor5, minScale), maxScale),
      Math.min(Math.max(scaleFactor5, minScale), maxScale),
      Math.min(Math.max(scaleFactor5, minScale), maxScale)
    );
  }

  if (cloud6.current) {
    const scaleFactor6 = Math.sin(clock.elapsedTime * (speed * 1.7)) * 0.5 + 1.4;  // cloud6 更小
    cloud6.current.scale.set(
      Math.min(Math.max(scaleFactor6, minScale), maxScale),
      Math.min(Math.max(scaleFactor6, minScale), maxScale),
      Math.min(Math.max(scaleFactor6, minScale), maxScale)
    );
  }

  if (cloud7.current) {
    const scaleFactor7 = Math.sin(clock.elapsedTime * (speed * 1.3)) * 0.5 + 1.6;  // cloud7 新添加的云
    cloud7.current.scale.set(
      Math.min(Math.max(scaleFactor7, minScale), maxScale),
      Math.min(Math.max(scaleFactor7, minScale), maxScale),
      Math.min(Math.max(scaleFactor7, minScale), maxScale)
    );
  }
});

  

  return (
    <group ref={group} position={[0, -3.5, 0]}>
      {/* 主云，体积适当放大一倍 灰色 */}
      <Cloud ref={cloud0} {...config} bounds={[x * 2, y * 2, z * 2]} color={color} position={[10, 3, 0]} seed={1} />

      {/* 装饰云：每朵云都有不同的大小 */}
      {/* 白云右边的粉云 */}
      <Cloud ref={cloud1} {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#eed0d0" seed={2} position={[18, -6, 0]} />
      {/* 白云左边的绿云 */}
      <Cloud ref={cloud2} {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#eed0d0" seed={3} position={[-20, -8, 0]} />
      {/* 白云中间的蓝云 */}
      <Cloud ref={cloud3} {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#eed0d0" seed={2} position={[-7, -18, -15]} />
      {/* 屏幕前面的蓝云 */}
      <Cloud ref={cloud4} {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#c0f0f0" seed={5} position={[7, -6, 10]} />
      {/* 屏幕左边的粉云 */}
      <Cloud ref={cloud5} {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#eed0d0" seed={6} position={[-25, -10, 5]} />
      {/* 屏幕右边的绿云 */}
      <Cloud ref={cloud6} {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#c0f0f0" seed={7} position={[30, -6, 0]} />
      {/* 屏幕左中间的紫云 */}
      <Cloud ref={cloud7} {...config} bounds={[x * 0.6, y * 0.6, z * 0.6]} color="#eed0d0" seed={8} position={[-25, -8, 0]} /> 
      
      {/* 外圈大云，整体缩小 + 向下移一点  粉色,在主云下面*/}
      <Cloud
        concentrate="outside"
        growth={15}
        color="#ffccdd"
        opacity={1.1}
        seed={1}
        bounds={38}
        volume={30}
        segments={10}
        position={[-15, -40, 0]}
      />
    </group>
  );
}
