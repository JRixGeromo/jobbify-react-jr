export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  category:
    | 'Accounting'
    | 'Marketing'
    | 'Automation'
    | 'Add-ons'
    | 'Communication';
  price: string;
  installed?: boolean;
  featured?: boolean;
  popular?: boolean;
  rating?: number;
  reviews?: number;
  publisher: string;
}
