import React from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  isRefreshing,
  threshold,
}) => {
  if (pullDistance <= 0 && !isRefreshing) return null;

  const isReady = pullDistance >= threshold;
  const rotation = isRefreshing ? 0 : (pullDistance / threshold) * 270;

  return (
    <div
      className="fixed top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-transform duration-75 ease-out select-none"
      style={{
        transform: `translate(-50%, ${Math.max(0, pullDistance - 20)}px)`,
      }}
      aria-hidden="true"
    >
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-700/80 shadow-lg shadow-black/10 text-xs font-medium text-zinc-700 dark:text-zinc-200">
        <RefreshCw
          className={`w-3.5 h-3.5 text-rose-500 transition-transform ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          style={{
            transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
          }}
        />
        <span className="text-[11px] sm:text-xs">
          {isRefreshing
            ? 'Yenileniyor...'
            : isReady
            ? 'Bırak ve Yenile'
            : 'Yenilemek için çekin'}
        </span>
      </div>
    </div>
  );
};
