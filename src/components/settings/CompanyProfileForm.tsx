import React, { useState, useEffect } from 'react';
import { CompanyProfile } from '../../types/companyProfile';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  Palette,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COMPANY_PROFILE } from '../../graphql/queries';
import { UPDATE_COMPANY_PROFILE } from '../../graphql/mutations';
import { FileUpload } from '../ui/file-upload';
import { ThumbnailList } from '@/components/ui/ThumbnailList/ThumbnailList';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useLogActivity } from '../../utils/loggingService';

interface CompanyProfileFormProps {
  profile: CompanyProfile;
  userId: string;
}

const CompanyProfileSchema = Yup.object().shape({
  name: Yup.string().required('Company Name is required'),
  legalName: Yup.string().required('Legal Name is required'),
  taxId: Yup.string().required('Tax ID is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  website: Yup.string().url('Invalid URL').required('Website is required'),
  address: Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zip: Yup.string().required('ZIP Code is required'),
    country: Yup.string().required('Country is required'),
  }),
  branding: Yup.object().shape({
    primaryColor: Yup.string().required('Primary Color is required'),
    accentColor: Yup.string().required('Accent Color is required'),
  }),
  invoiceSettings: Yup.object().shape({
    prefix: Yup.string().required('Invoice Prefix is required'),
    footer: Yup.string().required('Invoice Footer is required'),
    terms: Yup.string().required('Payment Terms are required'),
    bankDetails: Yup.object().shape({
      accountName: Yup.string().required('Account Name is required'),
      accountNumber: Yup.string().required('Account Number is required'),
      routingNumber: Yup.string().required('Routing Number is required'),
      bankName: Yup.string().required('Bank Name is required'),
      swift: Yup.string().required('SWIFT Code is required'),
    }),
  }),
});

