/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Product } from '../types';
import { BadgeCheck, Bookmark, ShoppingBag, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PageProps {
  products: Product[];
  onOpenProduct: (p: Product) => void;
}

export default function ProductsPage({ products, onOpenProduct }: PageProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="py-2">
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto px-4 no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              activeCategory === cat 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                : "bg-white text-neutral-600 border border-neutral-100"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 pb-12">
        {filteredProducts.map(product => {
          const isFree = product.price === "0" || product.price.toLowerCase() === "free";
          const discount = product.originalPrice && !isFree 
            ? Math.round((1 - (parseFloat(product.price) / parseFloat(product.originalPrice))) * 100)
            : 0;

          return (
            <motion.div
              key={product.id}
              onClick={() => onOpenProduct(product)}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm flex flex-col group active:scale-95 transition-transform"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/eeeeee/999999?text=📦';
                  }}
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.featured && (
                    <span className="bg-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full text-yellow-950 uppercase">
                      Featured
                    </span>
                  )}
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                    isFree ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
                  )}>
                    {isFree ? "Free" : "Paid"}
                  </span>
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="font-bold text-sm line-clamp-1 mb-1">{product.title}</h3>
                <p className="text-neutral-500 text-[10px] line-clamp-1 mb-2">
                  {product.category}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.originalPrice && (
                      <span className="text-[10px] text-neutral-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                    <span className="font-bold text-primary text-sm">
                      {isFree ? "FREE" : `$${product.price}`}
                    </span>
                  </div>
                  <button className="p-1.5 bg-neutral-50 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <ShoppingBag size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
          <div className="bg-neutral-100 p-6 rounded-full mb-4">
            <ShoppingBag size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-bold text-neutral-700">No products found</h3>
          <p className="text-neutral-500 text-sm mt-1">Try another category or check back later.</p>
        </div>
      )}
    </div>
  );
}
