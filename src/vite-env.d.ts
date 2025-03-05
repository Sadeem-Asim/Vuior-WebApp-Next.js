/// <reference types="vite/client" />
declare global {
  interface Window {
    Elfsight?: {
      init: () => void;
    };
  }
}