export function CompanyProfileForm({
  profile: initialProfile,
  userId,
}: CompanyProfileFormProps) {
  const logActivity = useLogActivity();
  
  const [profile, setProfile] = useState<CompanyProfile>({
    ...initialProfile,
    address: {
      street: initialProfile?.address?.street || '',
      city: initialProfile?.address?.city || '',
      state: initialProfile?.address?.state || '',
      zip: initialProfile?.address?.zip || '',
      country: initialProfile?.address?.country || '',
    },
    branding: {
      primaryColor: initialProfile?.branding?.primaryColor || '#000000',
      accentColor: initialProfile?.branding?.accentColor || '#000000',
    },
    invoiceSettings: {
      prefix: initialProfile?.invoiceSettings?.prefix || '',
      footer: initialProfile?.invoiceSettings?.footer || '',
      terms: initialProfile?.invoiceSettings?.terms || '',
      bankDetails: {
        accountName: initialProfile?.invoiceSettings?.bankDetails?.accountName || '',
        accountNumber: initialProfile?.invoiceSettings?.bankDetails?.accountNumber || '',
        routingNumber: initialProfile?.invoiceSettings?.bankDetails?.routingNumber || '',
        bankName: initialProfile?.invoiceSettings?.bankDetails?.bankName || '',
        swift: initialProfile?.invoiceSettings?.bankDetails?.swift || '',
      },
    },
  });

  // Fetch company profile data
  const { data, loading, error } = useQuery(GET_COMPANY_PROFILE, {
    variables: { companyId: initialProfile.id },
  });

  // Mutation to update company profile
  const [updateCompanyProfile] = useMutation(UPDATE_COMPANY_PROFILE);

  useEffect(() => {
    if (data) {
      console.log('Fetched data:', data);
    }

    if (data && data.companiesCollection.edges.length > 0) {
      const fetchedProfile = data.companiesCollection.edges[0].node;
      setProfile({
        id: fetchedProfile.id,
        name: fetchedProfile.name,
        legalName: fetchedProfile.legal_name,
        taxId: fetchedProfile.tax_id,
        email: fetchedProfile.email,
        phone: fetchedProfile.phone,
        website: fetchedProfile.website,
        address: {
          street: fetchedProfile.street_address || '',
          city: fetchedProfile.city || '',
          state: fetchedProfile.state || '',
          zip: fetchedProfile.zip_code || '',
          country: fetchedProfile.country || '',
        },
        branding: {
          primaryColor: fetchedProfile.primary_color || '#000000',
          accentColor: fetchedProfile.accent_color || '#000000',
        },
        invoiceSettings: {
          prefix: fetchedProfile.invoice_prefix || '',
          footer: fetchedProfile.invoice_footer || '',
          terms: fetchedProfile.payment_terms || '',
          bankDetails: {
            accountName: fetchedProfile.account_name || '',
            accountNumber: fetchedProfile.account_number || '',
            routingNumber: fetchedProfile.routing_number || '',
            bankName: fetchedProfile.bank_name || '',
            swift: fetchedProfile.swift_code || '',
          },
        },
        logo: fetchedProfile.logo_url || '',
        businessHours: {
          timezone: fetchedProfile.business_hours?.timezone || '',
        },
        social: {
          facebook: fetchedProfile.social?.facebook || '',
          twitter: fetchedProfile.social?.twitter || '',
          linkedin: fetchedProfile.social?.linkedin || '',
          instagram: fetchedProfile.social?.instagram || '',
        },
      });
    }

    if (data) {
      console.log('Fetched logo URL:', data.companiesCollection.edges[0].node.logo_url);
    }
  }, [data]);

  const initialValues = {
    id: profile?.id || '',
    name: profile?.name || '',
    legalName: profile?.legalName || '',
    taxId: profile?.taxId || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    website: profile?.website || '',
    address: {
      street: profile?.address?.street || '',
      city: profile?.address?.city || '',
      state: profile?.address?.state || '',
      zip: profile?.address?.zip || '',
      country: profile?.address?.country || '',
    },
    branding: {
      primaryColor: profile?.branding?.primaryColor || '#000000',
      accentColor: profile?.branding?.accentColor || '#000000',
    },
    invoiceSettings: {
      prefix: profile?.invoiceSettings?.prefix || '',
      footer: profile?.invoiceSettings?.footer || '',
      terms: profile?.invoiceSettings?.terms || '',
      bankDetails: {
        accountName: profile?.invoiceSettings?.bankDetails?.accountName || '',
        accountNumber: profile?.invoiceSettings?.bankDetails?.accountNumber || '',
        routingNumber: profile?.invoiceSettings?.bankDetails?.routingNumber || '',
        bankName: profile?.invoiceSettings?.bankDetails?.bankName || '',
        swift: profile?.invoiceSettings?.bankDetails?.swift || '',
      },
    },
    logo: profile?.logo || '',
    businessHours: {
      timezone: profile?.businessHours?.timezone || '',
    },
    social: {
      facebook: profile?.social?.facebook || '',
      twitter: profile?.social?.twitter || '',
      linkedin: profile?.social?.linkedin || '',
      instagram: profile?.social?.instagram || '',
    },
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={CompanyProfileSchema}
      onSubmit={async (values) => {
        try {
          // Log the logo URL before saving
          console.log('Logo URL before saving:', values.logo);
          await updateCompanyProfile({
            variables: {
              id: values.id,
              name: values.name,
              legal_name: values.legalName,
              tax_id: values.taxId,
              email: values.email,
              phone: values.phone,
              website: values.website,
              street_address: values.address.street,
              city: values.address.city,
              state: values.address.state,
              zip_code: values.address.zip,
              country: values.address.country,
              primary_color: values.branding.primaryColor,
              accent_color: values.branding.accentColor,
              invoice_prefix: values.invoiceSettings.prefix,
              invoice_footer: values.invoiceSettings.footer,
              payment_terms: values.invoiceSettings.terms,
              account_name: values.invoiceSettings.bankDetails.accountName,
              bank_name: values.invoiceSettings.bankDetails.bankName,
              account_number: values.invoiceSettings.bankDetails.accountNumber,
              routing_number: values.invoiceSettings.bankDetails.routingNumber,
              swift_code: values.invoiceSettings.bankDetails.swift,
              logo_url: values.logo,
              business_hours: {
                timezone: values.businessHours.timezone,
              },
              social: {
                facebook: values.social.facebook,
                twitter: values.social.twitter,
                linkedin: values.social.linkedin,
                instagram: values.social.instagram,
              },
            },
          });
          alert('Company profile updated successfully!');

          // Add logging here
          await logActivity({
            level: 'INFO',
            message: 'Company profile updated',
            userId,
            entity: 'Company',
            entityId: values.id,
            source: 'Frontend',
            meta: { updatedProfile: values },
          });
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="space-y-6 p-6">
          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
              <Building2 className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                Company Information
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company Name
                </label>
                <Field
                  name="name"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.name && touched.name ? (
                  <div className="text-red-500 text-sm">{errors.name}</div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Legal Name
                </label>
                <Field
                  name="legalName"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.legalName && touched.legalName ? (
                  <div className="text-red-500 text-sm">{errors.legalName}</div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tax ID
              </label>
              <Field
                name="taxId"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              {errors.taxId && touched.taxId ? (
                <div className="text-red-500 text-sm">{errors.taxId}</div>
              ) : null}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
              <Mail className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                Contact Information
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.email && touched.email ? (
                  <div className="text-red-500 text-sm">{errors.email}</div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <Field
                  name="phone"
                  type="tel"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.phone && touched.phone ? (
                  <div className="text-red-500 text-sm">{errors.phone}</div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Website
              </label>
              <Field
                name="website"
                type="url"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              {errors.website && touched.website ? (
                <div className="text-red-500 text-sm">{errors.website}</div>
              ) : null}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
              <MapPin className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">Address</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Street Address
              </label>
              <Field
                name="address.street"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              {errors.address && errors.address.street && touched.address && touched.address.street ? (
                <div className="text-red-500 text-sm">{errors.address.street}</div>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  City
                </label>
                <Field
                  name="address.city"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.address && errors.address.city && touched.address && touched.address.city ? (
                  <div className="text-red-500 text-sm">{errors.address.city}</div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  State
                </label>
                <Field
                  name="address.state"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.address && errors.address.state && touched.address && touched.address.state ? (
                  <div className="text-red-500 text-sm">{errors.address.state}</div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ZIP Code
                </label>
                <Field
                  name="address.zip"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.address && errors.address.zip && touched.address && touched.address.zip ? (
                  <div className="text-red-500 text-sm">{errors.address.zip}</div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Country
                </label>
                <Field
                  name="address.country"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.address && errors.address.country && touched.address && touched.address.country ? (
                  <div className="text-red-500 text-sm">{errors.address.country}</div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
              <Palette className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">Branding</h2>
            </div>

            <FileUpload
              onFileSelect={(url) => setProfile({ ...profile, logo: url })}
              onRemove={() => setProfile({ ...profile, logo: '' })}
              setUploading={(uploading) => console.log('Uploading:', uploading)}
              accept="image/png,image/jpeg,image/*"
              folder="company-logos"
              currentFile={profile.logo}
            />

            {profile.logo && (
              <ThumbnailList
                urls={[profile.logo]}
                onRemove={() => setProfile({ ...profile, logo: '' })}
                showAddButton={false}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Primary Color
                </label>
                <Field
                  name="branding.primaryColor"
                  type="color"
                  className="w-full h-10 rounded-lg border border-slate-300 px-2"
                />
                {errors.branding && errors.branding.primaryColor && touched.branding && touched.branding.primaryColor ? (
                  <div className="text-red-500 text-sm">{errors.branding.primaryColor}</div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Accent Color
                </label>
                <Field
                  name="branding.accentColor"
                  type="color"
                  className="w-full h-10 rounded-lg border border-slate-300 px-2"
                />
                {errors.branding && errors.branding.accentColor && touched.branding && touched.branding.accentColor ? (
                  <div className="text-red-500 text-sm">{errors.branding.accentColor}</div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Invoice Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
              <Receipt className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                Invoice Settings
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Invoice Prefix
                </label>
                <Field
                  name="invoiceSettings.prefix"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.invoiceSettings && errors.invoiceSettings.prefix && touched.invoiceSettings && touched.invoiceSettings.prefix ? (
                  <div className="text-red-500 text-sm">{errors.invoiceSettings.prefix}</div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Invoice Footer
              </label>
              <Field
                name="invoiceSettings.footer"
                as="textarea"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                rows={2}
              />
              {errors.invoiceSettings && errors.invoiceSettings.footer && touched.invoiceSettings && touched.invoiceSettings.footer ? (
                <div className="text-red-500 text-sm">{errors.invoiceSettings.footer}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Payment Terms
              </label>
              <Field
                name="invoiceSettings.terms"
                as="textarea"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                rows={2}
              />
              {errors.invoiceSettings && errors.invoiceSettings.terms && touched.invoiceSettings && touched.invoiceSettings.terms ? (
                <div className="text-red-500 text-sm">{errors.invoiceSettings.terms}</div>
              ) : null}
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-purple-100">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">Bank Details</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Account Name
                </label>
                <Field
                  name="invoiceSettings.bankDetails.accountName"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.invoiceSettings && errors.invoiceSettings.bankDetails && errors.invoiceSettings.bankDetails.accountName && touched.invoiceSettings && touched.invoiceSettings.bankDetails && touched.invoiceSettings.bankDetails.accountName ? (
                  <div className="text-red-500 text-sm">{errors.invoiceSettings.bankDetails.accountName}</div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bank Name
                </label>
                <Field
                  name="invoiceSettings.bankDetails.bankName"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.invoiceSettings && errors.invoiceSettings.bankDetails && errors.invoiceSettings.bankDetails.bankName && touched.invoiceSettings && touched.invoiceSettings.bankDetails && touched.invoiceSettings.bankDetails.bankName ? (
                  <div className="text-red-500 text-sm">{errors.invoiceSettings.bankDetails.bankName}</div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Account Number
                </label>
                <Field
                  name="invoiceSettings.bankDetails.accountNumber"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.invoiceSettings && errors.invoiceSettings.bankDetails && errors.invoiceSettings.bankDetails.accountNumber && touched.invoiceSettings && touched.invoiceSettings.bankDetails && touched.invoiceSettings.bankDetails.accountNumber ? (
                  <div className="text-red-500 text-sm">{errors.invoiceSettings.bankDetails.accountNumber}</div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Routing Number
                </label>
                <Field
                  name="invoiceSettings.bankDetails.routingNumber"
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
                {errors.invoiceSettings && errors.invoiceSettings.bankDetails && errors.invoiceSettings.bankDetails.routingNumber && touched.invoiceSettings && touched.invoiceSettings.bankDetails && touched.invoiceSettings.bankDetails.routingNumber ? (
                  <div className="text-red-500 text-sm">{errors.invoiceSettings.bankDetails.routingNumber}</div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                SWIFT Code
              </label>
              <Field
                name="invoiceSettings.bankDetails.swift"
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              {errors.invoiceSettings && errors.invoiceSettings.bankDetails && errors.invoiceSettings.bankDetails.swift && touched.invoiceSettings && touched.invoiceSettings.bankDetails && touched.invoiceSettings.bankDetails.swift ? (
                <div className="text-red-500 text-sm">{errors.invoiceSettings.bankDetails.swift}</div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Save Changes
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
