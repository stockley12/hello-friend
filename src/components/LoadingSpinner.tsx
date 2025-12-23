import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8' },
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizes[size].container} rounded-full border-2 border-primary/20`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner spinning ring */}
        <motion.div
          className={`absolute inset-0 ${sizes[size].container} rounded-full border-2 border-transparent border-t-primary`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Scissors className={`${sizes[size].icon} text-primary`} />
          </motion.div>
        </div>
      </div>
      
      {text && (
        <motion.p
          className="text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Full page loading screen
export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}



