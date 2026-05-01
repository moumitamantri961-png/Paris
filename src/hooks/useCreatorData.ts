/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { CreatorSettings, Product, Video, Promotion, AppNotification } from '../types';

export function useCreatorData() {
  const [settings, setSettings] = useState<CreatorSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const settingsRef = ref(db, 'creatorSettings');
    const productsRef = ref(db, 'products');
    const videosRef = ref(db, 'videos');
    const promotionsRef = ref(db, 'promotions');
    const notificationsRef = ref(db, 'notifications');

    const unsubSettings = onValue(settingsRef, (snapshot) => {
      setSettings(snapshot.val());
    });

    const unsubProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })));
      } else {
        setProducts([]);
      }
    });

    const unsubVideos = onValue(videosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setVideos(Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })));
      } else {
        setVideos([]);
      }
    });

    const unsubPromotions = onValue(promotionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPromotions(Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })));
      } else {
        setPromotions([]);
      }
    });

    const unsubNotifications = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNotifications(Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })));
      } else {
        setNotifications([]);
      }
      setLoading(false);
    });

    return () => {
      unsubSettings();
      unsubProducts();
      unsubVideos();
      unsubPromotions();
      unsubNotifications();
    };
  }, []);

  return { settings, products, videos, promotions, notifications, loading };
}
