/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CreatorSettings {
  name: string;
  tagline: string;
  logo: string;
  heroBanner?: string;
  subscribers: string;
  bio: string;
  marquee?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  telegramUrl?: string;
  twitterUrl?: string;
  whatsappUrl?: string;
  websiteUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string; // newline-separated list
  thumbnail: string;
  buyLink: string;
  featured?: boolean;
  createdAt: number;
}

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnail: string;
  description: string;
  duration: string;
  views: string;
  date: string;
  createdAt: number;
}

export interface Promotion {
  id: string;
  img: string;
  title: string;
  link: string;
}

export interface AppNotification {
  id: string;
  message: string;
  icon: string;
  link?: string;
  targetType: "ALL";
  timestamp: number;
}
