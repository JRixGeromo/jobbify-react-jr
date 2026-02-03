import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Quote, QuoteItem } from '../../types/quotes';
import { taxRates } from '../../data/tax-rates';
import { Plus, Trash2 } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { TipTapEditor } from '../editor/TipTapEditor';

import { useFetchClients } from '@/hooks/useFetchClient';
import { useFetchServices } from '@/hooks/useFetchServices';
import { useAuth } from '@/contexts/AuthContext'; // Import the auth context
import { FileUpload } from '../ui/file-upload';
import { ThumbnailList } from '@/components/ui/ThumbnailList/ThumbnailList';
import { useLogActivity } from '../../utils/loggingService';

interface QuoteFormProps {
  quote?: Partial<Quote> | null; // Accepts null or Partial<Quote>
  onSubmit: (data: Partial<Quote>) => Promise<void> | void;
  onCancel: () => void;
  loading: boolean;
}

const QuoteFormSchema = Yup.object().shape({
  client_id: Yup.number().required('Please select a client'),
  service_id: Yup.number().required('Please select a service'),
  items: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().when('media', (media, schema) => {
          if (Array.isArray(media) && media.length > 0) {
            return schema.required('Title is required when a file is uploaded');
          }
          return schema.nullable();
        }),
        description: Yup.string().required('Description is required'),
        quantity: Yup.number()
          .min(1, 'Quantity must be at least 1')
          .required('Quantity is required'),
        unitPrice: Yup.number()
          .min(0, 'Unit price must be non-negative')
          .required('Unit price is required'),
        taxable: Yup.boolean(),
        media: Yup.array().nullable(), // Media should be an array (optional)
      })
    )
    .min(1, 'At least one line item is required'),
});

