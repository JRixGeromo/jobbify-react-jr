export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  startingPrice: string;
}

export const services: Service[] = [
  {
    id: '1',
    name: 'Plumbing Services',
    description: 'Professional plumbing repairs and installations',
    duration: '1-3 hours',
    startingPrice: '$150',
  },
  {
    id: '2',
    name: 'Lawn Maintenance',
    description: 'Regular lawn care and landscaping services',
    duration: '2-4 hours',
    startingPrice: '$120',
  },
  {
    id: '3',
    name: 'Electrical Services',
    description: 'Electrical repairs and installations',
    duration: '1-4 hours',
    startingPrice: '$200',
  },
];

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
