import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import ResearchAreaCard from '../components/ResearchAreaCard';
import PublicationCard from '../components/PublicationCard';
import Header from '../components/Header';
import GazeJitterSection from '../components/GazeJitterSection';
import { getR2VideoPath, getR2ImagePath, R2_VIDEOS, R2_IMAGES } from '../utils/r2Utils';
import { Canvas } from '@react-three/fiber';
import ScrollClouds from "../components/ScrollClouds"
import { CameraControls } from "@react-three/drei"
import { Clouds, Cloud } from "@react-three/drei"
import { Leva } from "leva"
import '../styles/cloud-text.css';



const CharacterOverlay = ({ setOpen }) => {
  const [hovered, setHovered] = useState(false);  

  return (
    <>
      {/* 可交互蒙层 */}
      <motion.div
        className="absolute cursor-pointer"
        style={{
          top: '65%',           // 已经是百分比
          left: '45%',          // 已经是百分比
          width: '25%',         // 已经是百分比
          height: '60%',        // 已经是百分比
          transform: 'translate(-50%, -50%)',
          borderRadius: '8px',
          zIndex: 3,
          backgroundColor: '#000',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
        initial={false}
        animate={{ opacity: hovered ? 0.35 : 0 }}
        transition={{ duration: 0.25 }}
      />
    </>
  );
};

// 新增侧边人物蒙层组件
const SideCharacterOverlay = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        top: '65%',           // 已经是百分比
        left: '15%',          // 已经是百分比
        width: '20%',         // 已经是百分比
        height: '60%',        // 已经是百分比
        transform: 'translate(-50%, -50%)',
        borderRadius: '8px',
        zIndex: 3,
        backgroundColor: '#000',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: hovered ? 0.35 : 0 }}
      transition={{ duration: 0.25 }}
    />
  );
};

