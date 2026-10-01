import { useEffect, useState, useRef } from 'react';

interface UsePullToRefreshOptions {
  onRefresh?: () => void;
  threshold?: number; // pull distance in px to trigger refresh
}

export function usePullToRefresh({
  onRefresh = () => window.location.reload(),
  threshold = 70,
}: UsePullToRefreshOptions = {}) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const isPullingRef = useRef(false);

  useEffect(() => {
    // Only bind on touch devices
    if (typeof window === 'undefined' || !('ontouchstart' in window)) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only initiate pull-to-refresh if page is scrolled to the very top
      if (window.scrollY <= 0 && e.touches.length === 1) {
        startYRef.current = e.touches[0].clientY;
        isPullingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current || startYRef.current === null || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const rawDiff = currentY - startYRef.current;

      // Only pull down if at top of page
      if (window.scrollY <= 0 && rawDiff > 0) {
        // Damping formula for natural elastic tension
        const damped = Math.min(100, Math.pow(rawDiff, 0.85) * 1.5);
        setPullDistance(damped);

        // Haptic feedback once threshold is crossed
        if (damped >= threshold && 'vibrate' in navigator && (navigator as any)._hasVibrated !== true) {
          try {
            navigator.vibrate(15);
            (navigator as any)._hasVibrated = true;
          } catch {
            // ignore
          }
        }
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;
      startYRef.current = null;
      (navigator as any)._hasVibrated = false;

      setPullDistance((prev) => {
        if (prev >= threshold && !isRefreshing) {
          setIsRefreshing(true);
          try {
            if ('vibrate' in navigator) navigator.vibrate(25);
          } catch {
            // ignore
          }
          setTimeout(() => {
            onRefresh();
          }, 350);
          return threshold;
        }
        return 0;
      });
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [threshold, isRefreshing, onRefresh]);

  return { pullDistance, isRefreshing, threshold };
}
