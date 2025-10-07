export const cumsum = (data: number[][], width: number, height: number) => {
  const an = new Array(width * height);

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const up = j > 0 ? an[(j - 1) * width + i] : 0;
      const left = i > 0 ? an[j * width + (i - 1)] : 0;
      const diag = j > 0 && i > 0 ? an[(j - 1) * width + (i - 1)] : 0;
      an[j * width + i] = data[j][i] + up + left - diag;
    }
  }

  return {
    // ret[0] = top-left, ret[1] = top-right, ret[2] = bottom-left, ret[3] = bottom-right
    query: (x1: number, y1: number, x2: number, y2: number) => {
      let ret = 0;
      ret += an[y2 * width + x2];
      ret -= an[y1 * width + x2];
      ret += an[y1 * width + x1];
      ret -= an[y2 * width + x1];
      return ret;
    },
  };
};
