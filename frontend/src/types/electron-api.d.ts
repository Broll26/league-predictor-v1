export {};

declare global {
  interface Window {
    electronAPI: {
      ping: () => void;
    };
  }
}
