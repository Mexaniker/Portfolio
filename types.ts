import { LucideIcon } from 'lucide-react';

export enum TagType {
  AI = 'AI',
  AUTOMATION = 'Automation',
  WEB = 'Web',
  BOT = 'Bot',
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: TagType[];
  stats?: string; // e.g., "Saved 20hrs/week"
  link?: string;
  // Extended details
  longDescription?: string;
  features?: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  priceStart?: string;
  // Extended details
  longDescription?: string;
  features?: string[];
  iconName?: string;
}

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  icon: LucideIcon;
  iconName?: string;
}

export interface HeroData {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  status: string;
}

export interface ProfileData {
    hero: HeroData;
    socials: SocialLink[];
}