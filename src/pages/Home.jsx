import React, { useState, useCallback, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ResearchAreaCard from '../components/ResearchAreaCard';
import PublicationCard from '../components/PublicationCard';
import Header from '../components/Header';
import backgroundImg from '../assets/Home/Background.png';
import backgroundVideo from '../assets/Home/BackGround.mp4';

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

const CharacterOverlay = () => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 可交互蒙层 */}
      <motion.div
        className="absolute cursor-pointer"
        style={{
          top: '65%',           // 根据实际人物位置微调
          left: '45%',
          width: '25%',
          height: '60%',
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

      {/* 信息弹窗 */}
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-md w-[90%]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-xl font-bold mb-2">人物介绍</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              这里是对中间人物的简介文字。您可以在此补充研究方向、专业背景等信息。
            </p>
            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => setOpen(false)}
            >
              关闭
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
};

const HomeTailwind = () => {
  const [currentProject, setCurrentProject] = useState(0);
  const { scrollY } = useScroll();
  
  // Optimized scroll-based animations
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const springHeroY = useSpring(heroY, { stiffness: 100, damping: 30 });

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

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center bg-transparent text-black relative"
      style={{ fontFamily: 'Fira Mono, 思源黑体, Arial, sans-serif' }}
    >
      <Header />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      >
        {/* 视频背景 */}
        <video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        />
        {/* 半透明白色遮罩增强可读性 */}
        <div className="absolute inset-0 bg-white/70" style={{ zIndex: 2 }} />
        {/* 可交互人物蒙层 */}
        <CharacterOverlay />
        {/* 文字内容 */}
        <div className="relative z-10 px-4 max-w-2xl">
       
        </div>
      </section>

      {/* 主内容区纯白背景 */}
      <main className="relative z-10 w-full max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8 -mt-16 border border-black">
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