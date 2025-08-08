import React from 'react';

const AcademicPage_1_TVCG = () => {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'normal', 
            color: '#333', 
            lineHeight: '1.2',
            marginBottom: '20px'
          }}>
            Exploring and Modeling Gaze-Based Steering Behavior in Virtual Reality
          </h1>
          
          {/* 作者列表 */}
          <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.5' }}>
            Xuning Hu, <span style={{ color: '#4A90E2', fontWeight: 'bold' }}>Yichuan Zhang</span>, Yushi Wei, Liangyuting Zhang, Yue Li, Wolfgang Stuerzlinger, Hai-Ning Liang*
          </div>
        </div>

        {/* 摘要部分 */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'normal', 
            color: '#333', 
            textAlign: 'center',
            marginBottom: '30px',
            fontStyle: 'italic'
          }}>
            Abstract
          </h2>
          
          <div style={{ 
            fontSize: '16px', 
            color: '#444', 
            lineHeight: '1.6', 
            textAlign: 'justify'
          }}>
            <p style={{ marginBottom: '20px' }}>
            Gaze-based interaction is a common input method in virtual reality
            (VR). Eye movements, such as fixations and saccades, result in different
            behaviors compared to other input methods. Previous studies
            on selection tasks showed that, unlike the mouse, the human gaze is
            insensitive to target distance and does not fully utilize target width
            due to the characteristics of saccades and micro-saccades of the
            eyes. However, its application in steering tasks remains unexplored.
            Since steering tasks are widely used in VR for menu adjustments
            and object manipulation, this study examines whether the findings
            from selection tasks apply to steering tasks. We also model and
            compare the Steering Law based on eye movement characteristics.
            To do this, we use data on movement time, average speed,
            and re-entry count. Our analysis investigates the impact of path
            width and length on performance. This work proposes three candidate
            models that incorporate gaze characteristics, which achieve
             a superior fit (R² &gt; 0.964) compared to the original Steering Law,
            improving the accuracy of time prediction, AIC, and BIC by 7%,
            26%, and 10%, respectively. These models offer valuable insights for
            game and interface designers who implement gaze-based controls
            in VR environments.
            </p>
          
          </div>
        </div>

        {/* 视频部分 */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'normal', 
            color: '#333', 
            textAlign: 'center',
            marginBottom: '30px',
            fontStyle: 'italic'
          }}>
            Video
          </h2>
          
          {/* 视频容器 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto',
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #ff6b6b, #feca57, #48ca9b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}>
                  ▶
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                  The Intelligent Medical Orthopedic Splint
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AcademicPage_1_TVCG;
