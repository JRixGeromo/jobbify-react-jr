export interface TaxRate {
  id: string;
  country: string;
  name: string;
  rate: number;
  type: 'GST' | 'VAT' | 'Sales Tax';
}

export const taxRates: TaxRate[] = [
  {
    id: 'us-tx',
    country: 'United States',
    name: 'Texas Sales Tax',
    rate: 8.25,
    type: 'Sales Tax',
  },
  {
    id: 'ca-gst',
    country: 'Canada',
    name: 'GST',
    rate: 5,
    type: 'GST',
  },
  {
    id: 'uk-vat',
    country: 'United Kingdom',
    name: 'Standard VAT',
    rate: 20,
    type: 'VAT',
  },
  {
    id: 'au-gst',
    country: 'Australia',
    name: 'GST',
    rate: 10,
    type: 'GST',
  },
];
