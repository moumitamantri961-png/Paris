/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { useCreatorData } from './hooks/useCreatorData';
import { Product, Video } from './types';
import { Marquee } from './components/Marquee';
import { BottomSheet } from './components/BottomSheet';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import VideosPage, { getYouTubeId } from './components/VideosPage';
import NotificationsPage from './components/NotificationsPage';
import AccountPage from './components/AccountPage';
import { 
  Home as HomeIcon, 
  ShoppingBag, 
  Youtube, 
  User, 
  Bell, 
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'home' | 'products' | 'videos' | 'notifications' | 'account';

export default function App() {
  const { settings, products, videos, promotions, notifications, loading } = useCreatorData();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const [readNotifications] = useState<string[]>(() => {
    const saved = localStorage.getItem('read_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readNotifications.includes(n.id)).length;
  }, [notifications, readNotifications]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-12 text-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6"
        >
          <Youtube size={40} />
        </motion.div>
        <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">Creator Space</h2>
        <p className="text-neutral-400 text-sm mt-2">Personalizing your experience...</p>
        <div className="mt-8 w-48 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-full h-full bg-primary"
          />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            settings={settings} 
            promotions={promotions} 
            products={products} 
            videos={videos}
            onOpenProduct={setSelectedProduct}
            onOpenVideo={setSelectedVideo}
            onOpenNotifications={() => setActiveTab('notifications')}
          />
        );
      case 'products':
        return <ProductsPage products={products} onOpenProduct={setSelectedProduct} />;
      case 'videos':
        return <VideosPage videos={videos} onOpenVideo={setSelectedVideo} />;
      case 'notifications':
        return <NotificationsPage notifications={notifications} />;
      case 'account':
        return <AccountPage settings={settings} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col max-w-lg mx-auto shadow-2xl bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary/5 shadow-sm">
            <img src={settings?.logo || 'https://api.dicebear.com/7.x/initials/svg?seed=C'} alt="logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-extrabold text-lg tracking-tight text-neutral-900 truncate max-w-[150px]">
            {settings?.name || "Creator"}
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="p-2.5 bg-neutral-100 rounded-full text-neutral-500 active:scale-95 transition-transform">
            <Search size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className="p-2.5 bg-neutral-100 rounded-full text-neutral-500 relative active:scale-95 transition-transform"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Marquee Bar */}
      <Marquee text={settings?.marquee} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-neutral-100 pb-safe z-40 max-w-lg mx-auto">
        <div className="flex justify-around items-center h-16 px-4">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<HomeIcon size={22} />} 
          />
          <NavButton 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')} 
            icon={<ShoppingBag size={22} />} 
          />
          <NavButton 
            active={activeTab === 'videos'} 
            onClick={() => setActiveTab('videos')} 
            icon={<Youtube size={22} />} 
          />
          <NavButton 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
            icon={<Bell size={22} />} 
            badge={unreadCount}
          />
          <NavButton 
            active={activeTab === 'account'} 
            onClick={() => setActiveTab('account')} 
            icon={<User size={22} />} 
          />
        </div>
      </nav>

      {/* Product Detail Bottom Sheet */}
      <BottomSheet 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        title="Product Detail"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100">
              <img 
                src={selectedProduct.thumbnail} 
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/eeeeee/999999?text=📦';
                }}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {selectedProduct.featured && (
                  <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg shadow-black/10">
                    <Award size={12} />
                    Featured
                  </span>
                )}
                <span className="bg-primary/20 backdrop-blur-md text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg shadow-black/10">
                  {selectedProduct.category}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-2xl font-black tracking-tight text-neutral-900 leading-tight">
                  {selectedProduct.title}
                </h2>
                <div className="text-right shrink-0">
                  {selectedProduct.originalPrice && selectedProduct.originalPrice !== "0" && (
                    <p className="text-neutral-400 text-sm line-through decoration-primary/30">
                      ${selectedProduct.originalPrice}
                    </p>
                  )}
                  <p className="text-2xl font-black text-primary">
                    {selectedProduct.price === "0" || selectedProduct.price.toLowerCase() === "free" ? "FREE" : `$${selectedProduct.price}`}
                  </p>
                </div>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary" />
                  What's included
                </h4>
                <div className="space-y-3">
                  {selectedProduct.features.split('\n').filter(f => f.trim()).map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 bg-green-100 rounded-full p-0.5">
                        <CheckCircle2 size={14} className="text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-neutral-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <a
              href={selectedProduct.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-primary text-white text-center py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 active:scale-95 transition-transform flex items-center justify-center gap-3"
            >
              {selectedProduct.price === "0" || selectedProduct.price.toLowerCase() === "free" ? "Get for Free" : "Buy Now"}
              <ExternalLink size={20} />
            </a>
          </div>
        )}
      </BottomSheet>

      {/* Video Detail Bottom Sheet */}
      <BottomSheet 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)}
        title="Video Preview"
      >
        {selectedVideo && (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl">
              <img 
                src={`https://img.youtube.com/vi/${getYouTubeId(selectedVideo.youtubeUrl)}/maxresdefault.jpg`} 
                alt="thumb"
                className="w-full h-full object-cover opacity-80"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYouTubeId(selectedVideo.youtubeUrl)}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <a 
                  href={selectedVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF0000] shadow-2xl shadow-red-500/50 hover:scale-110 transition-transform"
                >
                  <Youtube size={40} fill="#FF0000" />
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 leading-tight">{selectedVideo.title}</h2>
              <div className="flex gap-4 mb-4">
                <div className="px-3 py-1 bg-neutral-100 rounded-lg text-[11px] font-bold text-neutral-500 flex items-center gap-1.5 uppercase">
                  <TrendingUp size={12} />
                  {selectedVideo.views} views
                </div>
                <div className="px-3 py-1 bg-neutral-100 rounded-lg text-[11px] font-bold text-neutral-500 flex items-center gap-1.5 uppercase">
                  <CheckCircle2 size={12} />
                  {selectedVideo.date}
                </div>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedVideo.description}
              </p>
            </div>

            <a
              href={selectedVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#FF0000] text-white text-center py-5 rounded-2xl font-bold text-lg shadow-xl shadow-red-500/20 active:scale-95 transition-transform flex items-center justify-center gap-3"
            >
              Watch on YouTube
              <Youtube size={24} />
            </a>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function NavButton({ active, onClick, icon, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative p-3 rounded-2xl transition-all duration-300 active:scale-90",
        active ? "bg-primary/10 text-primary" : "text-neutral-400"
      )}
    >
      <div className={cn("transition-transform", active ? "scale-110" : "scale-100")}>
        {icon}
      </div>
      {active && (
        <motion.div 
          layoutId="active-tab"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
        />
      )}
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
          {badge}
        </span>
      )}
    </button>
  );
}
