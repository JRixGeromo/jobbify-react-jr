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
}

export const defaultCompanyProfile: CompanyProfile = {
  name: 'ServicePro Solutions',
  legalName: 'ServicePro Solutions LLC',
  taxId: '12-3456789',
  email: 'contact@servicepro.com',
  phone: '(555) 123-4567',
  website: 'https://servicepro.com',
  logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&h=200&fit=crop',
  address: {
    street: '123 Service Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    country: 'United States',
  },
  businessHours: {
    timezone: 'America/Chicago',
  },
  social: {
    facebook: 'https://facebook.com/servicepro',
    twitter: 'https://twitter.com/servicepro',
    linkedin: 'https://linkedin.com/company/servicepro',
    instagram: 'https://instagram.com/servicepro',
  },
  branding: {
    primaryColor: '#9333ea',
    accentColor: '#7e22ce',
  },
  invoiceSettings: {
    prefix: 'INV',
    footer: 'Thank you for your business!',
    terms: 'Payment is due within 30 days',
    bankDetails: {
      accountName: 'ServicePro Solutions LLC',
      accountNumber: '1234567890',
      routingNumber: '987654321',
      bankName: 'First National Bank',
      swift: 'FNBUS12345',
    },
  },
};
