
export type Priority = 'low' | 'medium' | 'high' | 'emergency';
export type RequestStatus = 
  | 'received' 
  | 'posted_only' 
  | 'sent_only' 
  | 'partial' 
  | 'unavailable' 
  | 'completed';

export type RequestCategory = 'minibar' | 'general';
export type UserRole = 'admin' | 'supervisor' | 'coordinator' | 'attendant';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface MinibarItemState {
  name: string;
  isPosted: boolean;
  isSent: boolean;
  isUnavailable?: boolean;
}

export interface HousekeepingRequest {
  id: string;
  roomNumber: string;
  attendantName: string;
  requestType: string;
  category: RequestCategory;
  items?: string[]; 
  minibarItems?: MinibarItemState[];
  priority: Priority;
  status: RequestStatus;
  timestamp: number;
  notes?: string;
  createdBy: string; // New field: Who created the request
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'beverage' | 'snack' | 'toiletry' | 'other';
  stockCount: number;
  parLevel: number;
  expiryDate: string;
}

export type AppView = 'dashboard' | 'requests' | 'inventory' | 'roster' | 'talk' | 'users' | 'studio' | 'cinematics';

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  description: string;
  steps: string[];
}

export interface ImageResult {
  id: string;
  url: string;
  prompt: string;
  createdAt: number;
}

export interface VideoResult {
  id: string;
  url: string;
  prompt: string;
  createdAt: number;
}
