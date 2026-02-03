export type PriceUnit =
  | 'per_hour'
  | 'per_day'
  | 'per_unit'
  | 'per_sqft'
  | 'per_project';
export type ItemType = 'Service' | 'Material' | 'Product' | 'Subscription';
export type SubscriptionFrequency =
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'biannual'
  | 'yearly';

export interface PriceBookItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  unit: PriceUnit;
  cost?: number;
  supplier?: string;
  inStock?: number;
  minStock?: number;
  image?: string;
  tags: string[];
  subscriptionFrequency?: SubscriptionFrequency;
  subscriptionDetails?: string;
}

export interface Service {
  id: string;
  type: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  unit: string;
  cost?: number;
  supplier?: string;
  inStock?: number;
  minStock?: number;
  image?: string;
  tags: string[];
  subscriptionFrequency?: string;
  subscriptionDetails?: string;
}

export interface ServiceItem {
  id: string;
  type: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  unit: string;
  cost?: number;
  supplier?: string;
  inStock?: number;
  minStock?: number;
  image_path?: string;
  tags: string;
  subscriptionFrequency?: string;
  subscriptionDetails?: string;
}
