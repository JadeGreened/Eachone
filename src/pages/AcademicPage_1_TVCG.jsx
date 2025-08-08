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
            Intelligent Medical Orthopedic Splint
          </h1>
          
          {/* 作者列表 */}
          <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.5' }}>
            <span style={{ color: '#4A90E2' }}>Yichuan Zhang</span>, Siyuan Wang, Chao Li, Shuchen Liu, Zheng Jin
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
              The intelligent medical orthopedic splint is a significant advancement in fracture recovery, addressing 
              key issues of traditional splints such as inconsistent tightness and limited wound monitoring. The 
              research at Suzhou Traditional Chinese Medicine Hospital involved interviews with doctors and 
              surveys with patients, highlighting these challenges.
            </p>
            
            <p style={{ marginBottom: '20px' }}>
              This innovative splint integrates technology to continuously monitor tightness, ensuring it remains 
              within a therapeutic range. It features sensors for real-time wound monitoring, providing critical data 
              on temperature and humidity. Designed to be lightweight and cost-effective, the splint uses 
              affordable materials without sacrificing quality.
            </p>
            
            <p style={{ marginBottom: '0' }}>
              Performance tests showed that the splint accurately maintains appropriate pressure and offers an 
              easy-to-use interface. Future improvements include optimizing sensor placement, enhancing data 
              integration, and further reducing weight and cost. Overall, the intelligent medical orthopedic splint 
              aims to improve patient outcomes, comfort, and healthcare efficiency.
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
