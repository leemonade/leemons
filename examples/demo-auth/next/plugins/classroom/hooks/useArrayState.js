import { useState } from 'react';

export default function useArrayState(initialState) {
  const [items, setItems] = useState(initialState);

  const pushItems = (newItems) => {
    if (Array.isArray(newItems)) {
      setItems([...items, ...newItems]);
    } else {
      setItems([...items, newItems]);
    }
  };

  const removeItems = (f) => {
    setItems(items.filter((...args) => !f(...args)));
  };

  const findItems = (f) => items.filter(f);

  return [items, { setItems, pushItems, removeItems, findItems }];
}
