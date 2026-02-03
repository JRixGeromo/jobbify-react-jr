import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { defaultCompanyProfile } from '../../data/company-profile';

Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Inter',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  companyInfo: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 50,
    objectFit: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 8,
  },
  col1: { width: '40%' },
  col2: { width: '20%', textAlign: 'right' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  bankDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F3F4F6',
  },
});

export function InvoicePDF({ data }: { data: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Image src={defaultCompanyProfile.logo} style={styles.logo} />
            <Text>{defaultCompanyProfile.name}</Text>
            <Text>{defaultCompanyProfile.address.street}</Text>
            <Text>
              {defaultCompanyProfile.address.city},{' '}
              {defaultCompanyProfile.address.state}{' '}
              {defaultCompanyProfile.address.zip}
            </Text>
          </View>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text>
              Invoice #: {defaultCompanyProfile.invoiceSettings.prefix}-
              {data.id || 'New'}
            </Text>
            <Text>Date: {format(new Date(data.date), 'MMM dd, yyyy')}</Text>
            <Text>
              Due Date: {format(new Date(data.dueDate), 'MMM dd, yyyy')}
            </Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.bold}>Bill To:</Text>
          <Text>{data.client}</Text>
        </View>

        {/* Items */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Description</Text>
            <Text style={styles.col2}>Quantity</Text>
            <Text style={styles.col3}>Unit Price</Text>
            <Text style={styles.col4}>Amount</Text>
          </View>
          {data.items?.map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.col1}>{item.description}</Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col3}>${item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.col4}>
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>${data.subtotal?.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Discount:</Text>
            <Text>-${data.discountAmount?.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax:</Text>
            <Text>${data.taxAmount?.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.bold]}>
            <Text>Total:</Text>
            <Text>${data.total?.toFixed(2)}</Text>
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.bankDetails}>
          <Text style={styles.bold}>Payment Details:</Text>
          <Text>
            Bank: {defaultCompanyProfile.invoiceSettings.bankDetails.bankName}
          </Text>
          <Text>
            Account Name:{' '}
            {defaultCompanyProfile.invoiceSettings.bankDetails.accountName}
          </Text>
          <Text>
            Account Number:{' '}
            {defaultCompanyProfile.invoiceSettings.bankDetails.accountNumber}
          </Text>
          <Text>
            Routing Number:{' '}
            {defaultCompanyProfile.invoiceSettings.bankDetails.routingNumber}
          </Text>
          <Text>
            SWIFT: {defaultCompanyProfile.invoiceSettings.bankDetails.swift}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.bold}>Notes:</Text>
          <Text>{data.notes}</Text>
          <Text style={[styles.bold, { marginTop: 10 }]}>Terms:</Text>
          <Text>{data.terms}</Text>
          <Text style={{ marginTop: 20 }}>
            {defaultCompanyProfile.invoiceSettings.footer}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
