declare module 'one-euro-filter' {
  class OneEuroFilter {
    constructor(options: {minCutOff: number, beta: number});
    filter(timestamp: number, value: number[]): number[];
    reset(): void;
  }
}
