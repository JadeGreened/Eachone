uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

float noise(vec3 p) {
  return fract(sin(dot(p ,vec3(12.9898,78.233,45.164))) * 43758.5453);
}

float fbm(vec3 p) {
  float total = 0.0;
  float amplitude = 1.0;
  for(int i = 0; i < 4; i++) {
    total += noise(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return total;
}

void main() {
  vec2 uv = vUv;
  vec3 p = vec3(uv * 5.0, uTime * 0.05);
  float density = fbm(p);
  vec3 cloudColor = vec3(0.0); // 直接全黑
  float alpha = 1;
  gl_FragColor = vec4(cloudColor, alpha);
}
