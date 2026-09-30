import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  isEnabled?: boolean;
}

export function useKeyboardShortcuts({
  onToggle,
  onReset,
  onSkip,
  isEnabled = true,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea, or contentEditable element
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        onToggle();
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        onReset();
      } else if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle, onReset, onSkip, isEnabled]);
}
