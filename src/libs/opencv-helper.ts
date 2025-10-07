import cv from '@techstark/opencv-js';

let initialized = false;
const waitResolves: (() => void)[] = [];

export const waitCV = async (): Promise<boolean> => {
  if (initialized) return true;
  return new Promise((resolve) => {
    waitResolves.push(() => resolve(true));
  });
};

const init = async () => {
  // Assuming the `cv` object has a `then` property if it's promise-like
  if (cv && typeof (cv as any).then === 'function') {
    await (cv as any);
  }
  initialized = true;
  waitResolves.forEach((resolve) => resolve());
};

init();

export { cv as opencv };
