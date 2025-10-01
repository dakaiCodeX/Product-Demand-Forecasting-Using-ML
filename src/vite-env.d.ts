/// <reference types="vite/client" />

declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module '*.jsx' {
  import type { ComponentType } from 'react';
  const component: ComponentType<any>;
  export default component;
}
