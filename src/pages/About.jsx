import React from 'react';
import Header from '../components/Header';
import { R2_IMAGES } from '../utils/r2Utils';

const About = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(249, 248, 241)' }}>
      <Header showNavItems={true} />
      
      {/* 主要内容区域 */}
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* 页面标题 */}
          <div className="text-center mb-16">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-800"
              style={{ 
                fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                fontStyle: 'italic'
              }}
            >
              About Me
            </h1>
            <div className="w-24 h-0.5 bg-gray-800 mx-auto"></div>
          </div>

          {/* 个人信息卡片 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
            <div className="p-8 md:p-12">
              
              {/* 基本信息 */}
              <div className="mb-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* 头像区域 */}
                  <div className="hidden md:block flex-shrink-0">
                    <div className="w-60 h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-md">
                      <img src={R2_IMAGES.profileImage} alt="Yichuan Zhang" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* 文字信息区域 */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h2 
                      className="text-3xl font-bold text-gray-800 mb-4"
                      style={{ 
                        fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                        fontStyle: 'italic'
                      }}
                    >
                      <span className="font-bold">
                        Yichuan (Eachone) Zhang
                      </span>
                      <span className="text-xl text-gray-600 ml-4 font-bold">
                        张一川
                      </span>
                    </h2>
                    
                    <div className="space-y-1 text-gray-700">
                      <p className="text-sm leading-relaxed">
                        I am Yichuan Zhang, a senior majoring in{' '}
                        <span className="font-bold">
                          Information and Computing Science
                        </span>
                        {' '}at{' '}
                        <span className="font-bold">
                          Xi'an Jiaotong-Liverpool University (XJTLU)
                        </span>
                        . My academic journey has been enriched by diverse research experiences across multiple domains.
                      </p>
                      <p className="text-sm leading-relaxed">
                        Currently, I work as a{' '}
                        <span className="font-bold">
                          Research Assistant
                        </span>
                        {' '}at the{' '}
                        <span className="font-bold">
                          X-CHI Lab
                        </span>
                        {' '}under the guidance of{' '}
                        <span className="font-bold">
                          Professor Hai-Ning Liang
                        </span>
                        {' '}at{' '}
                        <span className="font-bold">
                          HKUST-GZ
                        </span>
                        , focusing on Human-Computer Interaction and AI-augmented systems.
                      </p>
                      <p className="text-sm leading-relaxed">
                        Additionally, I am gaining industry experience as a{' '}
                        <span className="font-bold">
                          Research Intern
                        </span>
                        {' '}at{' '}
                        <span className="font-bold">
                          Memories.ai
                        </span>
                        , where I contribute to developing AI-powered memory and interaction systems. 
                      </p>
                      
                      {/* 联系链接 */}
                      <div className="flex flex-wrap gap-3 pt-4">
                        <a href="mailto:your.email@example.com" className="flex items-center gap-1.5 group">
                          <div className="w-5 h-5 bg-gray-800 rounded-md flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </div>
                          <span className="text-gray-800 group-hover:text-gray-600 font-medium transition-colors text-xs" style={{ backgroundColor: 'rgb(249, 248, 241)', padding: '1px 6px', borderRadius: '4px' }}>
                            Email
                          </span>
                        </a>
                        
                        <a href="https://github.com/yourusername" className="flex items-center gap-1.5 group">
                          <div className="w-5 h-5 bg-gray-800 rounded-md flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-800 group-hover:text-gray-600 font-medium transition-colors text-xs" style={{ backgroundColor: 'rgb(249, 248, 241)', padding: '1px 6px', borderRadius: '4px' }}>
                            GitHub
                          </span>
                        </a>
                        
                        <a href="https://linkedin.com/in/yourusername" className="flex items-center gap-1.5 group">
                          <div className="w-5 h-5 bg-gray-800 rounded-md flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-800 group-hover:text-gray-600 font-medium transition-colors text-xs" style={{ backgroundColor: 'rgb(249, 248, 241)', padding: '1px 6px', borderRadius: '4px' }}>
                            LinkedIn
                          </span>
                        </a>
                        
                        <a href="https://scholar.google.com/citations?user=YOUR_USER_ID" className="flex items-center gap-1.5 group">
                          <div className="w-5 h-5 bg-gray-800 rounded-md flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                            </svg>
                          </div>
                          <span className="text-gray-800 group-hover:text-gray-600 font-medium transition-colors text-xs" style={{ backgroundColor: 'rgb(249, 248, 241)', padding: '1px 6px', borderRadius: '4px' }}>
                            Google Scholar
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 研究领域 */}
              <div className="mb-12">
                <h3 
                  className="text-2xl font-semibold text-gray-800 mb-6"
                  style={{ 
                    fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                    fontStyle: 'italic'
                  }}
                >
                  Research Interests
                </h3>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-4">
                    I am an{' '}
                    <span className="font-bold">
                      HCI/HAI (Human-Computer/AI Interaction)
                    </span>
                    {' '}researcher with a strong interest in designing{' '}
                    <span className="font-bold">
                      intelligent systems
                    </span>
                    {' '}that enhance user interaction in{' '}
                    <span className="font-bold">
                      immersive and mobile scenarios
                    </span>
                    .
                  </p>
                  <p className="mb-4">
                    My work spans{' '}
                    <span className="font-bold">
                      AI agent behavior
                    </span>
                    {' '}and{' '}
                    <span className="font-bold">
                      VR/AR input techniques
                    </span>
                    . I've explored{' '}
                    <span className="font-bold">
                      gaze-based navigation
                    </span>
                    , combining{' '}
                    <span className="font-bold">
                      user studies
                    </span>
                    {' '}with system implementation.
                  </p>
                  <p>
                    Currently, I focus on integrating{' '}
                    <span className="font-bold">
                      AI models—such as transformers
                    </span>
                    —with sensor data like{' '}
                    <span className="font-bold">
                      eye-tracking and body motion
                    </span>
                    {' '}to enhance input performance in dynamic environments. My long-term goal is to build{' '}
                    <span className="font-bold">
                      adaptive, AI-augmented interfaces
                    </span>
                    {' '}that support seamless interaction across varied contexts.
                  </p>
                </div>
              </div>

              {/* 教育背景 */}
              <div className="mb-12">
                <h3 
                  className="text-2xl font-semibold text-gray-800 mb-6"
                  style={{ 
                    fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                    fontStyle: 'italic'
                  }}
                >
                  Education
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-gray-300 pl-6">
                    <h4 className="text-lg font-semibold text-gray-800">
                      <span className="font-bold">
                        Bachelor of Science in Information and Computing Science
                      </span>
                    </h4>
                    <p className="text-gray-600 mb-2">
                      <span className="font-bold">
                        Xi'an Jiaotong-Liverpool University (XJTLU)
                      </span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      <span className="font-medium">
                        2021 - 2025 (Expected)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 工作经历 */}
              <div className="mb-12">
                <h3 
                  className="text-2xl font-semibold text-gray-800 mb-6"
                  style={{ 
                    fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                    fontStyle: 'italic'
                  }}
                >
                  Experience
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-gray-300 pl-6">
                    <h4 className="text-lg font-semibold text-gray-800">
                      <span className="font-bold">
                        Research Assistant
                      </span>
                    </h4>
                    <p className="text-gray-600 mb-2">
                      <span className="font-bold">
                        X-CHI Lab, HKUST-GZ
                      </span>
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      Under{' '}
                      <span className="font-medium">
                        Professor Hai-Ning Liang
                      </span>
                    </p>
                    <p className="text-gray-700 text-sm">
                      Conducting research in{' '}
                      <span className="font-medium">
                        Human-Computer Interaction
                      </span>
                      , focusing on{' '}
                      <span className="font-medium">
                        VR/AR interfaces
                      </span>
                      ,{' '}
                      <span className="font-medium">
                        eye-tracking technologies
                      </span>
                      , and{' '}
                      <span className="font-medium">
                        AI-augmented interaction systems
                      </span>
                      .
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-gray-300 pl-6">
                    <h4 className="text-lg font-semibold text-gray-800">
                      <span className="font-bold">
                        Research Assistant
                      </span>
                    </h4>
                    <p className="text-gray-600 mb-2">
                      <span className="font-bold">
                        Memories.ai
                      </span>
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      <span className="font-medium">
                        AI Research & Development
                      </span>
                    </p>
                    <p className="text-gray-700 text-sm">
                      Working on{' '}
                      <span className="font-medium">
                        AI-powered memory and interaction systems
                      </span>
                      , contributing to cutting-edge research in{' '}
                      <span className="font-medium">
                        artificial intelligence applications
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* News */}
              <div className="border-t border-gray-200 pt-8">
                <h3 
                  className="text-2xl font-semibold text-gray-800 mb-8"
                  style={{ 
                    fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
                    fontStyle: 'italic'
                  }}
                >
                  News
                </h3>
                
                <div className="space-y-6">
                  {/* News Item 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="text-sm font-medium text-gray-600">2024 Jul 27</span>
                    </div>
                    <div className="flex-1 border-l-2 border-gray-300 pl-4">
                      <p className="text-gray-700 leading-relaxed">
                        My first paper collaborated with{' '}
                        <span className="font-bold">
                          Xuning Hu
                        </span>
                        {' '}was accepted by{' '}
                        <span className="font-bold">
                          ISMAR 2024
                        </span>
                        . Super excited!
                      </p>
                    </div>
                  </div>
                  
                  {/* News Item 4 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-24 text-right">
                      <span className="text-sm font-medium text-gray-600">2024 Jun 15</span>
                    </div>
                    <div className="flex-1 border-l-2 border-gray-300 pl-4">
                      <p className="text-gray-700 leading-relaxed">
                        Started my research internship at{' '}
                        <span className="font-bold">
                          X-CHI Lab, HKUST-GZ
                        </span>
                        {' '}under the supervision of{' '}
                        <span className="font-bold">
                          Professor Hai-Ning Liang
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                  
                  
                </div>
                
                {/* Contact info moved to bottom */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    I'm always interested in discussing research opportunities and collaborations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部引用 */}
          <div className="text-center">
            <p 
              className="text-lg text-gray-600 italic"
              style={{ 
                fontFamily: 'Palatino, "Palatino Linotype", "Book Antiqua", serif'
              }}
            >
              "Simplicity is the ultimate sophistication."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
