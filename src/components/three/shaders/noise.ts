// Ruído de valor barato (hash sem textura). OCTAVES é definido por qualidade.
export const noiseGLSL = /* glsl */ `
float hash11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float hash13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }

float vnoise1(float x){ float i = floor(x); float f = fract(x); float u = f * f * (3. - 2. * f); return mix(hash11(i), hash11(i + 1.), u); }

float vnoise3(vec3 p){
  vec3 i = floor(p); vec3 f = fract(p); vec3 u = f * f * (3. - 2. * f);
  float n000 = hash13(i), n100 = hash13(i + vec3(1,0,0)), n010 = hash13(i + vec3(0,1,0)), n110 = hash13(i + vec3(1,1,0));
  float n001 = hash13(i + vec3(0,0,1)), n101 = hash13(i + vec3(1,0,1)), n011 = hash13(i + vec3(0,1,1)), n111 = hash13(i + vec3(1,1,1));
  return mix(mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y), mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y), u.z);
}

float fbm3(vec3 p){
  float s = 0., a = .5;
  for (int i = 0; i < OCTAVES; i++) { s += a * vnoise3(p); p = p * 2.02 + vec3(1.7, 9.2, 4.1); a *= .5; }
  return s;
}
`;

export function withOctaves(src: string, octaves: number) {
  return `#define OCTAVES ${octaves}\n${src}`;
}
