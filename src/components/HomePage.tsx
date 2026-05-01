/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CreatorSettings, Product, Video, Promotion } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { getYouTubeId } from './VideosPage';
import { Search, ShoppingBag, Youtube, Bell, ArrowRight, Play, Eye } from 'lucide-react';

interface PageProps {
  settings: CreatorSettings | null;
  promotions: Promotion[];
  products: Product[];
  videos: Video[];
  onOpenProduct: (p: Product) => void;
  onOpenVideo: (v: Video) => void;
  onOpenNotifications: () => void;
}

export default function HomePage({ settings, promotions, products, videos, onOpenProduct, onOpenVideo, onOpenNotifications }: PageProps) {
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    if (promotions.length > 1) {
      const timer = setInterval(() => {
        setPromoIndex((prev) => (prev + 1) % promotions.length);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [promotions.length]);

  const featuredProducts = products.filter(p => p.featured || true).slice(0, 4);
  const recentVideos = videos.slice(0, 3);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="px-4 pt-2 mb-6">
        {settings?.heroBanner ? (
          <div className="relative w-full aspect-[2/1] rounded-3xl overflow-hidden shadow-xl shadow-neutral-200">
            <img src={settings.heroBanner} className="w-full h-full object-cover" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <h2 className="text-white text-2xl font-bold tracking-tight">{settings.name}</h2>
              <p className="text-white/70 text-sm mt-1">{settings.tagline}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-50 shadow-inner">
              <img src={settings?.logo || 'https://api.dicebear.com/7.x/initials/svg?seed=C'} className="w-full h-full object-cover" alt="Logo" />
            </div>
            <div>
              <h2 className="font-bold text-xl">{settings?.name || "Creator Space"}</h2>
              <p className="text-primary text-xs font-semibold uppercase tracking-wider mt-1">{settings?.tagline}</p>
              <div className="flex gap-4 mt-3">
                <div className="text-center">
                  <p className="text-lg font-bold leading-none">{products.length}</p>
                  <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold">Products</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold leading-none">{videos.length}</p>
                  <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold">Videos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold leading-none">{settings?.subscribers || "0"}</p>
                  <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold">Fans</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Promotions */}
      {promotions.length > 0 && (
        <div className="px-4 mb-8">
          <div className="relative aspect-[16/6] rounded-2xl overflow-hidden shadow-lg shadow-primary/5">
            <AnimatePresence mode="wait">
              <motion.a
                key={promotions[promoIndex].id}
                href={promotions[promoIndex].link}
                target="_blank"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0 block"
              >
                <img src={promotions[promoIndex].img} className="w-full h-full object-cover" alt={promotions[promoIndex].title} />
                <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                  <h3 className="text-white font-bold text-sm">{promotions[promoIndex].title}</h3>
                </div>
              </motion.a>
            </AnimatePresence>
            
            {/* Indicators */}
            <div className="absolute bottom-2 right-4 flex gap-1.5 focus-within:ring-2">
              {promotions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPromoIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${promoIndex === i ? 'bg-primary w-4' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="mb-8">
        <div className="px-5 mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            Top Products
          </h3>
          <button className="text-primary text-xs font-bold uppercase tracking-wider">See All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
          {featuredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => onOpenProduct(product)}
              className="w-48 shrink-0 bg-white rounded-2xl border border-neutral-100 p-2 shadow-sm active:scale-95 transition-transform"
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-3">
                <img src={product.thumbnail} className="w-full h-full object-cover" alt={product.title} />
              </div>
              <h4 className="font-bold text-xs line-clamp-1 mb-1">{product.title}</h4>
              <p className="text-primary font-bold text-xs">${product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Videos */}
      <div className="mb-8">
        <div className="px-5 mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Youtube size={20} className="text-[#FF0000]" />
            Trending Right Now
          </h3>
          <button className="text-primary text-xs font-bold uppercase tracking-wider">Watch More</button>
        </div>
        <div className="px-4 space-y-4">
          {recentVideos.map(video => {
            const ytId = getYouTubeId(video.youtubeUrl);
            const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : video.thumbnail;
            return (
              <div 
                key={video.id} 
                onClick={() => onOpenVideo(video)}
                className="flex gap-4 bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="w-24 aspect-video rounded-xl overflow-hidden bg-neutral-100 shrink-0 relative">
                  <img src={thumbUrl} className="w-full h-full object-cover" alt="thumb" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={12} fill="white" className="text-white" />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-[13px] line-clamp-2 leading-tight mb-2 tracking-tight">{video.title}</h4>
                  <div className="flex items-center gap-2 text-neutral-400 text-[10px]">
                    <span className="flex items-center gap-1"><Eye size={10} /> {video.views}</span>
                    <span>•</span>
                    <span>{video.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
