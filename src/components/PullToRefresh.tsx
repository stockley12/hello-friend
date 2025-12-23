import { useState, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { haptics } from '@/lib/haptics';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

export function PullToRefresh({ children, onRefresh, disabled }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const pullProgress = useTransform(y, [0, 100], [0, 1]);
  const rotate = useTransform(y, [0, 100], [0, 360]);
  
  const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled || isRefreshing) return;
    
    // Check if at top of scroll
    const container = containerRef.current;
    if (container && container.scrollTop > 0) return;
    
    if (info.offset.y > 80) {
      setIsRefreshing(true);
      haptics.medium();
      
      try {
        await onRefresh();
        haptics.success();
      } catch {
        haptics.error();
      } finally {
        setIsRefreshing(false);
      }
    }
  };
  
  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-10 pointer-events-none"
        style={{ 
          y: useTransform(y, [0, 100], [-40, 20]),
          opacity: pullProgress 
        }}
      >
        <motion.div
          className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center ${
            isRefreshing ? 'animate-pulse' : ''
          }`}
          style={{ rotate: isRefreshing ? undefined : rotate }}
          animate={isRefreshing ? { rotate: 360 } : undefined}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : undefined}
        >
          <RefreshCw className="w-5 h-5 text-primary" />
        </motion.div>
      </motion.div>
      
      {/* Content */}
      <motion.div
        drag={disabled || isRefreshing ? false : 'y'}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}



