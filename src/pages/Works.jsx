import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { R2_IMAGES } from '../utils/r2Utils';

const Works = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();

  // 页面加载时根据URL参数设置筛选器
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && ['all', 'academic', 'game-vfx', 'ui-web'].includes(filterParam)) {
      setActiveFilter(filterParam);
    }
  }, [searchParams]);

  // 学术文章数据
  const publications = [
    {
      id: 1,
      type: 'academic',
      title: "Exploring and Modeling the Effects of Eye-Tracking Accuracy and Precision on Gaze-Based Steering in Virtual Environments",
      authors: "Yichuan Zhang, Hai-Ning Liang, et al.",
      conference: "CHI 2024",
      year: "2024",
      doi: "10.1145/3613904.3642000",
      description: "This study investigates how eye-tracking accuracy and precision affect user performance in gaze-based steering tasks within virtual reality environments.",
      link: "https://doi.org/10.1145/3613904.3642000",
      image: R2_IMAGES.chi2024,
      tags: ["HCI", "VR", "Eye-tracking", "User Study"]
    },
    {
      id: 2,
      type: 'academic',
      title: "Gaze-Based Interaction in Virtual Reality: A Comprehensive Survey",
      authors: "Yichuan Zhang, Hai-Ning Liang",
      journal: "IEEE Computer Graphics and Applications",
      year: "2023",
      doi: "10.1109/MCG.2023.3280000",
      description: "A comprehensive review of gaze-based interaction techniques in virtual reality applications.",
      link: "#",
      image: R2_IMAGES.ieee2023,
      tags: ["Survey", "VR", "Gaze Interaction", "Review"]
    }
  ];

  // 其他作品数据
  const projects = [
    {
      id: 3,
      type: 'game',
      title: "VR Adventure Game",
      description: "An immersive virtual reality adventure game featuring gaze-based interaction and spatial audio.",
      technologies: ["Unity", "C#", "VR SDK", "Spatial Audio"],
      year: "2024",
      category: "Game Development",
      image: "🎮",
      demo: "#",
      github: "#",
      tags: ["Unity", "VR", "Game Design", "C#"]
    },
    {
      id: 4,
      type: 'animation',
      title: "Character Animation Reel",
      description: "A collection of 3D character animations showcasing various movement styles and emotional expressions.",
      technologies: ["Blender", "Maya", "After Effects"],
      year: "2023",
      category: "Animation",
      image: "🎬",
      demo: "#",
      behance: "#",
      tags: ["Blender", "Maya", "Animation", "3D"]
    },
    {
      id: 5,
      type: 'ui',
      title: "Research Lab Website",
      description: "Modern, responsive website design for X-CHI Lab featuring interactive elements and clean typography.",
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      year: "2024",
      category: "UI/UX Design",
      image: "🎨",
      demo: "#",
      figma: "#",
      tags: ["React", "UI/UX", "Web Design", "Responsive"]
    },
    {
      id: 6,
      type: 'vfx',
      title: "Particle System Showcase",
      description: "Advanced particle systems and visual effects created for various multimedia projects.",
      technologies: ["Houdini", "Unreal Engine", "Substance Designer"],
      year: "2023",
      category: "Visual Effects",
      image: "✨",
      demo: "#",
      artstation: "#",
      tags: ["Houdini", "VFX", "Particles", "Unreal"]
    },
    {
      id: 7,
      type: 'research',
      title: "Eye-Tracking Data Visualization Tool",
      description: "Interactive tool for visualizing and analyzing eye-tracking data in VR environments.",
      technologies: ["Python", "D3.js", "WebGL", "Machine Learning"],
      year: "2024",
      category: "Research Tool",
      image: "👁️",
      demo: "#",
      github: "#",
      tags: ["Python", "Data Viz", "WebGL", "ML"]
    },
    {
      id: 8,
      type: 'mobile',
      title: "AR Learning App",
      description: "Educational augmented reality application for interactive learning experiences.",
      technologies: ["ARKit", "Swift", "3D Modeling"],
      year: "2023",
      category: "Mobile Development",
      image: "📱",
      demo: "#",
      appstore: "#",
      tags: ["ARKit", "Swift", "AR", "Education"]
    }
  ];

  const allWorks = [...publications, ...projects];

  // 筛选逻辑
  const filteredWorks = allWorks.filter(work => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'academic') return work.type === 'academic';
    if (activeFilter === 'game-vfx') return ['game', 'animation', 'vfx'].includes(work.type);
    if (activeFilter === 'ui-web') return ['ui', 'research', 'mobile'].includes(work.type);
    return work.type === activeFilter;
  });

  // 筛选按钮配置
  const filterButtons = [
    { key: 'all', label: 'All Works', count: allWorks.length },
    { key: 'academic', label: 'Academic', count: publications.length },
    { key: 'game-vfx', label: 'Game & VFX', count: projects.filter(p => ['game', 'animation', 'vfx'].includes(p.type)).length },
    { key: 'ui-web', label: 'UI/UX and Web Development', count: projects.filter(p => ['ui', 'research', 'mobile'].includes(p.type)).length }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(249, 248, 241)' }}>
      <Header showNavItems={true} />
      
      {/* 主要内容区域 */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* 页面标题 */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-800"
              style={{ 
                fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                fontStyle: 'italic'
              }}
            >
              Works & Publications
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive collection of my academic research, creative projects, and technical works spanning 
              Human-Computer Interaction, VR development, game design, and visual arts.
            </p>
          </motion.div>

          {/* 筛选按钮 */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filterButtons.map((button) => (
              <button
                key={button.key}
                onClick={() => {
                  setActiveFilter(button.key);
                  if (button.key === 'all') {
                    setSearchParams({});
                  } else {
                    setSearchParams({ filter: button.key });
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === button.key
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {button.label} ({button.count})
              </button>
            ))}
          </motion.div>

          {/* 作品展示区域 */}
          <div className="space-y-8">
            {/* 当筛选为 academic 时，学术文章使用横向布局 */}
            {activeFilter === 'academic' && filteredWorks.filter(work => work.type === 'academic').length > 0 && (
              <motion.div 
                className="space-y-6"
                layout
              >
                {filteredWorks
                  .filter(work => work.type === 'academic')
                  .map((work, index) => (
                    <motion.div
                      key={work.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        layout: { duration: 0.3 }
                      }}
                    >
                      <AcademicCard work={work} />
                    </motion.div>
                  ))
                }
              </motion.div>
            )}

            {/* 其他情况下，所有作品都使用网格布局 */}
            {activeFilter !== 'academic' && filteredWorks.length > 0 && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                {filteredWorks.map((work, index) => (
                  <motion.div
                    key={work.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      layout: { duration: 0.3 }
                    }}
                  >
                    {work.type === 'academic' ? (
                      <AcademicProjectCard work={work} />
                    ) : (
                      <ProjectCard work={work} />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* 空状态 */}
          {filteredWorks.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-500 text-lg">No works found for this category.</p>
            </motion.div>
          )}

          {/* 统计信息 */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-8 bg-white/80 backdrop-blur-sm rounded-lg px-8 py-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{publications.length}</div>
                <div className="text-sm text-gray-600">Academic Papers</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{projects.length}</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{allWorks.length}</div>
                <div className="text-sm text-gray-600">Total Works</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// 学术文章卡片组件 - 横向布局
const AcademicCard = ({ work }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="flex">
      {/* 左侧图片区域 */}
      <div className="relative w-80 h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex-shrink-0 overflow-hidden">
        <img 
          src={work.image || "/api/placeholder/320/192"} 
          alt={work.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='192' viewBox='0 0 320 192'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23dbeafe'/%3E%3Cstop offset='100%25' style='stop-color:%23c7d2fe'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='320' height='192' fill='url(%23bg)'/%3E%3Cg transform='translate(160,96)'%3E%3Ccircle r='20' fill='%236366f1' opacity='0.9'/%3E%3Ctext x='0' y='5' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3E📊%3C/text%3E%3C/g%3E%3Ctext x='160' y='130' font-family='Arial' font-size='11' fill='%236366f1' text-anchor='middle' font-weight='600'%3EResearch Paper%3C/text%3E%3C/svg%3E";
          }}
        />
        {/* 年份标签 */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800 shadow-sm">
          {work.year}
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 p-6 flex flex-col">
        {/* 顶部：类型标签 */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            Academic Paper
          </span>
        </div>

        {/* 标题 */}
        <h3 
          className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 leading-tight"
          style={{ 
            fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
            fontStyle: 'italic'
          }}
        >
          {work.title}
        </h3>

        {/* 作者信息 */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 font-medium">{work.authors}</p>
          <p className="text-sm text-gray-500 mt-1 italic">{work.conference || work.journal}</p>
        </div>

        {/* 描述 - 占据剩余空间 */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-1">
          {work.description}
        </p>

        {/* 底部区域：标签和按钮 */}
        <div className="flex items-end justify-between gap-4">
          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {work.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                {tag}
              </span>
            ))}
            {work.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                +{work.tags.length - 3}
              </span>
            )}
          </div>

          {/* 按钮组 */}
          <div className="flex gap-3 flex-shrink-0">
            {work.link && (
              <a
                href={work.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                View Paper
              </a>
            )}
            {work.doi && (
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                DOI
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 学术文章小卡片组件 - 用于网格布局
const AcademicProjectCard = ({ work }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
      {/* 顶部图片区域 */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={work.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='192' viewBox='0 0 400 192'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23dbeafe'/%3E%3Cstop offset='100%25' style='stop-color:%23c7d2fe'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='192' fill='url(%23bg)'/%3E%3Cg transform='translate(200,96)'%3E%3Ccircle r='24' fill='%236366f1' opacity='0.8'/%3E%3Ctext x='0' y='6' font-family='Arial' font-size='20' text-anchor='middle'%3E📊%3C/text%3E%3C/g%3E%3Ctext x='200' y='130' font-family='Arial' font-size='12' fill='%236366f1' text-anchor='middle' font-weight='500'%3EAcademic Paper%3C/text%3E%3C/svg%3E"} 
          alt={work.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='192' viewBox='0 0 400 192'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23dbeafe'/%3E%3Cstop offset='100%25' style='stop-color:%23c7d2fe'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='192' fill='url(%23bg)'/%3E%3Cg transform='translate(200,96)'%3E%3Ccircle r='24' fill='%236366f1' opacity='0.8'/%3E%3Ctext x='0' y='6' font-family='Arial' font-size='20' text-anchor='middle'%3E📊%3C/text%3E%3C/g%3E%3Ctext x='200' y='130' font-family='Arial' font-size='12' fill='%236366f1' text-anchor='middle' font-weight='500'%3EAcademic Paper%3C/text%3E%3C/svg%3E";
          }}
        />
        {/* 年份标签 */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
          {work.year}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {/* 类型标签 */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            Academic Paper
          </span>
        </div>

        {/* 标题 */}
        <h3 
          className="font-bold text-lg mb-3 text-gray-900 line-clamp-2 leading-tight"
          style={{ 
            fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
            fontStyle: 'italic'
          }}
        >
          {work.title}
        </h3>

        {/* 描述 */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {work.description}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {work.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              {tag}
            </span>
          ))}
          {work.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{work.tags.length - 3}
            </span>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-3">
          {work.link && (
            <a
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-900 text-white text-center py-3 px-4 rounded-lg font-medium text-sm transition-colors"
            >
              View Paper
            </a>
          )}
          {work.doi && (
            <button className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              DOI
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 项目作品卡片组件
const ProjectCard = ({ work }) => {
  // 根据项目类型生成更精美的占位图片
  const getPlaceholderImage = (type, category) => {
    const typeConfig = {
      'game': { emoji: '🎮', color: '#10b981', bgFrom: '#ecfdf5', bgTo: '#d1fae5' },
      'animation': { emoji: '🎬', color: '#f59e0b', bgFrom: '#fffbeb', bgTo: '#fef3c7' },
      'ui': { emoji: '🎨', color: '#8b5cf6', bgFrom: '#f5f3ff', bgTo: '#e9d5ff' },
      'vfx': { emoji: '✨', color: '#ef4444', bgFrom: '#fef2f2', bgTo: '#fecaca' },
      'research': { emoji: '🔬', color: '#3b82f6', bgFrom: '#eff6ff', bgTo: '#dbeafe' },
      'mobile': { emoji: '📱', color: '#06b6d4', bgFrom: '#f0fdfa', bgTo: '#ccfbf1' }
    };
    
    const config = typeConfig[type] || { emoji: '💼', color: '#6b7280', bgFrom: '#f9fafb', bgTo: '#f3f4f6' };
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='192' viewBox='0 0 400 192'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:${config.bgFrom}'/%3E%3Cstop offset='100%25' style='stop-color:${config.bgTo}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='192' fill='url(%23bg)'/%3E%3Cg transform='translate(200,96)'%3E%3Ccircle r='24' fill='${config.color}' opacity='0.8'/%3E%3Ctext x='0' y='6' font-family='Arial' font-size='20' text-anchor='middle'%3E${config.emoji}%3C/text%3E%3C/g%3E%3Ctext x='200' y='130' font-family='Arial' font-size='12' fill='${config.color}' text-anchor='middle' font-weight='500'%3E${category}%3C/text%3E%3C/svg%3E`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
      {/* 顶部图片区域 */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={work.imageUrl || getPlaceholderImage(work.type, work.category)} 
          alt={work.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = getPlaceholderImage(work.type, work.category);
          }}
        />
        {/* 年份标签 */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
          {work.year}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        {/* 类型标签 */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            {work.category}
          </span>
        </div>

        {/* 标题 */}
        <h3 
          className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 leading-tight"
          style={{ 
            fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
            fontStyle: 'italic'
          }}
        >
          {work.title}
        </h3>

        {/* 描述 */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">
          {work.description}
        </p>

        {/* 技术标签 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {work.technologies.slice(0, 4).map((tech, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              {tech}
            </span>
          ))}
          {work.technologies.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{work.technologies.length - 4}
            </span>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-3">
          {work.demo && (
            <a
              href={work.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-900 text-white text-center py-3 px-4 rounded-lg font-medium text-sm transition-colors"
            >
              View Demo
            </a>
          )}
          {work.github && (
            <a
              href={work.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Works;