export function QuoteForm({
  quote,
  onSubmit,
  onCancel,
  loading,
}: QuoteFormProps) {
  const { companyId, currentUser } = useAuth();
  const { clients, loading: clientsLoading } = useFetchClients(companyId);
  const { services, loading: servicesLoading } = useFetchServices(companyId);
  const logActivity = useLogActivity();

  const [initialValues, setInitialValues] = useState<Quote>({
    id: '', // Provide an empty string or a placeholder ID
    client_id: quote?.client_id ?? 0, // Provide a default value (e.g., 0)
    service_id: quote?.service_id ?? 0, // Provide a default value (e.g., 0)
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    items: [],
    subtotal: 0,
    taxRate: 'us-tx',
    taxAmount: 0,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    total: 0,
    notes: '',
    terms: 'Quote valid for 30 days.',
    paymentTerm: '',
    status: 'Draft',
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (quote) {
      let parsedItems: QuoteItem[] = [];
      try {
        parsedItems =
          typeof quote.items === 'string'
            ? JSON.parse(quote.items)
            : Array.isArray(quote.items)
              ? quote.items
              : [];
      } catch (err) {
        console.error('Error parsing items:', err);
      }

      console.log('Fetched Quote:', quote);
      console.log('Tax Amount:', quote.taxAmount);
      console.log('Discount Amount:', quote.discountAmount);

      setInitialValues({
        id: quote.id || '', // Provide a default ID
        client_id: quote?.client_id ?? parseInt(clients[0]?.id || '0', 10),
        service_id: quote?.service_id ?? parseInt(services[0]?.id || '0', 10),
        date: quote.date || format(new Date(), 'yyyy-MM-dd'),
        dueDate: quote.dueDate || format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        items: parsedItems,
        subtotal: quote.subtotal || 0,
        taxRate: quote.taxRate || 'us-tx',
        taxAmount: quote.taxAmount || 0,
        discountType: quote.discountType || 'percentage',
        discountValue: quote.discountValue || 0,
        discountAmount: quote.discountAmount || 0,
        total: quote.total || 0,
        notes: quote.notes || '',
        terms: quote.terms || 'Quote valid for 30 days.',
        paymentTerm: quote.paymentTerm || '',
        status: quote.status || 'Draft',
      });
    }
  }, [quote]);

  console.log('Initial Discount Type:', initialValues.discountType);
  console.log('Initial Discount Value:', initialValues.discountValue);

  const calculateTotals = (
    items: QuoteItem[],
    taxRate: string,
    discountType: string,
    discountValue: number
  ) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const discountAmount =
      discountType === 'percentage'
        ? (subtotal * discountValue) / 100
        : discountValue;
    const taxableAmount = items
      .filter((item) => item.taxable)
      .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const selectedTaxRate =
      taxRates.find((rate) => rate.id === taxRate)?.rate || 0;
    console.log('Selected Tax Rate:', selectedTaxRate);
    const taxAmount =
      ((taxableAmount - discountAmount) * selectedTaxRate) / 100;
    console.log('Calculated Tax Amount:', taxAmount);
    const total = subtotal - discountAmount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  useEffect(() => {
    if (
      !clientsLoading &&
      clients.length > 0 &&
      !servicesLoading &&
      services.length > 0
    ) {
      setInitialValues((prevValues) => ({
        ...prevValues,
        client_id: quote?.client_id ?? parseInt(clients[0]?.id || '0', 10),
        service_id: quote?.service_id ?? parseInt(services[0]?.id || '0', 10),
      }));
    }
  }, [clients, clientsLoading, services, servicesLoading, quote]);

  useEffect(() => {
    const totals = calculateTotals(
      initialValues.items || [],
      initialValues.taxRate,
      initialValues.discountType,
      initialValues.discountValue
    );
    setInitialValues((prevValues) => ({ ...prevValues, ...totals }));
  }, [initialValues.items, initialValues.taxRate, initialValues.discountType, initialValues.discountValue]);

  taxRates.forEach((rate) => {
    console.log('Tax Rate ID:', rate.id);
  });

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={QuoteFormSchema}
      onSubmit={async (values) => {
        const totals = calculateTotals(
          values.items || [],
          values.taxRate,
          values.discountType,
          values.discountValue
        );
        await onSubmit({ ...values, ...totals, taxRate: values.taxRate });
        await logActivity({
          level: 'INFO',
          message: quote ? 'Quote updated' : 'Quote created',
          userId: currentUser?.id || '',
          entity: 'Quote',
          entityId: values.id,
          source: 'Frontend',
          meta: { updatedQuote: values },
        });
      }}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-8 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {quote ? 'Edit Quote' : 'New Quote'}
            </h2>
            <button
              type="submit"
              className={`inline-flex items-center px-4 py-2 rounded-lg ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800'
              }`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Quote'}
            </button>
          </div>

          {/* Client and Service Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Client</label>
              <Field
                as="select"
                name="client_id"
                className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="" disabled>
                  -- Select a Client --
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {`${client.first_name} ${client.last_name}`}
                  </option>
                ))}
              </Field>
              {errors.client_id && touched.client_id && (
                <p className="text-red-500 text-sm">{errors.client_id}</p> // Custom validation message
              )}
            </div>
            <div>
              <label>Service</label>
              <Field
                as="select"
                name="service_id"
                className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="" disabled>
                  -- Select a Service --
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Field>
              {errors.service_id && touched.service_id && (
                <p className="text-red-500 text-sm">{errors.service_id}</p> // Error message for service
              )}
            </div>
          </div>

          {/* Line Items */}
          <FieldArray name="items">
            {({ remove, push }) => (
              <div>
                <h3 className="text-lg font-medium mb-2">Line Items</h3>
                {values.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4"
                  >
                    {/* Full-Width Description Editor */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Description
                      </label>
                      <TipTapEditor
                        content={item.description}
                        onChange={(content) => {
                          setFieldValue(`items[${index}].description`, content);
                          const totals = calculateTotals(
                            values.items || [],
                            values.taxRate,
                            values.discountType,
                            values.discountValue
                          );
                          setFieldValue('subtotal', totals.subtotal);
                          setFieldValue(
                            'discountAmount',
                            totals.discountAmount
                          );
                          setFieldValue('taxAmount', totals.taxAmount);
                          setFieldValue('total', totals.total);
                        }}
                      />
                      {errors.items &&
                        Array.isArray(errors.items) &&
                        errors.items[index] &&
                        typeof errors.items[index] === 'object' &&
                        'description' in errors.items[index] &&
                        touched.items &&
                        touched.items[index]?.description && (
                          <p className="text-red-500 text-sm">
                            {errors.items[index].description}
                          </p>
                        )}
                    </div>

                    {/* Inputs and Media Upload */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Quantity
                        </label>
                        <Field
                          name={`items[${index}].quantity`}
                          type="number"
                          placeholder="Qty"
                          className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          onBlur={() => {
                            const totals = calculateTotals(
                              values.items || [],
                              values.taxRate,
                              values.discountType,
                              values.discountValue
                            );
                            setFieldValue('subtotal', totals.subtotal);
                            setFieldValue(
                              'discountAmount',
                              totals.discountAmount
                            );
                            setFieldValue('taxAmount', totals.taxAmount);
                            setFieldValue('total', totals.total);
                          }}
                        />
                      </div>

                      {/* Unit Price */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Unit Price
                        </label>
                        <Field
                          name={`items[${index}].unitPrice`}
                          type="number"
                          placeholder="Price"
                          className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          onBlur={() => {
                            const totals = calculateTotals(
                              values.items || [],
                              values.taxRate,
                              values.discountType,
                              values.discountValue
                            );
                            setFieldValue('subtotal', totals.subtotal);
                            setFieldValue(
                              'discountAmount',
                              totals.discountAmount
                            );
                            setFieldValue('taxAmount', totals.taxAmount);
                            setFieldValue('total', totals.total);
                          }}
                        />
                      </div>
                    </div>

                    {/* Title Input */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Title
                      </label>
                      <Field
                        name={`items[${index}].title`}
                        type="text"
                        placeholder="Enter title"
                        className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                      {errors.items &&
                        Array.isArray(errors.items) &&
                        errors.items[index] &&
                        typeof errors.items[index] === 'object' &&
                        touched.items &&
                        Array.isArray(touched.items) &&
                        touched.items[index]?.title &&
                        Array.isArray(values.items[index]?.media) && // Ensure media is an array
                        values.items[index]?.media?.length > 0 && ( // Safely check for length
                          <p className="text-red-500 text-sm">
                            {errors.items[index]?.title}
                          </p>
                        )}
                    </div>

                    {/* Media Upload Section */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Media
                      </label>
                      <Field name={`items[${index}].media`}>
                        {({ field, form }: any) => (
                          <>
                            <FileUpload
                              onFileSelect={(imageUrl) =>
                                form.setFieldValue(field.name, [
                                  ...(field.value || []),
                                  ...(Array.isArray(imageUrl)
                                    ? imageUrl
                                    : [imageUrl]),
                                ])
                              }
                              onRemove={(fileUrl: string) => {
                                const updatedFiles = (field.value || []).filter(
                                  (file: string) => file !== fileUrl
                                );
                                form.setFieldValue(field.name, updatedFiles);
                              }}
                              setUploading={setIsUploading}
                              accept="image/jpeg,image/png,image/*,application/pdf,video/quicktime"
                              folder="quotes" // Use a specific folder for quotes
                              maxSize={50}
                              multiple={true}
                            />
                            <br />
                            {field.value && field.value.length > 0 ? (
                              <ThumbnailList
                                urls={field.value}
                                onRemove={(url) => {
                                  const updatedFiles = field.value.filter(
                                    (file: string) => file !== url
                                  );
                                  form.setFieldValue(field.name, updatedFiles);

                                  // Reset title if no media is left
                                  if (updatedFiles.length === 0) {
                                    form.setFieldValue(
                                      `items[${index}].title`,
                                      ''
                                    );
                                  }
                                }}
                                onAdd={() => console.log('Add more')}
                                showAddButton={true}
                              />
                            ) : (
                              <p className="text-gray-600 dark:text-gray-400">
                                No media available
                              </p>
                            )}
                          </>
                        )}
                      </Field>
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          remove(index);
                          const totals = calculateTotals(
                            values.items.filter((_, i) => i !== index) || [],
                            values.taxRate,
                            values.discountType,
                            values.discountValue
                          );
                          setFieldValue('subtotal', totals.subtotal);
                          setFieldValue(
                            'discountAmount',
                            totals.discountAmount
                          );
                          setFieldValue('taxAmount', totals.taxAmount);
                          setFieldValue('total', totals.total);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add New Item Button */}
                <button
                  type="button"
                  onClick={() => {
                    push({
                      id: uuidv4(),
                      description: '',
                      quantity: 1,
                      unitPrice: 0,
                      taxable: true,
                      title: '', // Include title
                      media: [], // Initialize media as an empty array
                    });
                  }}
                  className="flex justify-center items-center w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 bg-transparent"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            )}
          </FieldArray>

          {/* Notes, Terms, and Summary Section */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
            {/* Notes and Terms */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <TipTapEditor
                  content={values.notes || ''}
                  onChange={(content) => setFieldValue('notes', content)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Terms
                </label>
                <TipTapEditor
                  content={values.terms || ''}
                  onChange={(content) => setFieldValue('terms', content)}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                Summary
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="space-y-2">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      Subtotal
                    </span>
                    <span className="font-medium">
                      ${values.subtotal.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {/* Discount */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      Discount
                    </span>
                    <div className="flex items-center gap-2">
                      <Field
                        type="number"
                        name="discountValue"
                        value={values.discountValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newValue = parseFloat(e.target.value || '0');
                          const totals = calculateTotals(
                            values.items || [],
                            values.taxRate || 'us-tx',
                            values.discountType || 'percentage',
                            newValue
                          );
                          setFieldValue('discountValue', newValue);
                          setFieldValue('subtotal', totals.subtotal);
                          setFieldValue(
                            'discountAmount',
                            totals.discountAmount
                          );
                          setFieldValue('taxAmount', totals.taxAmount);
                          setFieldValue('total', totals.total);
                        }}
                        className="w-16 rounded border-gray-300 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
                        min="0"
                        step={
                          values.discountType === 'percentage' ? '1' : '0.01'
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end text-sm text-gray-500 dark:text-gray-400">
                    -${values.discountAmount.toFixed(2) || '0.00'}
                  </div>

                  {/* Tax Rate */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      Tax Rate
                    </span>
                    <Field
                      as="select"
                      name="taxRate"
                      value={values.taxRate}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newRate = e.target.value;
                        const totals = calculateTotals(
                          values.items || [],
                          newRate,
                          values.discountType || 'percentage',
                          values.discountValue || 0
                        );
                        setFieldValue('taxRate', newRate);
                        setFieldValue('subtotal', totals.subtotal);
                        setFieldValue('discountAmount', totals.discountAmount);
                        setFieldValue('taxAmount', totals.taxAmount);
                        setFieldValue('total', totals.total);
                      }}
                      className="rounded border-gray-300 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
                    >
                      {taxRates.map((rate) => (
                        <option key={rate.id} value={rate.id}>
                          {rate.name} ({rate.rate}%)
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="flex justify-end text-sm text-gray-500 dark:text-gray-400">
                    ${values.taxAmount.toFixed(2) || '0.00'}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-base">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Total
                      </span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        ${values.total.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
