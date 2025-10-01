import { useCallback, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Mode = 'system' | 'dark' | 'light';

const STORAGE_KEY = '@theme-mode';

export function useAppTheme() {
  const system = useColorScheme();
  const [mode, setModeState] = useState<Mode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        setModeState(stored);
      }
    });
  }, []);

  const setMode = useCallback(async (next: Mode) => {
    setModeState(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const themeName = useMemo(() => {
    if (mode === 'system') return (system ?? 'dark') as 'dark' | 'light';
    return mode as 'dark' | 'light';
  }, [mode, system]);

  return { mode, themeName, setMode } as const;
}
