/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { CreatorSettings } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LogOut, Mail, Lock, User, Youtube, Instagram, Send, Twitter, MessageCircle, Globe, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PageProps {
  settings: CreatorSettings | null;
}

export default function AccountPage({ settings }: PageProps) {
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const socialLinks = [
    { icon: <Youtube className="text-[#FF0000]" />, label: 'YouTube', url: settings?.youtubeUrl },
    { icon: <Instagram className="text-[#E4405F]" />, label: 'Instagram', url: settings?.instagramUrl },
    { icon: <Send className="text-[#24A1DE]" />, label: 'Telegram', url: settings?.telegramUrl },
    { icon: <Twitter className="text-[#1DA1F2]" />, label: 'Twitter', url: settings?.twitterUrl },
    { icon: <MessageCircle className="text-[#25D366]" />, label: 'WhatsApp', url: settings?.whatsappUrl },
    { icon: <Globe className="text-[#4A4A4A]" />, label: 'Website', url: settings?.websiteUrl },
  ].filter(link => link.url);

  return (
    <div className="px-5 py-4 pb-20 max-w-lg mx-auto">
      {/* Auth Section */}
      <div className="mb-10">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-primary to-rose-600 p-6 rounded-3xl shadow-xl shadow-primary/20 text-white"
            >
              <h2 className="text-xl font-bold mb-2">Join my community!</h2>
              <p className="text-white/80 text-sm mb-6">Sign in to sync your notifications and access exclusive content.</p>
              
              <button 
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-neutral-900 rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Continuar con Google
              </button>

              <div className="my-4 flex items-center gap-4">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-xs uppercase font-bold text-white/40">OR</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div className="space-y-1">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 pl-10 pr-4 text-sm placeholder:text-white/40 focus:outline-none focus:bg-white/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                    <input 
                      type="password" 
                      placeholder="Password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-2.5 pl-10 pr-4 text-sm placeholder:text-white/40 focus:outline-none focus:bg-white/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                {error && <p className="text-[10px] text-yellow-200 mt-1">{error}</p>}

                <button 
                  type="submit"
                  className="w-full bg-white/20 hover:bg-white/30 text-white rounded-xl py-3 font-semibold text-sm transition-colors border border-white/20"
                >
                  {isSignUp ? "Create Account" : "Sign In with Email"}
                </button>
                
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full text-center text-xs text-white/70 hover:text-white underline"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="user"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-lg shadow-neutral-100 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                  alt="Avatar"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <h2 className="font-bold text-lg truncate">{user.displayName || "User"}</h2>
                <p className="text-neutral-500 text-sm truncate">{user.email}</p>
              </div>
              <button 
                onClick={() => signOut(auth)}
                className="p-3 bg-neutral-100 text-neutral-600 rounded-2xl active:scale-95 transition-transform"
              >
                <LogOut size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Creator Profile */}
      <h3 className="text-neutral-400 uppercase text-[10px] font-bold tracking-widest mb-4 px-1">About Creator</h3>
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm mb-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-neutral-50 shadow-inner">
            <img 
              src={settings?.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${settings?.name || "C"}`} 
              className="w-full h-full object-cover" 
              alt="Logo" 
            />
          </div>
          <h2 className="text-xl font-bold">{settings?.name || "Project Creator"}</h2>
          <p className="text-primary font-medium text-sm mt-0.5">{settings?.tagline}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-neutral-50 px-3 py-1 rounded-full text-xs font-semibold text-neutral-600">
            <Youtube size={14} className="text-red-500" />
            <span>{settings?.subscribers || "0"} Subscribers</span>
          </div>
        </div>

        <div className="border-t border-dashed border-neutral-100 pt-6">
          <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-wrap">
            {settings?.bio || "No bio available."}
          </p>
        </div>
      </div>

      {/* Social Links */}
      <h3 className="text-neutral-400 uppercase text-[10px] font-bold tracking-widest mb-4 px-1">Social Networks</h3>
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden mb-8">
        {socialLinks.map((link, idx) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between p-4 active:bg-neutral-50 transition-colors ${
              idx !== socialLinks.length - 1 ? 'border-b border-neutral-50' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center p-2">
                {link.icon}
              </div>
              <span className="font-semibold text-neutral-800 text-sm">{link.label}</span>
            </div>
            <ChevronRight size={18} className="text-neutral-300" />
          </a>
        ))}
      </div>
    </div>
  );
}
