// R2 公共资源域名（方便切换 CDN 或路径）
const R2_BASE_URL = "https://pub-0f9c49dcde884c17995c23a801ee5836.r2.dev";

export const R2_VIDEOS = {
  backgroundLoop: `${R2_BASE_URL}/BackGroundLoop.mp4`,
  onSelected: `${R2_BASE_URL}/Home/OnSelected.mp4`,
  standStill: `${R2_BASE_URL}/Home/StandStill.mp4`,
};

export const R2_IMAGES = {
  // Home images
  backgroundImg: `${R2_BASE_URL}/Home/Background.png`,
  backgroundPoster: `${R2_BASE_URL}/Home/Background.png`,
  yichuanPoster: `${R2_BASE_URL}/Home/Yichuan.png`,
  projectImage: `${R2_BASE_URL}/Home/CHILBW_Header.png`,
  researchAreaImg: `${R2_BASE_URL}/Home/ResearchArea.png`,
  
  // About images
  profileImage: `${R2_BASE_URL}/About/Profile.jpg`,
  
  // Publications images
  chi2024: `${R2_BASE_URL}/assets/publications/chi2024.png`,
  ieee2023: `${R2_BASE_URL}/assets/publications/ieee2023.png`,
};

export function getR2VideoPath(filename) {
    return `${R2_BASE_URL}/${filename}`;
}

export function getR2ImagePath(filename) {
    return `${R2_BASE_URL}/${filename}`;
}