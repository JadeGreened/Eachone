import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import researchAreaImg from '../assets/Home/ResearchArea.png';

const HCISection = () => {
  // Canvas和动画相关的ref
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  const jitterRef = useRef({ x: 0, y: 0 });
  const renderFrameRef = useRef(null);
  
  // 红点动画状态
  const [imgElement, setImgElement] = useState(null);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [nextTargetIndex, setNextTargetIndex] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 严格使用百分比坐标 (0-100%)
  const headPosition = { x: 20, y: 41.5 }; // 头部HMD位置 - 百分比坐标
  
  // 定义关键位置
  const startArea = { x: 60, y: 31 }; // start area位置
  const endArea = { x: 95, y: 61 };   // end area位置

  // 目标位置数组
  const targetPositions = [
    { x: 70, y: 28 },    // 目标位置1
    { x: 60, y: 31 },    // 目标位置2
    { x: 95, y: 61 }     // 目标位置3
  ];

  // 白球相关ref状态（使用ref避免频繁重渲染）
  const ballPositionRef = useRef(startArea);
  const ballJitterRef = useRef({ x: 0, y: 0 });
  const gazeStateRef = useRef({
    currentPos: { x: 0, y: 0 },
    lastPos: { x: 0, y: 0 },
    isAtStart: false,
    startTime: null,
    shouldFollow: false,
    canStartFollowing: true
  });

  // 缓存白球移动方向计算
  const ballMoveConfig = useMemo(() => {
    const direction = {
      x: endArea.x - startArea.x,
      y: endArea.y - startArea.y
    };
    const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    return {
      normalized: {
        x: direction.x / length,
        y: direction.y / length
      },
      length
    };
  }, [startArea.x, startArea.y, endArea.x, endArea.y]);

  // 检测位置是否匹配的函数（允许一定误差）
  const isPositionMatch = useCallback((pos1, pos2, tolerance = 2) => {
    return Math.abs(pos1.x - pos2.x) <= tolerance && Math.abs(pos1.y - pos2.y) <= tolerance;
  }, []);

  // Box-Muller变换生成正态分布随机数
  const generateGaussian = useCallback((mean = 0, stdDev = 1) => {
    const u1 = Math.random();
    const u2 = Math.random();
    
    // 避免u1为0
    const rand_std_normal = Math.sqrt(-2.0 * Math.log(u1 || 0.000001)) * 
                            Math.cos(2.0 * Math.PI * u2);
                            
    // 转换为指定均值和标准差的正态分布
    return mean + stdDev * rand_std_normal;
  }, []);

  // 合并的抖动更新循环
  useEffect(() => {
    let lastTime = Date.now();
    
    const updateLoop = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      
      // 每50ms更新一次抖动
      if (deltaTime >= 50) {
        // 更新红点抖动
        jitterRef.current = {
          x: generateGaussian(0, 1.2),
          y: generateGaussian(0, 1.2)
        };
        
        // 更新白球抖动
        if (gazeStateRef.current.shouldFollow) {
          const jitterIntensity = generateGaussian(0, 1.5); // 白球抖动强度
          ballJitterRef.current = {
            x: ballMoveConfig.normalized.x * jitterIntensity,
            y: ballMoveConfig.normalized.y * jitterIntensity
          };
        } else {
          ballJitterRef.current = { x: 0, y: 0 };
        }
        
        lastTime = currentTime;
      }
      
      requestAnimationFrame(updateLoop);
    };
    
    updateLoop();
  }, [ballMoveConfig.normalized.x, ballMoveConfig.normalized.y, generateGaussian]);

  // 切换到下一个目标点，带动画效果
  const switchToNextTarget = useCallback(() => {
    if (isAnimating) return; // 如果正在动画中，不执行新的切换
    
    const nextIndex = (currentTargetIndex + 1) % targetPositions.length;
    setNextTargetIndex(nextIndex);
    setIsAnimating(true);
    setAnimationProgress(0);
  }, [currentTargetIndex, isAnimating, targetPositions.length]);

  // 处理红点动画
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

  // 创建光泽红点的渐变样式
  const createGlossyRedGradient = useCallback((ctx, x, y, radius) => {
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
  }, []);

  // 创建光泽米白色球的渐变样式
  const createGlossyCreamGradient = useCallback((ctx, x, y, radius) => {
    const gradient = ctx.createRadialGradient(
      x - radius * 0.3, y - radius * 0.3, radius * 0.1, // 高光位置
      x, y, radius // 整个渐变范围
    );
    
    // 白色高光
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(0.1, 'rgba(230, 228, 228, 0.9)');
    
    // 过渡到米白色 (208, 206, 206)
    gradient.addColorStop(0.6, 'rgba(208, 206, 206, 0.9)');
    gradient.addColorStop(1, 'rgba(188, 186, 186, 0.8)');
    
    return gradient;
  }, []);

  // 主渲染循环
  const renderFrame = useCallback(() => {
    if (!canvasRef.current || !imgElement) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Canvas设置
    const containerWidth = canvas.parentElement?.clientWidth || 800;
    const aspectRatio = imgElement.height / imgElement.width;
    
    canvas.width = containerWidth;
    canvas.height = containerWidth * aspectRatio;
    
    // 清空并绘制背景
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    
    // 计算当前视线位置
    let currentGazePos = { x: 0, y: 0 };
    
    if (isAnimating && nextTargetIndex !== null) {
      const currentTarget = targetPositions[currentTargetIndex];
      const nextTarget = targetPositions[nextTargetIndex];
      
      currentGazePos.x = (1 - animationProgress) * currentTarget.x + animationProgress * nextTarget.x;
      currentGazePos.y = (1 - animationProgress) * currentTarget.y + animationProgress * nextTarget.y;
    } else {
      const currentTarget = targetPositions[currentTargetIndex];
      currentGazePos.x = currentTarget.x;
      currentGazePos.y = currentTarget.y;
    }
    
    // 白球逻辑处理（使用ref，避免状态更新）
    const gazeState = gazeStateRef.current;
    const currentlyAtStart = isPositionMatch(currentGazePos, startArea, 3);
    const currentlyAtEnd = isPositionMatch(currentGazePos, endArea, 3);
    
    // 处理白球状态变化
    if (currentlyAtEnd && gazeState.shouldFollow) {
      gazeState.shouldFollow = false;
      gazeState.canStartFollowing = false;
      gazeState.isAtStart = false;
      gazeState.startTime = null;
      ballPositionRef.current = startArea;
    } else if (!gazeState.shouldFollow && !gazeState.canStartFollowing) {
      if (!currentlyAtStart) {
        gazeState.canStartFollowing = true;
      }
    } else if (currentlyAtStart && !gazeState.shouldFollow && gazeState.canStartFollowing) {
      if (!gazeState.isAtStart) {
        gazeState.isAtStart = true;
        gazeState.startTime = Date.now();
      }
    } else if (!currentlyAtStart && gazeState.isAtStart) {
      if (gazeState.startTime && (Date.now() - gazeState.startTime >= 1000)) {
        gazeState.shouldFollow = true;
      }
      gazeState.isAtStart = false;
      gazeState.startTime = null;
    }
    
    // 更新白球位置
    if (gazeState.shouldFollow) {
      ballPositionRef.current = {
        x: currentGazePos.x + ballJitterRef.current.x,
        y: currentGazePos.y + ballJitterRef.current.y
      };
    } else {
      ballPositionRef.current = startArea;
    }
    
    gazeState.lastPos = currentGazePos;
    
    // 绘制（顺序：射线 → 红点 → 白球）
    // 1. 射线
    const startX = (headPosition.x / 100) * canvas.width;
    const startY = (headPosition.y / 100) * canvas.height;
    const endX = (currentGazePos.x / 100) * canvas.width;
    const endY = (currentGazePos.y / 100) * canvas.height;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 2. 红点
    const jitteredPos = {
      x: currentGazePos.x + jitterRef.current.x,
      y: currentGazePos.y + jitterRef.current.y
    };
    const dotX = (jitteredPos.x / 100) * canvas.width;
    const dotY = (jitteredPos.y / 100) * canvas.height;
    const dotRadius = canvas.width * 0.01;
    
    // 红点外发光
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
    
    // 红点主体
    const glossyGradient = createGlossyRedGradient(ctx, dotX, dotY, dotRadius);
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = glossyGradient;
    ctx.fill();
    
    // 3. 白球（最上层）
    const ballPos = ballPositionRef.current;
    const ballX = (ballPos.x / 100) * canvas.width;
    const ballY = (ballPos.y / 100) * canvas.height;
    const ballRadius = canvas.width * 0.055;
    
    // 白球外发光
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius * 1.2, 0, Math.PI * 2);
    const ballGlowGradient = ctx.createRadialGradient(
      ballX, ballY, ballRadius * 0.8,
      ballX, ballY, ballRadius * 1.2
    );
    ballGlowGradient.addColorStop(0, 'rgba(208, 206, 206, 0.4)');
    ballGlowGradient.addColorStop(1, 'rgba(208, 206, 206, 0)');
    ctx.fillStyle = ballGlowGradient;
    ctx.fill();
    
    // 白球主体
    const creamGradient = createGlossyCreamGradient(ctx, ballX, ballY, ballRadius);
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = creamGradient;
    ctx.fill();
    
    renderFrameRef.current = requestAnimationFrame(renderFrame);
  }, [imgElement, currentTargetIndex, nextTargetIndex, animationProgress, isAnimating, targetPositions, headPosition, isPositionMatch, startArea, endArea, createGlossyRedGradient, createGlossyCreamGradient]);
  
  // 启动红点动画循环
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
    timerRef.current = setInterval(() => {
      switchToNextTarget();
    }, 1000);
    
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
  
  // 启动持续渲染循环
  useEffect(() => {
    renderFrameRef.current = requestAnimationFrame(renderFrame);
    
    return () => {
      if (renderFrameRef.current) {
        cancelAnimationFrame(renderFrameRef.current);
      }
    };
  }, [renderFrame]);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto"
    />
  );
};

export default HCISection;
