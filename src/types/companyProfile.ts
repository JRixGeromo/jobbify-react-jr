export interface CompanyProfile {
  name: string;
  legalName: string;
  taxId: string;
  email: string;
  phone: string;
  website: string;
  logo: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  businessHours: {
    timezone: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  branding: {
    primaryColor: string;
    accentColor: string;
  };
  invoiceSettings: {
    prefix: string;
    footer: string;
    terms: string;
    bankDetails: {
      accountName: string;
      accountNumber: string;
      routingNumber: string;
      bankName: string;
      swift: string;
    };
  };
  id: string;
}
