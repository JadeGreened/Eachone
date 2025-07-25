import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ResearchAreaCard from '../components/ResearchAreaCard';
import PublicationCard from '../components/PublicationCard';
import Header from '../components/Header';
import backgroundImg from '../assets/Home/Background.png';
import backgroundVideo from '../assets/Home/clearerVersion/BackgroundLoop.mp4';
import onSelectedVideo from '../assets/Home/clearerVersion/OnSelected.mp4';
import standStillVideo from '../assets/Home/clearerVersion/StandStill.mp4';


// Optimized animation variants with reduced complexity
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    y: -8,
    scale: 1.05,
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: '0 4px 24px 0 rgba(80, 120, 255, 0.18)',
    transition: { duration: 0.05 },
  },
  tap: {
    scale: 0.95,
  },
};

// Floating animation for icons
const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const publicationCardVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    x: 8,
    scale: 1.01,
  }
};

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
  // 使用一个状态表示当前页面：'background' 或 'character'
  const [currentPage, setCurrentPage] = useState('background');
  // 是否已经播放完onSelected视频
  const [onSelectedFinished, setOnSelectedFinished] = useState(false);
  // 是否是首次访问（用于控制引导提示和滚动限制）
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [currentProject, setCurrentProject] = useState(0);
  const { scrollY } = useScroll();
  
  // 添加对onSelectedVideo的引用
  const onSelectedVideoRef = useRef(null);
  // 添加对页面主体的引用，用于控制滚动
  const mainContentRef = useRef(null);
  
  // 禁用滚动功能
  useEffect(() => {
    const handleScroll = (e) => {
      if (isFirstVisit) {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: false });
    
    if (isFirstVisit) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = '';
    };
  }, [isFirstVisit]);
  
  // Optimized scroll-based animations
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const springHeroY = useSpring(heroY, { stiffness: 100, damping: 30 });

  // 切换到角色页面
  const switchToCharacterPage = () => {
    setCurrentPage('character');
    setOnSelectedFinished(false); // 重置视频播放状态
    setIsFirstVisit(false); // 用户已点击，不再是首次访问状态
    
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

  // Memoized data to prevent unnecessary re-renders
  const projects = useMemo(() => [
    {
      id: 1,
      title: "VR Interactive Learning Environment",
      category: "VR/AR",
      description: "A virtual reality learning platform developed with Unity, exploring immersive educational experiences. Features gesture recognition, spatial audio, and real-time collaboration.",
      technologies: ["Unity", "C#", "Oculus SDK", "SteamVR"],
      image: "🎮",
      demo: "https://example.com/vr-learning",
      paper: "https://example.com/paper1"
    },
    {
      id: 2,
      title: "AI Agent Intelligent Assistant",
      category: "AI/HCI",
      description: "An intelligent interaction agent based on natural language processing, supporting multimodal input and contextual understanding. Applied in smart homes and assistive technology.",
      technologies: ["Python", "TensorFlow", "NLP", "ROS"],
      image: "🤖",
      demo: "https://example.com/ai-agent",
      paper: "https://example.com/paper2"
    },
    {
      id: 3,
      title: "Augmented Reality Gesture Control",
      category: "AR/HCI",
      description: "Computer vision-based gesture recognition system for touchless AR interface control. Supports multiple gesture patterns and real-time feedback.",
      technologies: ["OpenCV", "MediaPipe", "Unity", "ARKit"],
      image: "👋",
      demo: "https://example.com/ar-gesture",
      paper: "https://example.com/paper3"
    },
    {
      id: 4,
      title: "Brain-Computer Interface Design",
      category: "HCI/Neuroscience",
      description: "Exploring EEG signals in HCI applications, designing intuitive brain-computer interaction interfaces. Combines machine learning algorithms for intent recognition.",
      technologies: ["EEG", "Python", "ML", "BCI"],
      image: "🧠",
      demo: "https://example.com/bci-interface",
      paper: "https://example.com/paper4"
    }
  ], []);

  const publications = useMemo(() => [
    {
      title: "Immersive Learning in Virtual Reality: A Study on Educational Effectiveness",
      authors: "Zhang, Y., et al.",
      journal: "CHI 2024",
      year: "2024",
      doi: "10.1145/example"
    },
    {
      title: "AI-Powered Human-Computer Interaction: Challenges and Opportunities",
      authors: "Zhang, Y., et al.",
      journal: "UIST 2023",
      year: "2023",
      doi: "10.1145/example"
    },
    {
      title: "Gesture-Based AR Interaction: A Comparative Study",
      authors: "Zhang, Y., et al.",
      journal: "VRST 2023",
      year: "2023",
      doi: "10.1145/example"
    }
  ], []);

  const researchAreas = useMemo(() => [
    {
      icon: "🎮",
      title: "Virtual Reality (VR)",
      description: "Immersive interaction design, spatial audio, gesture recognition, collaborative VR environments",
      tags: ["Unity", "Oculus", "SteamVR"]
    },
    {
      icon: "👁️",
      title: "Augmented Reality (AR)",
      description: "AR interface design, computer vision, gesture control, spatial computing",
      tags: ["ARKit", "ARCore", "OpenCV"]
    },
    {
      icon: "🤖",
      title: "AI Agent",
      description: "Intelligent interaction agents, natural language processing, multimodal interaction, machine learning",
      tags: ["NLP", "TensorFlow", "ROS"]
    },
    {
      icon: "🧠",
      title: "Brain-Computer Interface",
      description: "EEG signal processing, intent recognition, neural feedback, BCI applications",
      tags: ["EEG", "BCI", "ML"]
    }
  ], []);

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
        backgroundColor: 'rgb(251, 249, 243)', 
        fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif',
        userSelect: 'text',
        WebkitUserSelect: 'text', // 添加WebKit前缀
        MozUserSelect: 'text', // 添加Mozilla前缀
        msUserSelect: 'text', // 添加Microsoft前缀
        pointerEvents: 'auto', // 确保指针事件正常工作
        '--base-font-size': 'calc(0.8rem + 0.5vw)', // 基础字体大小变量
      }}
    >
      <Header 
        customMessage={isFirstVisit ? "Please Click The Guy In Middle" : null}
        showNavItems={!isFirstVisit}
      />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      >
        {/* 视频背景 */}
        <motion.video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 right-0 bottom-0 w-full object-cover"
          style={{ top: '8%', height: '92%', zIndex: 1 }} // 使用百分比替代固定像素
          animate={{ opacity: currentPage === 'background' ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
         {/* onSelected 视频 */}
         <motion.video
            ref={onSelectedVideoRef}
            src={onSelectedVideo}
            autoPlay
            muted
            playsInline
            onEnded={() => setOnSelectedFinished(true)}
            className="absolute left-0 object-cover"
            style={{ top: '8%', height: '92%', zIndex: 1, width: '30%', objectPosition: 'center 5%' }} // 使用百分比替代固定像素
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ 
              opacity: currentPage === 'character' && !onSelectedFinished ? 1 : 0, 
              x: currentPage === 'character' ? '0%' : '-100%' 
            }}
            transition={{
              x: { duration: 0.8, ease: 'easeInOut' },
              opacity: { duration: 0 }
            }}
            key={`onselected-${currentPage === 'character'}`} // 添加key强制重新渲染
          />
        {/* StandStill 视频，预加载并根据状态切换 */}
        <motion.video
            src={standStillVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 object-cover"
            style={{ top: '8%', height: '92%', zIndex: 1, width: '30%', objectPosition: 'center 5%' }} // 使用百分比替代固定像素
            initial={{ opacity: 0, x: '0%' }}
            animate={{ 
              opacity: currentPage === 'character' && onSelectedFinished ? 1 : 0, 
              x: currentPage === 'character' ? '0%' : '-100%' 
            }}
            transition={{ duration: 0 }}
        />
        {/* 半透明米黄色遮罩增强可读性 */}
        <div className="absolute left-0 right-0 bottom-0" style={{ zIndex: 2, top: '8%', backgroundColor: 'rgba(251, 249, 243, 0.7)' }} />
        {/* 可交互人物蒙层 */}
        <div className="absolute top-0 left-0 right-0 bottom-0">
          {/* 背景页面的蒙层，只在background页面显示 */}
          {currentPage === 'background' && (
            <CharacterOverlay setOpen={switchToCharacterPage} />
          )}
          {/* 角色页面的蒙层，只在character页面显示 */}
          {currentPage === 'character' && (
            <SideCharacterOverlay onClick={handleSideCharacterClick} />
          )}
        </div>
        
        {/* 添加首次访问时的提示 */}
        {isFirstVisit && (
          <motion.div 
            className="absolute text-center text-black"
            style={{ 
              fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
              fontStyle: 'italic',
              fontSize: '1.25rem',
              fontWeight: '500',
              letterSpacing: '0.5px',
              bottom: '10%',
              left: '0',
              right: '0',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            点击中间的人物继续
          </motion.div>
        )}
        
        {/* 文字内容 */}
        
        {!isFirstVisit && (
          <motion.div 
            className="absolute text-left"
            style={{ 
              fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
              width: 'clamp(500px, 50%, 1200px)', // 使用clamp控制宽度范围，最小500px，最大1200px
              userSelect: 'text', // 确保文本可以被选择
              right: '10%', // 使用百分比定位，而不是固定像素
              top: '20%', // 使用百分比定位，而不是固定像素
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
        
      </section>

      {/* 主内容区纯白背景 */}
      <main ref={mainContentRef} className="relative z-10 w-full max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8 border border-black" style={{ userSelect: 'text' }}>
        {/* Research Areas */}
        <section id="research" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-black inline-block">研究方向</h2>
          <div className="grid gap-6 mt-6 sm:grid-cols-2 md:grid-cols-2">
            {researchAreas.map((area, idx) => (
              <ResearchAreaCard key={idx} area={area} />
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-black inline-block">项目</h2>
          <div className="grid gap-6 mt-6 sm:grid-cols-1 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Publications */}
        <section id="publications" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b border-black inline-block">论文</h2>
          <div className="grid gap-6 mt-6">
            {publications.map((pub, idx) => (
              <PublicationCard key={idx} pub={pub} />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-4">
          <h2 className="text-2xl font-bold mb-6 border-b border-black inline-block">联系方式</h2>
          <ul className="space-y-2 text-sm text-gray-800">
            <li>📧 yichuan.zhang@example.edu</li>
            <li>🏫 清华大学人机交互实验室</li>
            <li>📍 北京，中国</li>
          </ul>
        </section>
      </main>
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
  <div className="bg-white border border-black rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-2 transition-all duration-200" style={{ fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif', color: '#111' }}>
    <div className="flex items-center mb-2">
      <span className="text-2xl mr-2">{project.image}</span>
      <h3 className="font-bold text-lg">{project.title}</h3>
    </div>
    <p className="text-sm mb-2 text-gray-700">{project.description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {project.technologies.map((tech, idx) => (
        <span key={idx} className="px-2 py-1 border border-black rounded-full text-xs bg-white">{tech}</span>
      ))}
    </div>
    <div className="flex gap-2 text-xs">
      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="px-3 py-1 border border-black rounded-full hover:bg-black hover:text-white">Demo</a>
      <a href={project.paper} target="_blank" rel="noopener noreferrer" className="px-3 py-1 border border-black rounded-full hover:bg-black hover:text-white">Paper</a>
    </div>
  </div>
);

export default HomeTailwind; 