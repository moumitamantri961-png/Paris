/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Video } from '../types';
import { PlayCircle, Eye, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface PageProps {
  videos: Video[];
  onOpenVideo: (v: Video) => void;
}

export function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function VideosPage({ videos, onOpenVideo }: PageProps) {
  return (
    <div className="px-4 py-2 pb-20">
      <div className="space-y-4">
        {videos.map((video) => {
          const ytId = getYouTubeId(video.youtubeUrl);
          const thumbUrl = ytId 
            ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` 
            : video.thumbnail;

          return (
            <motion.div
              key={video.id}
              onClick={() => onOpenVideo(video)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm group active:scale-[0.98] transition-transform"
            >
              <div className="relative aspect-video overflow-hidden bg-neutral-200">
                <img 
                  src={thumbUrl} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('maxresdefault')) {
                      // Fallback to hqdefault if maxres doesn't exist
                      target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                    } else {
                      target.src = 'https://placehold.co/640x360/eeeeee/999999?text=YouTube+Video';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                    <PlayCircle size={32} fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-4 text-neutral-400 text-[11px]">
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{video.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{video.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
          <div className="bg-neutral-100 p-6 rounded-full mb-4">
            <PlayCircle size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-bold text-neutral-700">No videos yet</h3>
          <p className="text-neutral-500 text-sm mt-1">New videos are uploaded regularly. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
