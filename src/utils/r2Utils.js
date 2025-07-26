// R2 公共资源域名（方便切换 CDN 或路径）
const R2_BASE_URL = "https://pub-0f9c49dcde884c17995c23a801ee5836.r2.dev";

export const R2_VIDEOS = {
  backgroundLoop: `${R2_BASE_URL}/BackGroundLoop.mp4`,
  onSelected: `${R2_BASE_URL}/OnSelected.mp4`,
  standStill: `${R2_BASE_URL}/StandStill.mp4`,
};


export function getR2VideoPath(filename) {
    return `${R2_BASE_URL}/${filename}`;
  }