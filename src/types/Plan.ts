export interface Plan {
    name: string;
    price: number;
    description: string;
    features: string[];
    priceId: string; // Stripe Price ID
    isPopular?: boolean; // Optional flag for the most popular plan
  }