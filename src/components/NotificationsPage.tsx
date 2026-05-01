/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppNotification } from '../types';
import { Bell, BellOff, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PageProps {
  notifications: AppNotification[];
}

export default function NotificationsPage({ notifications }: PageProps) {
  const [readIds, setReadIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('read_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('read_notifications', JSON.stringify(readIds));
  }, [readIds]);

  const sortedNotifications = [...notifications].sort((a, b) => b.timestamp - a.timestamp);

  const markAllRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  const markAsRead = (id: string, link?: string) => {
    if (!readIds.includes(id)) {
      setReadIds(prev => [...prev, id]);
    }
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="px-4 py-2 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Notifications</h2>
        {notifications.some(n => !readIds.includes(n.id)) && (
          <button 
            onClick={markAllRead}
            className="text-xs font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedNotifications.map((notif) => {
            const isRead = readIds.includes(notif.id);
            return (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => markAsRead(notif.id, notif.link)}
                className={`flex gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98] cursor-pointer ${
                  isRead 
                    ? 'bg-white border-neutral-100 opacity-60' 
                    : 'bg-white border-primary/20 shadow-md shadow-primary/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isRead ? 'bg-neutral-100 text-neutral-400' : 'bg-primary/10 text-primary'
                }`}>
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-sm leading-snug ${isRead ? 'text-neutral-600' : 'font-semibold text-neutral-900'}`}>
                      {notif.message}
                    </p>
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-neutral-400">
                      {new Date(notif.timestamp).toLocaleDateString()} at {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {notif.link && (
                      <ArrowRight size={12} className="text-primary" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
          <div className="bg-neutral-100 p-6 rounded-full mb-4">
            <BellOff size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-bold text-neutral-700">Clean slate!</h3>
          <p className="text-neutral-500 text-sm mt-1">You don't have any notifications right now.</p>
        </div>
      )}
    </div>
  );
}
