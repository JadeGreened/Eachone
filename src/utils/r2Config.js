// src/utils/r2Config.js
const R2_BASE_URL = 'https://pub-0f9c49dcde884c17995c23a801ee5836.r2.dev';

const videoFiles = {
  backgroundVideo: 'BackGroundLoop.mp4',
  onSelectedVideo: 'OnSelected.mp4',
  standStillVideo: 'StandStill.mp4',
  // Add other video files as needed
};

// 直接导出函数，不使用默认导出
export const getR2Url = (videoKey) => {
    if (!videoFiles[videoKey]) {
      console.error(`视频键"${videoKey}"在R2配置中未找到`);
      return '';
    }
    return `${R2_BASE_URL}/${videoFiles[videoKey]}`;
  };