import React, { useEffect, useRef, useState, useCallback } from 'react';
import researchAreaImg from '../assets/Home/ResearchArea.png';

const HCISection = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  const jitterRef = useRef({ x: 0, y: 0 });
  const renderFrameRef = useRef(null);
  const [imgElement, setImgElement] = useState(null);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [nextTargetIndex, setNextTargetIndex] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 严格使用百分比坐标 (0-100%)
  const headPosition = { x:20, y: 41.5 }; // 头部HMD位置 - 百分比坐标
  
  // 定义10个不同的目标点坐标
  const targetPositions = [
    { x: 70, y: 28 },    // 目标位置1
    { x: 60, y: 45 },    // 目标位置2
    { x: 80, y: 35 },    // 目标位置3
    { x: 75, y: 50 },    // 目标位置4
    { x: 65, y: 20 },    // 目标位置5
    { x: 50, y: 30 },    // 目标位置6
    { x: 55, y: 45 },    // 目标位置7
    { x: 85, y: 40 },    // 目标位置8
    { x: 40, y: 25 },    // 目标位置9
    { x: 90, y: 30 }     // 目标位置10
  ];
  
  // Box-Muller变换生成正态分布随机数
  const generateGaussian = (mean = 0, stdDev = 1) => {
    // Box-Muller变换
    const u1 = Math.random();
    const u2 = Math.random();
    
    // 避免u1为0
    const rand_std_normal = Math.sqrt(-2.0 * Math.log(u1 || 0.000001)) * 
                            Math.cos(2.0 * Math.PI * u2);
                            
    // 转换为指定均值和标准差的正态分布
    return mean + stdDev * rand_std_normal;
  };
  
  // 更新抖动值
  useEffect(() => {
    // 每50ms更新一次抖动值
    const jitterInterval = setInterval(() => {
      // 应用正态分布抖动（标准差为1.2百分比）
      jitterRef.current = {
        x: generateGaussian(0, 1.2),
        y: generateGaussian(0, 1.2)
      };
    }, 50);
    
    return () => clearInterval(jitterInterval);
  }, []);
  
  // 切换到下一个目标点，带动画效果
  const switchToNextTarget = useCallback(() => {
    if (isAnimating) return; // 如果正在动画中，不执行新的切换
    
    const nextIndex = (currentTargetIndex + 1) % targetPositions.length;
    setNextTargetIndex(nextIndex);
    setIsAnimating(true);
    setAnimationProgress(0);
  }, [currentTargetIndex, isAnimating, targetPositions.length]);
  
  // 处理动画
  const animate = useCallback(() => {
    if (!isAnimating || nextTargetIndex === null) return;
    
    setAnimationProgress(prev => {
      const newProgress = prev + 0.02; // 调整动画速度，值越小越慢
      
      if (newProgress >= 1) {
        // 动画完成
        setCurrentTargetIndex(nextTargetIndex);
        setNextTargetIndex(null);
        setIsAnimating(false);
        return 0;
      }
      
      return newProgress;
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isAnimating, nextTargetIndex]);
  
  // 启动动画循环
  useEffect(() => {
    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animate]);
  
  // 设置每秒自动切换定时器
  useEffect(() => {
    // 每1秒切换到下一个目标点
    timerRef.current = setInterval(() => {
      switchToNextTarget();
    }, 1000);
    
    // 组件卸载时清除定时器
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [switchToNextTarget]);
  
  // 预加载图片
  useEffect(() => {
    const img = new Image();
    img.src = researchAreaImg;
    img.onload = () => {
      setImgElement(img);
    };
  }, []);
  
  // 创建光泽红点的渐变样式
  const createGlossyRedGradient = (ctx, x, y, radius) => {
    const gradient = ctx.createRadialGradient(
      x - radius * 0.3, y - radius * 0.3, radius * 0.1, // 高光位置
      x, y, radius // 整个渐变范围
    );
    
    // 亮红色的高光
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.1, 'rgba(255, 50, 50, 0.9)');
    
    // 过渡到深红色
    gradient.addColorStop(0.6, 'rgba(220, 0, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(180, 0, 0, 0.7)');
    
    return gradient;
  };
  
  // 在Canvas中绘制图片、射线和红点
  const renderFrame = useCallback(() => {
    if (!canvasRef.current || !imgElement) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 根据容器宽度调整Canvas大小，保持图片比例
    const containerWidth = canvas.parentElement?.clientWidth || 800;
    const aspectRatio = imgElement.height / imgElement.width;
    
    canvas.width = containerWidth;
    canvas.height = containerWidth * aspectRatio;
    
    // 首先在Canvas上绘制图片
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    
    // 使用百分比坐标计算实际像素位置
    const startX = (headPosition.x / 100) * canvas.width;
    const startY = (headPosition.y / 100) * canvas.height;
    
    // 计算当前结束点位置（不带抖动）
    let endX, endY;
    let currentTargetPos = { x: 0, y: 0 };
    
    if (isAnimating && nextTargetIndex !== null) {
      // 在动画过程中，计算当前位置和下一个位置之间的插值
      const currentTarget = targetPositions[currentTargetIndex];
      const nextTarget = targetPositions[nextTargetIndex];
      
      // 线性插值计算当前动画位置（百分比坐标）
      currentTargetPos.x = (1 - animationProgress) * currentTarget.x + animationProgress * nextTarget.x;
      currentTargetPos.y = (1 - animationProgress) * currentTarget.y + animationProgress * nextTarget.y;
    } else {
      // 非动画状态，直接使用当前目标点
      const currentTarget = targetPositions[currentTargetIndex];
      currentTargetPos.x = currentTarget.x;
      currentTargetPos.y = currentTarget.y;
    }
    
    // 转换为像素坐标（线不抖动）
    endX = (currentTargetPos.x / 100) * canvas.width;
    endY = (currentTargetPos.y / 100) * canvas.height;
    
    // 绘制灰色射线
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#888888'; // 灰色射线
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 计算红点位置（带抖动）
    const jitteredPos = {
      x: currentTargetPos.x + jitterRef.current.x,
      y: currentTargetPos.y + jitterRef.current.y
    };
    
    // 转换为像素坐标
    const dotX = (jitteredPos.x / 100) * canvas.width;
    const dotY = (jitteredPos.y / 100) * canvas.height;
    
    // 绘制光泽红点
    const dotRadius = canvas.width * 0.01; // 点大小为画布宽度的1%
    
    // 创建光泽渐变
    const glossyGradient = createGlossyRedGradient(ctx, dotX, dotY, dotRadius);
    
    // 绘制主点
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = glossyGradient;
    ctx.fill();
    
    // 添加外发光效果
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius * 1.3, 0, Math.PI * 2);
    const glowGradient = ctx.createRadialGradient(
      dotX, dotY, dotRadius * 0.8,
      dotX, dotY, dotRadius * 1.3
    );
    glowGradient.addColorStop(0, 'rgba(255, 50, 50, 0.5)');
    glowGradient.addColorStop(1, 'rgba(255, 50, 50, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fill();
    
    // 请求下一帧
    renderFrameRef.current = requestAnimationFrame(renderFrame);
  }, [imgElement, currentTargetIndex, nextTargetIndex, animationProgress, isAnimating, headPosition, targetPositions]);
  
  // 启动持续渲染循环
  useEffect(() => {
    renderFrameRef.current = requestAnimationFrame(renderFrame);
    
    return () => {
      if (renderFrameRef.current) {
        cancelAnimationFrame(renderFrameRef.current);
      }
    };
  }, [renderFrame]);
  
  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      // 窗口大小变化时会自动重新渲染
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="flex justify-start items-start w-full h-full p-8">
      <div className="relative w-4/5 max-w-4xl">
        {/* 单一Canvas元素用于绘制图片和射线 */}
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          onClick={switchToNextTarget} // 点击仍然可以手动切换
        />
      </div>
    </div>
  );
};

export default HCISection;
