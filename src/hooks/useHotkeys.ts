import { useEffect, useRef } from 'react';

/**
 * NEW_FEATURE: This file contains a custom React hook for handling keyboard shortcuts.
 * It provides a declarative and efficient way to bind callbacks to key presses.
 */

interface HotkeyConfig {
  key: string;
  callback: (event: KeyboardEvent) => void;
  /**
   * Whether to call `event.preventDefault()`. Defaults to `true`.
   */
  preventDefault?: boolean;
}

/**
 * A custom React hook to manage global keyboard shortcuts.
 * It's designed to be efficient by only adding the event listener once
 * and using a ref to keep callbacks up-to-date without re-attaching the listener.
 *
 * @param configs An array of hotkey configurations. This array can be redefined
 * on every render without performance penalties.
 */
export const useHotkeys = (configs: HotkeyConfig[]) => {
  const savedConfigs = useRef(configs);

  // Keep the ref updated with the latest configs on each render.
  useEffect(() => {
    savedConfigs.current = configs;
  }, [configs]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const config = savedConfigs.current.find(c => c.key === event.key);
      if (config) {
        // Default to preventing default browser behavior (e.g., spacebar scrolling).
        if (config.preventDefault !== false) {
          event.preventDefault();
        }
        config.callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts.
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures the listener is only attached once.
};
