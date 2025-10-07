declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare const Stats: any;

declare namespace AFRAME {
  interface Component {
    el: any;
    data: any;
    [key: string]: any;
  }
  const THREE: any;
  function registerSystem(name: string, definition: any): void;
  function registerComponent(name: string, definition: any): void;
}

interface Window {
  MINDAR: any;
}