const HomeTailwind = () => {
  const location = useLocation();
  const { scrollY } = useScroll();
  // 使用一个状态表示当前页面：'background' 或 'character'
  const [currentPage, setCurrentPage] = useState('character');
  // 是否已经播放完onSelected视频
  const [onSelectedFinished, setOnSelectedFinished] = useState(false)
  // 是否是首次访问（用于控制引导提示和滚动限制）
  const [isFirstVisit] = useState(false);
  const [currentProject, setCurrentProject] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // 添加对onSelectedVideo的引用
  const onSelectedVideoRef = useRef(null);
  // 添加对页面主体的引用，用于控制滚动
  const mainContentRef = useRef(null);
  const standStillRef = useRef(null);

  // const bgColor = useTransform(
  //   scrollY,
  //   [0, 600],                 // 同你 heroOpacity 的区间
  //   ["#eae7d9", "#ffffff"]    // 顶部米白 → 滚动后纯白
  // );
  
  const [selectedReady, setSelectedReady] = useState(false);
  const [stillReady, setStillReady] = useState(false);

  const posterVariants = {
    loading: { opacity: 1 },
    ready:   { opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };
  
  const videoVariants = {
    loading: { opacity: 0 },                 // ← 去掉 x
    ready:   { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };
  
  // 2. 根据 selectedReady 计算当前状态
  const motionState = selectedReady ? 'ready' : 'loading';

  
  // Optimized scroll-based animations
  /* 滚动位置 */
  const handleVideoReady = () => {
    setIsReady(true);
  };

  /* 1. 垂直位移：0px→0，500px→-120px */
  // const heroY = useTransform(scrollY, [0, 500], [0, -120]);
  const heroY = 0;

  /* 2. 透明度：固定为1，不随滚动变化 */
  // const heroOpacity = useSpring(
  //   useTransform(scrollY, [0, 600], [1, 0]),
  //   { stiffness: 120, damping: 25 }
  // );
  const heroOpacity = 1;
  const bgColor = "rgb(249, 248, 241)";

  // 切换到角色页面
  const switchToCharacterPage = () => {
    setCurrentPage('character');
    setOnSelectedFinished(false); // 重置视频播放状态
    // 确保在下一个渲染周期重置视频
    setTimeout(() => {
      if (onSelectedVideoRef.current) {
        onSelectedVideoRef.current.currentTime = 0; // 重置视频到开始位置
        onSelectedVideoRef.current.play(); // 确保视频播放
      }
    }, 50);
  };

  // 切换回背景页面
  const switchToBackgroundPage = () => {
    setCurrentPage('background');
  };

  useEffect(() => {
    if (onSelectedFinished && standStillRef.current) {
      // 让待机视频从头播
      standStillRef.current.currentTime = 0;
      standStillRef.current.play();
    }
  }, [onSelectedFinished]);

  // 处理锚点滚动
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      // 延迟一下让页面完全加载
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300); // 增加延迟时间确保页面完全加载
    }
  }, [location]);




  // Optimized project change handler
  const handleProjectChange = useCallback((index) => {
    setCurrentProject(index);
  }, []);

  // 处理侧边人物点击事件
  const handleSideCharacterClick = () => {
    switchToBackgroundPage();
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center text-black relative"
      style={{
        backgroundColor: bgColor,
        fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif',
        userSelect: 'text',
        WebkitUserSelect: 'text', // 添加WebKit前缀
        MozUserSelect: 'text', // 添加Mozilla前缀
        msUserSelect: 'text', // 添加Microsoft前缀
        pointerEvents: 'auto', // 确保指针事件正常工作
        '--base-font-size': 'calc(0.8rem + 0.5vw)', // 基础字体大小变量
      }}
    >
      <Leva hidden />
      <Header />

      {/* Hero Section */}
      
      <motion.section
          id="about"
          className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity, paddingTop: '80px' }} 
        >

          {/* 视频背景 - 只在大屏幕显示 */}
          <motion.video
            src={R2_VIDEOS.backgroundLoop}
            autoPlay
            loop
            muted
            playsInline
            onCanPlayThrough={handleVideoReady}
            initial={{ opacity: currentPage === 'background' ? 1 : 0 }} 
            animate={{ opacity: currentPage === 'background' ? 1 : 0 }}
            className="absolute left-0 right-0 bottom-0 w-full object-cover hidden md:block"
            style={{ top: '8%', height: '92%', zIndex: 1 }}
            transition={{ duration: 0.5 }}
          />
          {/* onSelected 视频 - 只在大屏幕显示 */}
          <motion.img
            src={R2_IMAGES.yichuanPoster}
            className="absolute left-0 object-cover hidden md:block"
            style={{ top: '8%', height: '92%', width: '30%', objectPosition: 'center 5%', zIndex: 1 }}
            variants={posterVariants}
            initial="loading"
            animate={motionState}
            transition={{ duration: 0 }}
          />
          <motion.video
            ref={onSelectedVideoRef}
            src={R2_VIDEOS.onSelected}
            autoPlay
            muted
            playsInline
            preload="auto"
            onCanPlayThrough={() => setSelectedReady(true)}
            onEnded={() => setOnSelectedFinished(true)}
            className="absolute left-0 object-cover hidden md:block"
            style={{ top: '8%', height: '92%', width: '30%', objectPosition: 'center 5%', zIndex: 1 }}
            variants={videoVariants}
            initial="loading"
            animate={currentPage === 'character' && !onSelectedFinished ? motionState : 'loading'}
            transition={{ duration: 0 }}
          />
          {/* StandStill 视频 - 只在大屏幕显示 */}
          <motion.img
            src={R2_IMAGES.yichuanPoster}
            alt=""
            className="absolute left-0 object-cover hidden md:block"
            style={{ top: '8%', height: '92%', width: '30%', objectPosition: 'center 5%', zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: onSelectedFinished
                ? (stillReady ? 0 : 1) 
                : 0
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.video
            ref={standStillRef}
            src={R2_VIDEOS.standStill}
            loop
            muted
            playsInline
            preload="auto"
            onCanPlayThrough={() => setStillReady(true)}
            className="absolute left-0 object-cover hidden md:block"
            style={{ top: '8%', height: '92%', width: '30%', objectPosition: 'center 5%', zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentPage === 'character' && onSelectedFinished && stillReady ? 1 : 0
            }}
            transition={{ duration: 0, ease: 'easeOut' }}
          />
          {/* 视频区域蒙层 - 只在大屏幕显示 */}
          <div
            className="absolute left-0 right-0 bottom-0 pointer-events-none hidden md:block"
            style={{
              zIndex: 2,
              top: '8%',
              backgroundColor: 'rgba(249, 248, 241, 0.7)',
            }}
          />
          {/* 可交互人物蒙层 */}
          <div className="absolute top-0 left-0 right-0 bottom-0">
            {currentPage === 'character' && (
              <SideCharacterOverlay onClick={handleSideCharacterClick} />
            )}
            {currentPage === 'background' && (
              <CharacterOverlay setOpen={switchToCharacterPage} />
            )}
          </div>
        
      
        
        {/* 文字内容 */}
        
        {!isFirstVisit && (
          <>
            {/* 大屏幕文字布局 */}
            <motion.div 
              className="absolute text-left hidden md:block"
              style={{ 
                fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                width: 'clamp(500px, 50%, 1200px)',
                userSelect: 'text',
                right: '10%', 
                top: '20%',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="font-bold mb-8"
                style={{ 
                  fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                  fontStyle: 'italic',
                  letterSpacing: '0.5px',
                  lineHeight: '1.1',
                  fontSize: 'clamp(2.5rem, 5vw, 6rem)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                Hi There! I'm<br />
                Yichuan (Eachone)<br />
                Zhang.
              </motion.h1>
              
              <motion.div 
                className="w-40 h-0.5 bg-black mb-10"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 160 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              ></motion.div>
              
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 2 }}
                style={{
                  fontSize: 'clamp(1rem, 1.3vw, 1.8rem)',
                  lineHeight: '1.2',
                  maxWidth: '100%',
                }}
              >
                <p>
                  I am Yichuan Zhang, a senior majoring in Information and Computing Science at Xi'an Jiaotong-Liverpool University (XJTLU).
                </p>
                <p>
                  Currently, I work as a Research Assistant at the X-CHI Lab under the guidance of Professor Hai-Ning Liang at HKUST-GZ.
                </p>
                

              </motion.div>

                             {/* 机构图标 - 大屏幕版本 */}
               <motion.div 
                 className="flex items-center justify-between mt-12"
                 style={{ width: '100%', maxWidth: '100%' }}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 3 }}
               >
                {/* Memories.ai Icon */}
                <div className="flex items-center text-gray-800" style={{ gap: 'clamp(0.5rem, 1vw, 1rem)' }}>
                  <div 
                    className="bg-gray-800 rounded flex items-center justify-center"
                    style={{ 
                      width: 'clamp(2rem, 3vw, 3.5rem)',
                      height: 'clamp(2rem, 3vw, 3.5rem)'
                    }}
                  >
                    <span 
                      className="text-white font-bold"
                      style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.5rem)' }}
                    >
                      M
                    </span>
                  </div>
                  <span 
                    className="font-semibold"
                    style={{ fontSize: 'clamp(1rem, 1.8vw, 2rem)' }}
                  >
                    Memories.ai
                  </span>
                </div>

                {/* HKUST Icon */}
                <div className="flex items-center text-gray-800" style={{ gap: 'clamp(0.5rem, 1vw, 1rem)' }}>
                  <div 
                    className="bg-gray-800 rounded-full flex items-center justify-center"
                    style={{ 
                      width: 'clamp(2rem, 3vw, 3.5rem)',
                      height: 'clamp(2rem, 3vw, 3.5rem)'
                    }}
                  >
                    <span 
                      className="text-white font-bold"
                      style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.5rem)' }}
                    >
                      H
                    </span>
                  </div>
                  <span 
                    className="font-semibold"
                    style={{ fontSize: 'clamp(1rem, 1.8vw, 2rem)' }}
                  >
                    HKUST-GZ
                  </span>
                </div>

                {/* XJTLU Icon */}
                <div className="flex items-center text-gray-800" style={{ gap: 'clamp(0.5rem, 1vw, 1rem)' }}>
                  <div 
                    className="bg-gray-800 rounded flex items-center justify-center"
                    style={{ 
                      width: 'clamp(2rem, 3vw, 3.5rem)',
                      height: 'clamp(2rem, 3vw, 3.5rem)'
                    }}
                  >
                    <span 
                      className="text-white font-bold"
                      style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.5rem)' }}
                    >
                      X
                    </span>
                  </div>
                  <span 
                    className="font-semibold"
                    style={{ fontSize: 'clamp(1rem, 1.8vw, 2rem)' }}
                  >
                    XJTLU
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* 小屏幕文字布局 - 居中显示 */}
            <motion.div 
              className="absolute text-center md:hidden px-4"
              style={{ 
                fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                width: '100%',
                userSelect: 'text',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                paddingTop: '80px', // 为Header留出空间
                marginTop: '-40px', // 调整整体位置，避免过度下移
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="font-bold mb-4"
                style={{ 
                  fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                  fontStyle: 'italic',
                  letterSpacing: '0.5px',
                  lineHeight: '1.1',
                  fontSize: 'clamp(1.75rem, 7vw, 3rem)', // 稍微减小最小字体，适配极小屏幕
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                Hi There! I'm<br />
                Yichuan (Eachone)<br />
                Zhang.
              </motion.h1>
              
              <motion.div 
                className="w-24 h-0.5 bg-black mb-6 mx-auto"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 96 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              ></motion.div>
              
              <motion.div 
                className="space-y-3 max-w-sm mx-auto px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 2 }}
                style={{
                  fontSize: 'clamp(0.85rem, 3.5vw, 1.2rem)', // 进一步优化小屏幕字体
                  lineHeight: '1.5',
                }}
              >
                <p>
                  I am Yichuan Zhang, a senior majoring in Information and Computing Science at Xi'an Jiaotong-Liverpool University (XJTLU).
                </p>
                <p>
                  Currently, I work as a Research Assistant at the X-CHI Lab under the guidance of Professor Hai-Ning Liang at HKUST-GZ.
                </p>
              
              </motion.div>

              {/* 机构图标 - 小屏幕版本 */}
              <motion.div 
                className="flex flex-col items-center gap-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 3 }}
              >
                {/* Memories.ai Icon */}
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">M</span>
                  </div>
                  <span className="font-semibold text-base">Memories.ai</span>
                </div>

                {/* HKUST Icon */}
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">H</span>
                  </div>
                  <span className="font-semibold text-base">HKUST-GZ</span>
                </div>

                {/* XJTLU Icon */}
                <div className="flex items-center gap-2 text-gray-800">
                  <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">X</span>
                  </div>
                  <span className="font-semibold text-base">XJTLU</span>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}

        {/* 装饰性图标 - 只在大屏幕显示 */}
        <div className="hidden md:block">
          <div className="absolute" style={{ top: '-5%', right: '5%', fontSize: '1.5rem', opacity: 0.5 }}>✦</div>
          <div className="absolute" style={{ top: '5%', right: '-15%' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor" fillOpacity="0.7"/>
              <ellipse cx="12" cy="12" rx="5" ry="5" fill="currentColor" fillOpacity="0.5" />
            </svg>
          </div>
          <div className="absolute" style={{ bottom: '20%', right: '-10%', fontSize: '2rem', opacity: 0.5 }}>✧</div>
          <div className="absolute" style={{ bottom: '-5%', right: '15%', fontSize: '1.8rem', opacity: 0.5 }}>✦</div>
          <div className="absolute" style={{ bottom: '15%', right: '-20%' }}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.7 2.7C18.9 3.8 23.3 9.5 22.2 15.8C21.1 22 15.4 26.4 9.2 25.3C3 24.2 -1.4 18.5 -0.3 12.3C0.8 6 6.5 1.6 12.7 2.7Z" fill="currentColor" fillOpacity="0.1" />
              <path d="M5 18L19 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M19 18V4H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        </motion.section>
       <div className="w-full h-px bg-gray-300"></div>
       {/* HCI/AI Section */}

      <section id="research" className="relative w-full min-h-screen overflow-auto bg-[rgb(249,248,241)]" style={{ padding: 'clamp(4rem, 6vh, 8rem) clamp(0.75rem, 6vw, 8rem)' }}>
        <div 
          className="w-full h-full flex flex-col lg:flex-row" 
          style={{ 
            fontSize: 'clamp(0.875rem, 1vw, 1.1rem)',
            gap: 'clamp(1rem, 6vw, 8rem)'
          }}
        >
          
          {/* 左边部分 - 在小屏幕上100%，大屏幕上40% */}
          <div className="w-full lg:w-[40%] flex-shrink-0">
            {/* 标题 */}
            <h1 
              className="font-bold text-gray-800 mb-3 sm:mb-6" 
              style={{ 
                fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                fontStyle: 'italic',
                letterSpacing: '0.5px',
                lineHeight: '1.1',
                fontSize: 'clamp(1.25rem, 3.5vw, 4rem)'
              }}
            >
              I am a HCI/HAI researcher
            </h1>
            
            {/* My Favourite Work 部分 */}
            <div className="mb-3 sm:mb-6">
              <h2 
                className="font-semibold text-gray-700 mb-3"
                style={{ fontSize: 'clamp(0.875rem, 1.1vw, 1.3rem)' }}
              >
                <span className="block sm:hidden">
                  My Favourite Work! ISMAR 2025 Best Paper Nomination
                </span>
                <span className="hidden sm:block">
                  My Favourite Work! 2025 ISMAR TVCG Track Best Paper Nomination Award
                </span>
              </h2>
              
              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-6">
                <span style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.8rem)' }}>🏆</span>
                <div>
                  <h3 
                    className="font-bold text-gray-800 mb-2 italic"
                    style={{ 
                      fontSize: 'clamp(1rem, 1.3vw, 1.6rem)',
                      lineHeight: '1.4'
                    }}
                  >
                    <span className="block sm:hidden">
                      Exploring Eye-Tracking Effects...
                    </span>
                    <span className="hidden sm:block">
                      Exploring and Modeling the Effects of Eye-Tracking Accuracy and Precision on Gaze-Based Steering in Virtual Environments
                    </span>
                  </h3>
                  <p 
                    className="text-gray-600 italic"
                    style={{ fontSize: 'clamp(0.875rem, 1.1vw, 1.25rem)' }}
                  >
                    <span className="block sm:hidden">
                      X. Hu, Y. Zhang, et al.
                    </span>
                    <span className="hidden sm:block">
                      X. Hu, Y. Zhang, Y. Wei, L. Zhang, Y. Li, W. Stuerzlinger, H. Liang
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* GazeJitter组件 */}
            <div className="mb-3 sm:mb-6 border border-gray-300 rounded-lg overflow-hidden">
              <GazeJitterSection />
            </div>

            {/* 研究兴趣描述 */}
            <div 
              className="text-gray-700 leading-relaxed"
              style={{ 
                fontSize: 'clamp(0.8rem, 0.95vw, 1.1rem)',
                lineHeight: '1.6'
              }}
            >
              <p className="block sm:hidden">
                HCI/HAI researcher focused on intelligent systems for immersive and mobile scenarios. 
                Working on AI-augmented interfaces combining eye-tracking, body motion, and transformers 
                for enhanced user interaction.
              </p>
              <p className="hidden sm:block">
                I am an HCI/HAI (Human-Computer/AI Interaction) researcher with a strong interest in 
                designing intelligent systems that enhance user interaction in immersive and mobile 
                scenarios. My work spans AI agent behavior and VR/AR input techniques. I've explored gaze-
                based navigation, combining user studies with system implementation. Currently, I focus on 
                integrating AI models—such as transformers—with sensor data like eye-tracking and body 
                motion to enhance input performance in dynamic environments. My long-term goal is to 
                build adaptive, AI-augmented interfaces that support seamless interaction across varied 
                contexts.
              </p>
            </div>
          </div>

          {/* 右边部分 - 在小屏幕上100%，大屏幕上60% */}
          <div className="w-full lg:w-[60%] flex flex-col">
            {/* Other Publication 标题 */}
            <h2 
              className="font-bold text-gray-800 mb-2 sm:mb-4"
              style={{ fontSize: 'clamp(1.125rem, 1.6vw, 2rem)' }}
            >
              Total Publication
            </h2>
            
            {/* 项目列表 */}
            <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 2.5rem)' }}>
              {/* 项目1 */}
              <div 
                className="flex bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
                style={{ 
                  gap: 'clamp(0.75rem, 1.5vw, 2rem)',
                  padding: 'clamp(0.75rem, 1.2vw, 1.5rem)'
                }}
              >
                <div 
                  className="rounded flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ 
                    width: '30%',
                    height: 'clamp(4rem, 8vw, 8rem)',
                    minWidth: 'clamp(3rem, 6vw, 6rem)'
                  }}
                >
                  <img 
                    src={R2_IMAGES.projectImage}
                    alt="Project Figure"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div style={{ width: '70%' }}>
                  <h4 
                    className="font-semibold text-gray-800 mb-1 italic"
                    style={{ 
                      fontSize: 'clamp(0.8rem, 0.95vw, 1.1rem)',
                      lineHeight: '1.3'
                    }}
                  >
                    <span className="block sm:hidden">
                      Eye-Tracking Effects in VR...
                    </span>
                    <span className="hidden sm:block">
                      Exploring and Modeling the Effects of Eye-Tracking Accuracy and Precision on Gaze-Based Steering in Virtual Environments
                    </span>
                  </h4>
                  <p 
                    className="text-gray-600 mb-2"
                    style={{ fontSize: 'clamp(0.7rem, 0.8vw, 0.9rem)' }}
                  >
                    <span className="block sm:hidden">
                      X. Hu, Y. Zhang, et al.
                    </span>
                    <span className="hidden sm:block">
                      Xuning Hu, Yichuan Zhang, Yushi Wei, Liangyuting Zhang, Yue Li, Wolfgang Stuerzlinger, Hai-Ning Liang.
                    </span>
                  </p>
                  <p 
                    className="text-gray-500 italic mb-3"
                    style={{ fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)' }}
                  >
                    <span className="block sm:hidden">
                      TVCG (ISMAR 2025)
                    </span>
                    <span className="hidden sm:block">
                      IEEE Conference on Virtual Reality and 3D User Interfaces (TVCG (ISMAR 2025))
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Page
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      DOI
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* 项目2 */}
              <div 
                className="flex bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
                style={{ 
                  gap: 'clamp(0.75rem, 1.5vw, 2rem)',
                  padding: 'clamp(0.75rem, 1.2vw, 1.5rem)'
                }}
              >
                <div 
                  className="rounded flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ 
                    width: '30%',
                    height: 'clamp(4rem, 8vw, 8rem)',
                    minWidth: 'clamp(3rem, 6vw, 6rem)'
                  }}
                >
                  <img 
                    src={R2_IMAGES.projectImage}
                    alt="Project Figure"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div style={{ width: '70%' }}>
                  <h4 
                    className="font-semibold text-gray-800 mb-1"
                    style={{ 
                      fontSize: 'clamp(0.8rem, 0.95vw, 1.1rem)',
                      lineHeight: '1.3'
                    }}
                  >
                    <span className="block sm:hidden">
                      Moving Target Selection in VR...
                    </span>
                    <span className="hidden sm:block">
                      Optimizing Moving Target Selection in VR by Integrating Proximity-Based Feedback Types and Modalities
                    </span>
                  </h4>
                  <p 
                    className="text-gray-600 mb-2"
                    style={{ fontSize: 'clamp(0.7rem, 0.8vw, 0.9rem)' }}
                  >
                    <span className="block sm:hidden">
                      X. Hu, W. Xu, et al.
                    </span>
                    <span className="hidden sm:block">
                      Xuning Hu, Wenxuan Xu, Yushi Wei, Zhang Hao, Jin Huang, Hai-Ning Liang.
                    </span>
                  </p>
                  <p 
                    className="text-gray-500 italic mb-3"
                    style={{ fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)' }}
                  >
                    <span className="block sm:hidden">
                      VR 2025
                    </span>
                    <span className="hidden sm:block">
                      IEEE Conference on Virtual Reality and 3D User Interfaces (VR 2025)
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Page
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      DOI
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* 项目3 */}
              <div 
                className="flex bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
                style={{ 
                  gap: 'clamp(0.75rem, 1.5vw, 2rem)',
                  padding: 'clamp(0.75rem, 1.2vw, 1.5rem)'
                }}
              >
                <div 
                  className="rounded flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ 
                    width: '30%',
                    height: 'clamp(4rem, 8vw, 8rem)',
                    minWidth: 'clamp(3rem, 6vw, 6rem)'
                  }}
                >
                  <img 
                    src={R2_IMAGES.projectImage}
                    alt="Project Figure"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div style={{ width: '70%' }}>
                  <h4 
                    className="font-semibold text-gray-800 mb-1"
                    style={{ 
                      fontSize: 'clamp(0.8rem, 0.95vw, 1.1rem)',
                      lineHeight: '1.3'
                    }}
                  >
                    <span className="block sm:hidden">
                      3D Piloting in Virtual Environments...
                    </span>
                    <span className="hidden sm:block">
                      Exploring the Effects of Spatial Constraints and Curvature for 3D Piloting in Virtual Environments
                    </span>
                  </h4>
                  <p 
                    className="text-gray-600 mb-2"
                    style={{ fontSize: 'clamp(0.7rem, 0.8vw, 0.9rem)' }}
                  >
                    <span className="block sm:hidden">
                      X. Hu, X. Yan, et al.
                    </span>
                    <span className="hidden sm:block">
                      Xuning Hu, Xinan Yan, Yushi Wei, Wenxuan Xu, Yue Li, Yue Liu, Hai-Ning Liang.
                    </span>
                  </p>
                  <p 
                    className="text-gray-500 italic mb-3"
                    style={{ fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)' }}
                  >
                    <span className="block sm:hidden">
                      ISMAR 2024
                    </span>
                    <span className="hidden sm:block">
                      IEEE International Symposium on Mixed & Augmented Reality (ISMAR 2024)
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Page
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      DOI
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* 项目4 */}
              <div 
                className="flex bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
                style={{ 
                  gap: 'clamp(0.75rem, 1.5vw, 2rem)',
                  padding: 'clamp(0.75rem, 1.2vw, 1.5rem)'
                }}
              >
                <div 
                  className="rounded flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ 
                    width: '30%',
                    height: 'clamp(4rem, 8vw, 8rem)',
                    minWidth: 'clamp(3rem, 6vw, 6rem)'
                  }}
                >
                  <img 
                    src={R2_IMAGES.projectImage}
                    alt="Project Figure"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div style={{ width: '70%' }}>
                  <h4 
                    className="font-semibold text-gray-800 mb-1"
                    style={{ 
                      fontSize: 'clamp(0.8rem, 0.95vw, 1.1rem)',
                      lineHeight: '1.3'
                    }}
                  >
                    <span className="block sm:hidden">
                      Gaze-Based Steering in VR...
                    </span>
                    <span className="hidden sm:block">
                      Exploring Gaze-Based Steering Behavior in Virtual Reality
                    </span>
                  </h4>
                  <p 
                    className="text-gray-600 mb-2"
                    style={{ fontSize: 'clamp(0.7rem, 0.8vw, 0.9rem)' }}
                  >
                    <span className="block sm:hidden">
                      X. Hu, Y. Zhang, et al.
                    </span>
                    <span className="hidden sm:block">
                      Xuning Hu, Yichuan Zhang, Yushi Wei, Yue Li, Wolfgang Stuerzlinger, Hai-Ning Liang.
                    </span>
                  </p>
                  <p 
                    className="text-gray-500 italic mb-3"
                    style={{ fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)' }}
                  >
                    <span className="block sm:hidden">
                      CHI LBW 2025
                    </span>
                    <span className="hidden sm:block">
                      ACM CHI Conference on Human Factors in Computing Systems (LBW 2025)
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Page
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      DOI
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Know More Button */}
            <div className="text-right" style={{ marginTop: 'clamp(1.5rem, 4vw, 4rem)' }}>
              <Link to="/works?filter=academic">
                <motion.button 
                  className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg border border-gray-300"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
            
            
          </div>
        </div>
      </section>
            {/* 黑色分割线 */}
            <div 
              className="w-full bg-black"
              style={{ 
                height: '1px',
                marginTop: 'clamp(2rem, 5vw, 5rem)'
              }}
            ></div> 

      {/* VFX & Game Section */}
      <section id="games" className="relative w-full min-h-screen overflow-auto bg-[rgb(249,248,241)]" style={{ padding: 'clamp(4rem, 6vh, 8rem) clamp(0.75rem, 6vw, 8rem)' }}>
        
        {/* 标题 */}
        <div className="flex justify-between items-center mb-12" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
          <div className="text-left">
            <h2 
              className="font-bold text-gray-800 mb-4" 
              style={{ 
                fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                fontStyle: 'italic',
                letterSpacing: '0.5px',
                lineHeight: '1.1',
                fontSize: 'clamp(1.25rem, 3.5vw, 4rem)'
              }}
            >
              I am a VFX & Game developer
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Visual Effects and Game Development Projects
            </p>
          </div>
          <Link to="/works?filter=game-vfx">
            <motion.button 
              className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg border border-gray-300"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            >
              Learn More
            </motion.button>
          </Link>
        </div>

        {/* 不均匀网格布局 */}
        <div className="vfx-grid w-full">
          {/* 分区1 - 大区域 */}
          <div className="vfx-item vfx-item-1 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <div className="relative h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">主要项目</h3>
                <p className="text-purple-100">大型VFX项目展示</p>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* 分区2 - 游戏开发 */}
          <div className="vfx-item vfx-item-2 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <div className="relative h-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
              <div className="text-center text-white p-4">
                <h3 className="text-xl font-bold mb-2">游戏开发</h3>
                <p className="text-green-100">独立游戏项目</p>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* 分区3 - 动画制作 */}
          <div className="vfx-item vfx-item-3 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <div className="relative h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <div className="text-center text-white p-4">
                <h3 className="text-lg font-bold mb-2">动画制作</h3>
                <p className="text-orange-100 text-sm">角色动画</p>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* 分区4 - UI/UX设计 */}
          <div className="vfx-item vfx-item-4 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <div className="relative h-full bg-gradient-to-tl from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white p-4">
                <h3 className="text-lg font-bold mb-2">UI/UX设计</h3>
                <p className="text-indigo-100 text-sm">游戏界面设计</p>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* 分区5 - 粒子系统 */}
          <div className="vfx-item vfx-item-5 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <div className="relative h-full bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center">
              <div className="text-center text-white p-3">
                <h3 className="text-base font-bold mb-1">粒子系统</h3>
                <p className="text-teal-100 text-xs">特效粒子</p>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* 分区6 - 后期合成 */}
          <div className="vfx-item vfx-item-6 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <div className="relative h-full bg-gradient-to-b from-rose-500 to-pink-600 flex items-center justify-center">
              <div className="text-center text-white p-4">
                <h3 className="text-lg font-bold mb-2">后期合成</h3>
                <p className="text-rose-100 text-sm">视觉合成</p>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .vfx-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(3, 1fr);
            gap: 1.5rem;
            height: 85vh;
            min-height: 700px;
            width: 100%;
            padding: 0 2rem;
          }

          .vfx-item-1 { grid-area: 1 / 1 / 3 / 3; } /* 大区域 2x2 */
          .vfx-item-2 { grid-area: 3 / 1 / 4 / 3; } /* 底部左区域 2x1 */
          .vfx-item-3 { grid-area: 1 / 3 / 2 / 5; } /* 顶部右区域 2x1 */
          .vfx-item-4 { grid-area: 2 / 3 / 4 / 4; } /* 右侧高区域 1x2 */
          .vfx-item-5 { grid-area: 2 / 4 / 3 / 5; } /* 右中区域 1x1 */
          .vfx-item-6 { grid-area: 3 / 4 / 4 / 5; } /* 右下区域 1x1 */

          @media (max-width: 1024px) {
            .vfx-grid {
              grid-template-columns: repeat(4, 1fr);
              grid-template-rows: repeat(4, 1fr);
              padding: 0 1.5rem;
            }
            
            .vfx-item-1 { grid-area: 1 / 1 / 3 / 3; }
            .vfx-item-2 { grid-area: 1 / 3 / 2 / 5; }
            .vfx-item-3 { grid-area: 2 / 3 / 3 / 5; }
            .vfx-item-4 { grid-area: 3 / 1 / 5 / 3; }
            .vfx-item-5 { grid-area: 3 / 3 / 4 / 5; }
            .vfx-item-6 { grid-area: 4 / 3 / 5 / 5; }
          }

          @media (max-width: 768px) {
            .vfx-grid {
              grid-template-columns: repeat(2, 1fr);
              grid-template-rows: repeat(6, 1fr);
              gap: 1rem;
              padding: 0 1rem;
            }
            
            .vfx-item-1 { grid-area: 1 / 1 / 3 / 3; }
            .vfx-item-2 { grid-area: 3 / 1 / 4 / 3; }
            .vfx-item-3 { grid-area: 4 / 1 / 5 / 3; }
            .vfx-item-4 { grid-area: 5 / 1 / 7 / 2; }
            .vfx-item-5 { grid-area: 5 / 2 / 6 / 3; }
            .vfx-item-6 { grid-area: 6 / 2 / 7 / 3; }
          }
        `}</style>
          
        
      </section>

        {/* ——— 云层横幅，用 vh 替代 px ——— */}
        <section id="uiux" className="relative w-full h-[100vh] overflow-hidden" style={{ paddingTop: '80px' }}>

        <Canvas
            className="w-full h-full bg-[rgb(249,248,241)]"
            camera={{ position: [0, 0, 25], fov: 75 }}  // 调整相机位置
            rotation={[Math.PI / 4, 0, 0]}  // 调整视角角度
            dpr={[1, 1.5]}  // 确认设备像素比是否过高
            gl={{ alpha: true  }}  // 不使用透明背景
          >


          <ambientLight intensity={Math.PI / 1.5} />
          <ScrollClouds />
          {/* <CameraControls /> */}
        </Canvas>
        
        {/* 叠加的文字内容 */}
        <motion.div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <style jsx>{`
            @keyframes floatTitle {
              0%, 100% { 
                transform: translateY(0px) scale(1); 
              }
              50% { 
                transform: translateY(-8px) scale(1.02); 
              }
            }
            
            @keyframes floatButton {
              0%, 100% { 
                transform: translateY(0px) scale(1); 
              }
              50% { 
                transform: translateY(-6px) scale(1.03); 
              }
            }
            
            .floating-title {
              animation: floatTitle 3.5s ease-in-out infinite;
              animation-delay: 2s;
            }
            
            .floating-button {
              animation: floatButton 2.8s ease-in-out infinite;
              animation-delay: 2.5s;
            }
          `}</style>
          
          {/* 标题文字 */}
          <motion.h1 
            className="font-bold text-black mb-8 floating-title"
            style={{ 
              fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
              fontStyle: 'italic',
              letterSpacing: '0.5px',
              lineHeight: '1.1',
              fontSize: 'clamp(2rem, 4vw, 4rem)'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              delay: 0.3
            }}
          >
            I am a UI/UX designer &<br />
            full stack developer
          </motion.h1>
          
          {/* 按钮 */}
          <Link to="/works?filter=ui-web">
            <motion.button 
              className="bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-300 shadow-lg floating-button"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                delay: 1.2
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>
      </section>
  
    </div>
  );
};

// New component for the Plexus animation
const fixedNodes = [
  { id: 1, x: 50, y: 150 }, { id: 2, x: 100, y: 50 },
  { id: 3, x: 120, y: 250 }, { id: 4, x: 200, y: 100 },
  { id: 5, x: 220, y: 350 }, { id: 6, x: 280, y: 550 },
  { id: 7, x: 300, y: 200 }, { id: 8, x: 350, y: 400 },
  { id: 9, x: 400, y: 50 }, { id: 10, x: 450, y: 300 },
  { id: 11, x: 550, y: 150 }, { id: 12, x: 580, y: 450 },
  { id: 13, x: 480, y: 580 }, { id: 14, x: 30, y: 500 },
  { id: 15, x: 150, y: 520 }, { id: 16, x: 250, y: 480 },
  { id: 17, x: 380, y: 120 }, { id: 18, x: 500, y: 220 },
  { id: 19, x: 40, y: 300 }, { id: 20, x: 180, y: 180 },
  { id: 21, x: 260, y: 30 }, { id: 22, x: 570, y: 30 },
  { id: 23, x: 500, y: 400 }, { id: 24, x: 330, y: 280 },
  { id: 25, x: 10, y: 10 }, { id: 26, x: 200, y: 580 },
  { id: 27, x: 420, y: 480 }, { id: 28, x: 20, y: 400 },
  { id: 29, x: 580, y: 280 }, { id: 30, x: 300, y: 450 },
];

const PlexusAnimation = () => {
const containerRef = useRef(null);
const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  const handleMouseMove = (event) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // The SVG is 600x600 and centered.
      const svgWidth = 600;
      const svgHeight = 600;
      const offsetX = (rect.width - svgWidth) / 2;
      const offsetY = (rect.height - svgHeight) / 2;

      setMousePosition({
        x: event.clientX - rect.left - offsetX,
        y: event.clientY - rect.top - offsetY,
      });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: null, y: null });
  };

  const nodes = useMemo(() => {
    return fixedNodes;
  }, []);

  const allNodes = useMemo(() => {
    if (mousePosition.x !== null) {
      return [...nodes, { ...mousePosition, id: 'mouse' }];
    }
    return nodes;
  }, [nodes, mousePosition]);

  const edges = useMemo(() => {
    const edges = [];
    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        const dist = Math.sqrt(
          Math.pow(allNodes[i].x - allNodes[j].x, 2) +
          Math.pow(allNodes[i].y - allNodes[j].y, 2)
        );
        if (dist < 130) {
          edges.push({
            from: allNodes[i],
            to: allNodes[j],
            dist,
            id: `${allNodes[i].id}-${allNodes[j].id}`,
          });
        }
      }
    }
    return edges;
  }, [allNodes]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex-1 flex justify-center items-center relative min-h-[600px]"
    >
      <svg width="600" height="600" viewBox="0 0 600 600" className="overflow-visible">
        {edges.map((edge) => (
          <motion.line
            key={edge.id}
            x1={edge.from.x}
            y1={edge.from.y}
            x2={edge.to.x}
            y2={edge.to.y}
            stroke="rgba(147, 197, 253, 0.5)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - edge.dist / 130 }}
            transition={{ duration: 0.5 }}
          />
        ))}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="3"
            fill="#bfdbfe"
            animate={{
              scale: [0.8, 2.2, 0.8],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        {mousePosition.x !== null && (
          <motion.circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="5"
            fill="#60a5fa"
            filter="url(#glow)"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </motion.circle>
        )}
      </svg>
    </div>
  );
};

const ProjectCard = ({ project }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm" style={{ fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif', color: '#111' }}>
    <div className="flex items-center mb-2">
      <span className="text-2xl mr-2">{project.image}</span>
      <h3 className="font-bold text-lg">{project.title}</h3>
    </div>
    <p className="text-sm mb-2 text-gray-700">{project.description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {project.technologies.map((tech, idx) => (
        <span key={idx} className="px-2 py-1 border border-gray-200 rounded-full text-xs bg-gray-100 text-gray-700">{tech}</span>
      ))}
    </div>
    <div className="flex gap-2 text-xs">
      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-medium">Demo</a>
      <a href={project.paper} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-medium">Paper</a>
    </div>
  </div>
);

export default HomeTailwind; 