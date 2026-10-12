const [R, G, B] = [0, 1, 2];

export function getStrByRGB(rgb: number[]) {
  return '#' + ((rgb[R]<<16) + (rgb[G]<<8) + rgb[B]<<0).toString(16).padStart(6,'0');
}

export function mixRGBs(baseRgb: number[], rgb: number[], alpha: number) {
  return [
    baseRgb[R] + (rgb[R]-baseRgb[R])*alpha,
    baseRgb[G] + (rgb[G]-baseRgb[G])*alpha,
    baseRgb[B] + (rgb[B]-baseRgb[B])*alpha
  ];
}

/** a: 0\~255, 최대 색. p: 0\~1, 얼마나 빨강이 아니라 녹색에 가까운지. */
export function redToGreen(a: number, p: number) {
  return [
    Math.min(a, Math.round(a * 2*(1-p))),
    Math.min(a, Math.round(a * 2*p)),
    0
  ];
}