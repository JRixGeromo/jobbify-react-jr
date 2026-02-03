import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

const baseUrl = 'https://your-static-assets-url.com'; // Replace with your actual URL

interface InvoiceItem {
  description?: string;
  quantity?: number;
  price?: number;
}

interface InvoiceEmailTemplateProps {
  quoteId?: string;
  companyId?: string;
  invoiceNumber?: string;
  issuedDate?: string;
  paymentDue?: string;
  status?: string;
  paymentMethod?: string;
  amountPaid?: string;
  balanceDue?: string;
  paymentReference?: string;
  isFinalized?: string;
  currency?: string;
  total?: string;
  notes?: string;
  terms?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  items?: InvoiceItem[];
  logoUrl?: string;
}

export const InvoiceEmailTemplate = ({
  quoteId = 'N/A',
  companyId = 'N/A',
  invoiceNumber = 'N/A',
  issuedDate = 'N/A',
  paymentDue = 'N/A',
  status = 'N/A',
  paymentMethod = 'N/A',
  amountPaid = 'N/A',
  balanceDue = 'N/A',
  paymentReference = 'N/A',
  isFinalized = 'N/A',
  currency = 'N/A',
  total = 'N/A',
  notes = 'N/A',
  terms = 'N/A',
  createdAt = 'N/A',
  updatedAt = 'N/A',
  createdBy = 'N/A',
  items = [] as InvoiceItem[],
  logoUrl = '',
}: InvoiceEmailTemplateProps) => {
  console.log('Invoice Items:', items);
  console.log('logoUrl in template:', logoUrl);
  
  return (
    <Html>
      <Head />
      <Preview>Invoice Details</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section>
            <Row>
              <Column>
                <Img
                  src={logoUrl}
                  style={{
                    width: '150px',
                    height: 'auto',
                    marginBottom: '20px',
                  }}
                  alt="Company Logo"
                />
              </Column>
            </Row>
          </Section>
          <Section>
            <Row>
              <Column>
                <Text style={heading}>Invoice Details</Text>
              </Column>
            </Row>
          </Section>
          <Section>
            <table style={informationTable}>
              <tbody>
                <tr style={informationTableRow}>
                  <td style={informationTableColumn}>
                    <Text style={informationTableLabel}>Quote ID:</Text>
                    <Text style={informationTableValue}>{quoteId}</Text>
                  </td>
                  <td style={informationTableColumn}>
                    <Text style={informationTableLabel}>Company ID:</Text>
                    <Text style={informationTableValue}>{companyId}</Text>
                  </td>
                </tr>
                <tr style={informationTableRow}>
                  <td style={informationTableColumn}>
                    <Text style={informationTableLabel}>Invoice Number:</Text>
                    <Text style={informationTableValue}>{invoiceNumber}</Text>
                  </td>
                  <td style={informationTableColumn}>
                    <Text style={informationTableLabel}>Issued Date:</Text>
                    <Text style={informationTableValue}>{issuedDate}</Text>
                  </td>
                </tr>
                <tr style={informationTableRow}>
                  <td style={informationTableColumn}>
                    <Text style={informationTableLabel}>Payment Due:</Text>
                    <Text style={informationTableValue}>{paymentDue}</Text>
                  </td>
                  <td style={informationTableColumn}>
                    <Text style={informationTableLabel}>Status:</Text>
                    <Text style={informationTableValue}>{status}</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>
          <Section>
            <Text style={subheading}>Items</Text>
            <table style={{ ...informationTable, width: '100%', border: '1px solid #ddd' }}>
              <thead>
                <tr>
                  <th style={{ ...informationTableLabel, borderBottom: '1px solid #ddd' }}>Description</th>
                  <th style={{ ...informationTableLabel, borderBottom: '1px solid #ddd' }}>Quantity</th>
                  <th style={{ ...informationTableLabel, borderBottom: '1px solid #ddd' }}>Unit Price</th>
                  <th style={{ ...informationTableLabel, borderBottom: '1px solid #ddd' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, index) => (
                  <tr key={index} style={informationTableRow}>
                    <td style={informationTableColumn}>{item.description || 'N/A'}</td>
                    <td style={informationTableColumn}>{item.quantity || 'N/A'}</td>
                    <td style={informationTableColumn}>${item.price?.toFixed(2) || 'N/A'}</td>
                    <td style={informationTableColumn}>${((item.quantity ?? 0) * (item.price ?? 0)).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td style={informationTableColumn}></td>
                  <td style={informationTableColumn}></td>
                  <td style={informationTableColumn}><strong>Total</strong></td>
                  <td style={informationTableColumn}>${items.reduce((sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0), 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </Section>
          <Section>
            <Text style={subheading}>Notes</Text>
            <Text style={informationTableValue}>{notes}</Text>
          </Section>
          <Section>
            <Text style={subheading}>Terms</Text>
            <Text style={informationTableValue}>{terms}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InvoiceEmailTemplate;

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: '#ffffff',
};

const resetText = {
  margin: '0',
  padding: '0',
  lineHeight: 1.4,
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '660px',
  maxWidth: '100%',
};

const tableCell = { display: 'table-cell' };

const heading = {
  fontSize: '32px',
  fontWeight: '300',
  color: '#888888',
};

const cupomText = {
  textAlign: 'center' as const,
  margin: '36px 0 40px 0',
  fontSize: '14px',
  fontWeight: '500',
  color: '#111111',
};

const supStyle = {
  fontWeight: '300',
};

const informationTable = {
  borderCollapse: 'collapse' as const,
  borderSpacing: '0px',
  color: 'rgb(51,51,51)',
  backgroundColor: 'rgb(250,250,250)',
  borderRadius: '3px',
  fontSize: '12px',
};

const informationTableRow = {
  height: '46px',
};

const informationTableColumn = {
  paddingLeft: '20px',
  borderStyle: 'solid',
  borderColor: 'white',
  borderWidth: '0px 1px 1px 0px',
  height: '44px',
  verticalAlign: 'top',
};

const informationTableLabel = {
  ...resetText,
  color: 'rgb(102,102,102)',
  fontSize: '10px',
};

const informationTableValue = {
  fontSize: '12px',
  margin: '0',
  padding: '0',
  lineHeight: 1.4,
  color: 'gray',
};

const productTitleTable = {
  ...informationTable,
  margin: '30px 0 15px 0',
  height: '24px',
};

const productsTitle = {
  background: '#fafafa',
  paddingLeft: '10px',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const productIcon = {
  margin: '0 0 0 20px',
  borderRadius: '14px',
  border: '1px solid rgba(128,128,128,0.2)',
};

const productTitle = { fontSize: '12px', fontWeight: '600', ...resetText };

const productDescription = {
  fontSize: '12px',
  color: 'rgb(102,102,102)',
  ...resetText,
};

const productLink = {
  fontSize: '12px',
  color: 'rgb(0,112,201)',
  textDecoration: 'none',
};

const divisor = {
  marginLeft: '4px',
  marginRight: '4px',
  color: 'rgb(51,51,51)',
  fontWeight: 200,
};

const productPriceTotal = {
  margin: '0',
  color: 'rgb(102,102,102)',
  fontSize: '10px',
  fontWeight: '600',
  padding: '0px 30px 0px 0px',
  textAlign: 'right' as const,
};

const productPrice = {
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
};

const productPriceLarge = {
  margin: '0px 20px 0px 0px',
  fontSize: '16px',
  fontWeight: '600',
  whiteSpace: 'nowrap' as const,
  textAlign: 'right' as const,
};

const productPriceWrapper = {
  display: 'table-cell',
  padding: '0px 20px 0px 0px',
  width: '100px',
  verticalAlign: 'top',
};

const productPriceLine = { margin: '30px 0 0 0' };

const productPriceVerticalLine = {
  height: '48px',
  borderLeft: '1px solid',
  borderColor: 'rgb(238,238,238)',
};

const productPriceLargeWrapper = { display: 'table-cell', width: '90px' };

const productPriceLineBottom = { margin: '0 0 75px 0' };

const block = { display: 'block' };

const ctaTitle = {
  display: 'block',
  margin: '15px 0 0 0',
};

const ctaText = { fontSize: '24px', fontWeight: '500' };

const walletWrapper = { display: 'table-cell', margin: '10px 0 0 0' };

const walletLink = { color: 'rgb(0,126,255)', textDecoration: 'none' };

const walletImage = {
  display: 'inherit',
  paddingRight: '8px',
  verticalAlign: 'middle',
};

const walletBottomLine = { margin: '65px 0 20px 0' };

const footerText = {
  fontSize: '12px',
  color: 'rgb(102,102,102)',
  margin: '0',
  lineHeight: 'auto',
  marginBottom: '16px',
};

const footerTextCenter = {
  fontSize: '12px',
  color: 'rgb(102,102,102)',
  margin: '20px 0',
  lineHeight: 'auto',
  textAlign: 'center' as const,
};

const footerLink = { color: 'rgb(0,115,255)' };

const footerIcon = { display: 'block', margin: '40px 0 0 0' };

const footerLinksWrapper = {
  margin: '8px 0 0 0',
  textAlign: 'center' as const,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
};

const footerCopyright = {
  margin: '25px 0 0 0',
  textAlign: 'center' as const,
  fontSize: '12px',
  color: 'rgb(102,102,102)',
};

const walletLinkText = {
  fontSize: '14px',
  fontWeight: '400',
  textDecoration: 'none',
};

const subheading = {
  fontSize: '14px',
  fontWeight: '300',
  color: '#888888',
}; 