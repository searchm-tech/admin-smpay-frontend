export {};

declare global {
  interface Window {
    ChannelIO?: (...args: any[]) => void;
  }
}
