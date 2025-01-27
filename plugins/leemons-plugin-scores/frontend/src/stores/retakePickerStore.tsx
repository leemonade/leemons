import { createContext, useContext, useState } from 'react';

import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface State {
  students: Record<
    string,
    {
      selectedRetake: string | null;
    }
  >;
}

interface Actions {
  pickRetake: (studentId: string, retakeId: string | null, order: number) => void;
}

export const createPickRetakeStore = () =>
  createStore<State & Actions>()(
    immer((set) => ({
      students: {},
      pickRetake: (studentId, retakeId, order) =>
        set((state) => {
          const newStudents = {
            ...state.students,
            [studentId]: {
              selectedRetake: retakeId ?? `${order}`,
            },
          };
          return { students: newStudents };
        }),
    }))
  );

type RetakePickerStore = ReturnType<typeof createPickRetakeStore>;

export const Context = createContext<RetakePickerStore | null>(null);

export function RetakePickerProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => createPickRetakeStore());

  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useRetakePicker<T>(selector?: (state: State & Actions) => T) {
  const store = useContext(Context);

  if (!store) {
    throw new Error('RetakePickerProvider not found');
  }

  return useStore(store, selector);
}
