import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

const menVideos = [
  { src: '/videos/men-1.mp4', label: 'Cornrows', height: 'tall' },
  { src: '/videos/men-2.mp4', label: 'Locs Retwist', height: 'short' },
  { src: '/videos/men-3.mp4', label: 'Box Braids', height: 'medium' },
  { src: '/videos/men-4.mp4', label: 'Freeform Locs', height: 'tall' },
  { src: '/videos/men-5.mp4', label: 'Two Strand Twist', height: 'short' },
  { src: '/videos/men-6.mp4', label: 'Barrel Twist', height: 'medium' },
  { src: '/videos/men-7.mp4', label: 'Fade Design', height: 'short' },
  { src: '/videos/men-8.mp4', label: 'Starter Locs', height: 'tall' },
  { src: '/videos/men-9.mp4', label: 'Man Bun Braids', height: 'medium' },
];

const heightClasses = {
  short: 'h-40 md:h-48',
  medium: 'h-52 md:h-64',
  tall: 'h-64 md:h-80',
};

export function MenGallery() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Split into columns for masonry effect
  const col1 = menVideos.filter((_, i) => i % 3 === 0);
  const col2 = menVideos.filter((_, i) => i % 3 === 1);
  const col3 = menVideos.filter((_, i) => i % 3 === 2);

  const VideoCard = ({ video, index }: { video: typeof menVideos[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl cursor-pointer group ${heightClasses[video.height as keyof typeof heightClasses]}`}
      onClick={() => setSelectedVideo(video.src)}
    >
      <video
        src={video.src}
        muted
        loop
        playsInline
        autoPlay
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      
      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
        <p className="text-foreground font-semibold text-sm md:text-base tracking-wide">
          {video.label}
        </p>
      </div>
      
      {/* Play icon on hover */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm border border-primary-foreground/20">
          <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-1" />
        </div>
      </motion.div>
      
      {/* Border effect */}
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/50 rounded-xl transition-colors duration-300" />
    </motion.div>
  );

  return (
    <>
      {/* Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-3 md:gap-4">
          {col1.map((video, i) => (
            <VideoCard key={video.src} video={video} index={i * 3} />
          ))}
        </div>
        
        {/* Column 2 */}
        <div className="flex flex-col gap-3 md:gap-4">
          {col2.map((video, i) => (
            <VideoCard key={video.src} video={video} index={i * 3 + 1} />
          ))}
        </div>
        
        {/* Column 3 - hidden on mobile */}
        <div className="hidden md:flex flex-col gap-3 md:gap-4">
          {col3.map((video, i) => (
            <VideoCard key={video.src} video={video} index={i * 3 + 2} />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selectedVideo}
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-full object-contain bg-background"
              />
              
              {/* Close button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
