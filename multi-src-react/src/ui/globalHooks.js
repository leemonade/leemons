import { useEffect } from 'react';

export default function useUi() {
  useEffect(() => {
    console.log('Welcome to Leemons, the UI Plugin is installed');
  }, []);
}
