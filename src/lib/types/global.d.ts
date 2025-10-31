declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config?: { [key: string]: any }
    ) => void;
  }
}

// This export is needed to make the file a module,
// which is required for 'declare global'
export {};
