export type EventHandlerMap = {
  [eventName: string]: Function[];
};

// Declare the global leemons type for TypeScript
declare global {
  const leemons: {
    log: {
      debug: (message: string) => void;
    };
  };
}
