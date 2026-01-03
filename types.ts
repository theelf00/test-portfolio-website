export interface Skill {
  category: string;
  items: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  skills: Skill[];
  tools: string[];
  certifications: string[];
  socials: SocialLink[];
}

export interface ProjectData {
  title: string;
  overview: string;
  problem: string;
  action: string;
  outcome: string;
  toolsUsed: string[];
  reportLink: string;
  repoLink: string;
}

export enum AppMode {
  PROFILE = 'PROFILE',
  PROJECT = 'PROJECT',
}