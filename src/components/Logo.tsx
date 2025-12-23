import { motion, HTMLMotionProps } from 'framer-motion';
import logoImage from '@/assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
  spinning?: boolean;
}

const imageSizes = {
  sm: 'h-10 md:h-12',
  md: 'h-12 md:h-16',
  lg: 'h-16 md:h-20',
  xl: 'h-20 md:h-28',
};

export function Logo({ size = 'md', className = '', animate = true, spinning = false }: LogoProps) {
  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps: HTMLMotionProps<'div'> = animate ? { whileTap: { scale: 0.95 } } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`select-none ${className}`}
    >
      <motion.img 
        src={logoImage} 
        alt="La'Couronne - Every Strand Matters"
        className={`${imageSizes[size]} w-auto object-contain`}
        style={{ 
          filter: 'drop-shadow(0 0 10px hsl(48 100% 50% / 0.3))',
        }}
        animate={spinning ? { rotate: 360 } : undefined}
        transition={spinning ? { 
          duration: 3, 
          repeat: Infinity, 
          ease: 'linear' 
        } : undefined}
      />
    </Wrapper>
  );
}

