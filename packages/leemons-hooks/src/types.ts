export type EventHandler = (params: { eventName: string; args: any[] }) => Promise<any[]> | any[];

export type EventHandlerMap = {
  [eventName: string]: EventHandler[];
};

// Declare the global leemons type for TypeScript
declare global {
  const leemons: {
    log: {
      debug: (message: string) => void;
    };
  };
}
