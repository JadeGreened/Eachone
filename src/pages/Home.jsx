import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ResearchAreaCard from '../components/ResearchAreaCard';
import PublicationCard from '../components/PublicationCard';
import Header from '../components/Header';
import GazeJitterSection from '../components/GazeJitterSection';
import backgroundImg from '../assets/Home/Background.png';
import { getR2VideoPath, R2_VIDEOS } from '../utils/r2Utils';
import backgroundPoster from '../assets/Home/Background.png';
import onSelectedPoster from '../assets/Home/Yichuan.png';
import projectImage from '../assets/Home/CHILBW_Header.png';
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

  /* 2. 透明度：0px→1，600px→0   （区间不要和 heroY 的输出重复） */
  const heroOpacity = useSpring(
    useTransform(scrollY, [0, 600], [1, 0]),
    { stiffness: 120, damping: 25 }
  );
  // const heroOpacity = 1;
  const bgColor = "rgb(248, 247, 240)";

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
      <Header />

      {/* Hero Section */}
      
      <motion.section
          id="hero"
          className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity, paddingTop: '80px' }} 
        >
          {/* 半透明遮罩 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: 'rgba(248, 247, 240, 0.35)',
              mixBlendMode: 'multiply',
              zIndex: 2.5,
            }}
          />
          {/* 视频背景 */}
          <motion.video
            src={R2_VIDEOS.backgroundLoop}
            autoPlay
            loop
            muted
            playsInline
            onCanPlayThrough={handleVideoReady}
            initial={{ opacity: currentPage === 'background' ? 1 : 0 }} 
            animate={{ opacity: currentPage === 'background' ? 1 : 0 }}
            className="absolute left-0 right-0 bottom-0 w-full object-cover"
            style={{ top: '8%', height: '92%', zIndex: 1 }}
            transition={{ duration: 0.5 }}
          />
          {/* onSelected 视频 */}
          <motion.img
            src={getR2VideoPath("Yichuan.png")}
            className="absolute left-0 object-cover"
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
            className="absolute left-0 object-cover"
            style={{ top: '8%', height: '92%', width: '30%', objectPosition: 'center 5%', zIndex: 1 }}
            variants={videoVariants}
            initial="loading"
            animate={currentPage === 'character' && !onSelectedFinished ? motionState : 'loading'}
            transition={{ duration: 0 }}
          />
          {/* StandStill 视频 */}
          <motion.img
            src={onSelectedPoster}
            alt=""
            className="absolute left-0 object-cover"
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
            className="absolute left-0 object-cover"
            style={{ top: '8%', height: '92%', width: '30%', objectPosition: 'center 5%', zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentPage === 'character' && onSelectedFinished && stillReady ? 1 : 0
            }}
            transition={{ duration: 0, ease: 'easeOut' }}
          />
          {/* 半透明米黄色遮罩 */}
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{
              zIndex: 2,
              top: '8%',
              backgroundColor: 'rgba(251, 249, 243, 0.7)',
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
          <motion.div 
            className="absolute text-left"
            style={{ 
              fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
              width: 'clamp(500px, 50%, 1200px)', // 使用clamp控制宽度范围，最小500px，最大1200px
              userSelect: 'text', // 确保文本可以被选择
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
                fontStyle: 'italic',
                letterSpacing: '0.5px',
                lineHeight: '1.1',
                fontSize: 'clamp(2.5rem, 5vw, 6rem)', // 使用clamp确保字体大小在大屏幕上继续增加
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
                fontSize: 'clamp(1rem, 1.3vw, 1.8rem)', // 减小字体大小范围
                lineHeight: '1.2',
                maxWidth: '100%', // 确保内容不会溢出父容器
              }}
            >
              <p>
                I am Yichuan Zhang, a senior majoring in Information and Computing Science 
                at Xi'an Jiaotong-Liverpool University (XJTLU).
              </p>
              <p> 
                Currently, I work as a Research Assistant at the X-CHI Lab under the guidance of 
                Professor Hai-Ning Liang at HKUST-GZ.
              </p>
              <p>
                My research interests lie in Human-Computer Interaction, Text Entry 
                and VR development. My current work is focused on modeling user behavior patterns 
                in virtual environment.
              </p>
            </motion.div>
            
            {/* 装饰性图标 - 使用相对定位 */}
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
          </motion.div>
        )}
        
        </motion.section>
       <div className="w-full h-px bg-gray-300"></div>
       {/* HCI/AI Section */}

      <section className="relative w-full min-h-screen overflow-auto bg-[rgb(248,247,240)]" style={{ padding: 'clamp(4rem, 6vh, 8rem) clamp(0.75rem, 6vw, 8rem)' }}>
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
              Other Publication
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
                    src={projectImage}
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
                      Search
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Collab
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Eupido
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
                    src={projectImage}
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
                      Search
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Collab
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Eupido
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
                    src={projectImage}
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
                      Search
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Collab
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Eupido
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
                    src={projectImage}
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
                      Search
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Collab
                    </button>
                    <button 
                      className="px-3 py-1 text-gray-800 rounded"
                      style={{ 
                        fontSize: 'clamp(0.7rem, 0.75vw, 0.85rem)',
                        backgroundColor: 'rgb(250, 247, 239)'
                      }}
                    >
                      Eupido
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Know More Button */}
            <div className="text-right" style={{ marginTop: 'clamp(1.5rem, 4vw, 4rem)' }}>
              <button 
                className="bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors"
                style={{ 
                  fontSize: 'clamp(0.9rem, 1.2vw, 1.3rem)',
                  padding: 'clamp(0.6rem, 1vw, 1.25rem) clamp(1.5rem, 3vw, 3.5rem)'
                }}
              >
                Know More Button
              </button>
            </div>
          </div>
        </div>
      </section>


        {/* ——— 云层横幅，用 vh 替代 px ——— */}
        <section className="relative w-full h-[100vh] overflow-hidden" style={{ paddingTop: '80px' }}>

        <Canvas
            className="w-full h-full bg-[rgb(248,247,240)]"
            camera={{ position: [0, 0, 25], fov: 75 }}  // 调整相机位置
            rotation={[Math.PI / 4, 0, 0]}  // 调整视角角度
            dpr={[1, 1.5]}  // 确认设备像素比是否过高
            gl={{ alpha: true  }}  // 不使用透明背景
          >


          <ambientLight intensity={Math.PI / 1.5} />
          <ScrollClouds />
          {/* <CameraControls /> */}
        </Canvas>
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