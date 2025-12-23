import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { haptics } from '@/lib/haptics';

interface Card {
  id: string;
  content: React.ReactNode;
}

interface SwipeableCardsProps {
  cards: Card[];
  onSwipe?: (direction: 'left' | 'right', cardId: string) => void;
}

export function SwipeableCards({ cards, onSwipe }: SwipeableCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    haptics.selection();
    
    if (direction === 'left' && currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    
    onSwipe?.(direction, cards[currentIndex].id);
  };
  
  return (
    <div className="relative w-full h-full">
      {cards.map((card, index) => (
        <SwipeableCard
          key={card.id}
          isActive={index === currentIndex}
          offset={index - currentIndex}
          onSwipe={handleSwipe}
        >
          {card.content}
        </SwipeableCard>
      ))}
      
      {/* Dots indicator */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary w-6' 
                : 'bg-foreground/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

interface SwipeableCardProps {
  children: React.ReactNode;
  isActive: boolean;
  offset: number;
  onSwipe: (direction: 'left' | 'right') => void;
}

function SwipeableCard({ children, isActive, offset, onSwipe }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.8, 1, 0.8, 0.5]);
  
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    
    if (Math.abs(info.offset.x) > threshold) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };
  
  if (Math.abs(offset) > 2) return null;
  
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: isActive ? x : 0,
        rotate: isActive ? rotate : 0,
        opacity: isActive ? opacity : 0.5,
        scale: 1 - Math.abs(offset) * 0.1,
        zIndex: 10 - Math.abs(offset),
      }}
      animate={{
        x: offset * 30,
        opacity: isActive ? 1 : 0.5 - Math.abs(offset) * 0.2,
      }}
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}



