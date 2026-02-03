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

interface QuoteEmailTemplateProps {
  clientName: string;
  quoteNumber: string;
  amountDue: number;
  dueDate: string;
  date?: string;
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  discountType?: string;
  discountValue?: number;
  discountAmount?: number;
  total?: number;
  notes?: string;
  terms?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
  createdBy?: string;
  service?: string;
  items?: { description?: string; quantity?: number; unitPrice?: number; amount?: number }[];
  logoUrl: string;
}

export const QuoteEmailTemplate = ({ clientName, quoteNumber, amountDue, dueDate, date, subtotal, taxRate, taxAmount, discountType, discountValue, discountAmount, total, notes, terms, status, createdAt, updatedAt, companyId, createdBy, service, items, logoUrl }: QuoteEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Quote Details</Preview>

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

            <Column align="right" style={tableCell}>
              <Text style={heading}>Quote #{quoteNumber}</Text>
            </Column>
          </Row>
        </Section>
        <Section>
          <Text style={heading}>Quote Information</Text>
          <table style={{ ...informationTable, width: '100%', border: '1px solid #ddd' }}>
            <tbody>
              <tr style={informationTableRow}>
                <td style={{ ...informationTableColumn, width: '50%' }}>
                  <Text style={informationTableLabel}>Service:</Text>
                  <Text style={informationTableValue}>{service || 'N/A'}</Text>
                </td>
                <td style={{ ...informationTableColumn, width: '50%' }}>
                  <Text style={informationTableLabel}>Status:</Text>
                  <Text style={informationTableValue}>{status || 'N/A'}</Text>
                </td>
              </tr>
              <tr style={informationTableRow}>
                <td style={{ ...informationTableColumn, width: '50%' }}>
                  <Text style={informationTableLabel}>Client:</Text>
                  <Text style={informationTableValue}>{clientName || 'N/A'}</Text>
                </td>
                <td style={{ ...informationTableColumn, width: '50%' }}>
                  <Text style={informationTableLabel}>Date:</Text>
                  <Text style={informationTableValue}>{date || 'N/A'}</Text>
                </td>
              </tr>
              <tr style={informationTableRow}>
                <td style={{ ...informationTableColumn, width: '50%' }}>
                  <Text style={informationTableLabel}>Due Date:</Text>
                  <Text style={informationTableValue}>{dueDate || 'N/A'}</Text>
                </td>
                <td style={{ ...informationTableColumn, width: '50%' }}>
                  <Text style={informationTableLabel}>Total Amount:</Text>
                  <Text style={informationTableValue}>${total?.toFixed(2) || 'N/A'}</Text>
                </td>
              </tr>
              <tr style={informationTableRow}>
                <td style={{ ...informationTableColumn, width: '50%' }}>
                  <Text style={informationTableLabel}>Subtotal:</Text>
                  <Text style={informationTableValue}>${subtotal?.toFixed(2) || 'N/A'}</Text>
                </td>
                <td style={{ ...informationTableColumn, width: '50%' }}>
                  <Text style={informationTableLabel}>Discount:</Text>
                  <Text style={informationTableValue}>-${discountAmount?.toFixed(2) || 'N/A'}</Text>
                </td>
              </tr>
              <tr style={informationTableRow}>
                <td style={{ ...informationTableColumn, width: '50%' }}>
                  <Text style={informationTableLabel}>Tax Rate:</Text>
                  <Text style={informationTableValue}>{taxRate ? `${taxRate}%` : 'N/A'}</Text>
                </td>
                <td style={{ ...informationTableColumn, width: '50%' }}>
                  <Text style={informationTableLabel}>Tax Amount:</Text>
                  <Text style={informationTableValue}>${taxAmount?.toFixed(2) || 'N/A'}</Text>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
        <Section>
          <Text style={heading}>Items</Text>
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
                  <td style={{ ...informationTableColumn, borderBottom: '1px solid #ddd' }} dangerouslySetInnerHTML={{ __html: item.description || 'N/A' }}></td>
                  <td style={{ ...informationTableColumn, borderBottom: '1px solid #ddd' }}>{item.quantity || 'N/A'}</td>
                  <td style={{ ...informationTableColumn, borderBottom: '1px solid #ddd' }}>${item.unitPrice?.toFixed(2) || 'N/A'}</td>
                  <td style={{ ...informationTableColumn, borderBottom: '1px solid #ddd' }}>${((item.quantity ?? 0) * (item.unitPrice ?? 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', paddingTop: '10px' }}>Subtotal</td>
                <td style={{ textAlign: 'right', paddingTop: '10px' }}>${subtotal?.toFixed(2) || 'N/A'}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right' }}>Discount</td>
                <td style={{ textAlign: 'right' }}>-${discountAmount?.toFixed(2) || 'N/A'}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right' }}>Tax</td>
                <td style={{ textAlign: 'right' }}>${taxAmount?.toFixed(2) || 'N/A'}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>${total?.toFixed(2) || 'N/A'}</td>
              </tr>
            </tfoot>
          </table>
        </Section>
        <Section>
          <Text style={heading}>Notes & Terms</Text>
          <Text style={informationTableValue} dangerouslySetInnerHTML={{ __html: notes || 'N/A' }}></Text>
          <Text style={informationTableValue} dangerouslySetInnerHTML={{ __html: terms || 'N/A' }}></Text>
        </Section>
        
      </Container>
    </Body>
  </Html>
);

export default QuoteEmailTemplate;

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
  fontSize: '14px',
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