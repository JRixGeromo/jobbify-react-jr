export type ItemType = 'Service' | 'Material' | 'Product' | 'Subscription';
export type PriceUnit =
  | 'per_hour'
  | 'per_day'
  | 'per_unit'
  | 'per_sqft'
  | 'per_project';
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

export const categories = [
  'Plumbing',
  'Electrical',
  'HVAC',
  'Construction',
  'Cleaning',
  'Tools',
  'Safety Equipment',
  'General Supplies',
  'Maintenance Plans',
];

export const priceBookItems: PriceBookItem[] = [
  {
    id: '1',
    type: 'Service',
    name: 'Basic Plumbing Service',
    description: 'Standard plumbing inspection and minor repairs',
    sku: 'SRV-PLM-001',
    category: 'Plumbing',
    price: 95,
    unit: 'per_hour',
    tags: ['plumbing', 'inspection', 'repairs'],
  },
  {
    id: '2',
    type: 'Material',
    name: 'Copper Pipe 1/2"',
    description: 'Type L copper pipe, 1/2 inch diameter',
    sku: 'MAT-COP-001',
    category: 'Plumbing',
    price: 12.99,
    unit: 'per_unit',
    cost: 8.5,
    supplier: 'ABC Supply Co',
    inStock: 150,
    minStock: 50,
    image:
      'https://images.unsplash.com/photo-1635705163669-3c7a73b4cb5b?w=400&h=400&fit=crop',
    tags: ['plumbing', 'pipes', 'copper'],
  },
  {
    id: '3',
    type: 'Product',
    name: 'Smart Thermostat',
    description: 'WiFi-enabled programmable thermostat',
    sku: 'PRD-THR-001',
    category: 'HVAC',
    price: 249.99,
    unit: 'per_unit',
    cost: 175,
    supplier: 'Tech Distributors',
    inStock: 25,
    minStock: 10,
    image:
      'https://images.unsplash.com/photo-1567925077526-6d3989754569?w=400&h=400&fit=crop',
    tags: ['hvac', 'smart home', 'thermostat'],
  },
  {
    id: '4',
    type: 'Service',
    name: 'Electrical Panel Upgrade',
    description: 'Upgrade electrical panel to 200amp service',
    sku: 'SRV-ELC-001',
    category: 'Electrical',
    price: 2500,
    unit: 'per_project',
    tags: ['electrical', 'panel', 'upgrade'],
  },
  {
    id: '5',
    type: 'Material',
    name: 'LED Light Bulb Pack',
    description: '60W equivalent LED bulbs, 10-pack',
    sku: 'MAT-LED-001',
    category: 'Electrical',
    price: 34.99,
    unit: 'per_unit',
    cost: 22.5,
    supplier: 'Lighting Supply Co',
    inStock: 75,
    minStock: 30,
    image:
      'https://images.unsplash.com/photo-1624628639856-100bf817fd35?w=400&h=400&fit=crop',
    tags: ['electrical', 'lighting', 'led'],
  },
  {
    id: '6',
    type: 'Subscription',
    name: 'HVAC Maintenance Plan',
    description:
      'Regular HVAC maintenance including inspections, filter changes, and tune-ups',
    sku: 'SUB-HVAC-001',
    category: 'Maintenance Plans',
    price: 199.99,
    unit: 'per_project',
    subscriptionFrequency: 'quarterly',
    subscriptionDetails:
      'Includes quarterly inspections, filter changes, and system optimization',
    tags: ['hvac', 'maintenance', 'subscription'],
  },
  {
    id: '7',
    type: 'Subscription',
    name: 'Premium Home Care',
    description:
      'Comprehensive home maintenance plan including plumbing, electrical, and HVAC',
    sku: 'SUB-HOME-001',
    category: 'Maintenance Plans',
    price: 499.99,
    unit: 'per_project',
    subscriptionFrequency: 'monthly',
    subscriptionDetails:
      'Monthly inspections of all major home systems with priority service',
    tags: ['maintenance', 'subscription', 'comprehensive'],
  },
];
