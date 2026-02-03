import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Invoice, InvoiceItem } from '../../types/invoices';
import { taxRates } from '../../data/tax-rates';
import { Plus, Trash2 } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { TipTapEditor } from '../editor/TipTapEditor';
import { useFetchClients } from '@/hooks/useFetchClient';
import { useFetchServices } from '@/hooks/useFetchServices';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from '../ui/file-upload';
import { ThumbnailList } from '@/components/ui/ThumbnailList/ThumbnailList';
import { useLogActivity } from '../../utils/loggingService';

interface InvoiceFormProps {
  invoice?: Partial<Invoice> | null;
  onSubmit: (data: Partial<Invoice>) => Promise<void> | void;
  onCancel: () => void;
  loading: boolean;
}

const InvoiceFormSchema = Yup.object().shape({
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
        media: Yup.array().nullable(), // Media can be null or an array
      })
    )
    .min(1, 'At least one line item is required'),
  date: Yup.string().required('Date is required'),
  dueDate: Yup.string().required('Due date is required'),
  paymentTerm: Yup.string().required('Payment term is required'),
});

// const InvoiceFormSchema = Yup.object().shape({
//   client_id: Yup.number().required('Please select a client'),
//   service_id: Yup.number().required('Please select a service'),
//   items: Yup.array()
//     .of(
//       Yup.object().shape({
//         description: Yup.string().required('Description is required'),
//         quantity: Yup.number()
//           .min(1, 'Quantity must be at least 1')
//           .required('Quantity is required'),
//         unitPrice: Yup.number()
//           .min(0, 'Unit price must be non-negative')
//           .required('Unit price is required'),
//         taxable: Yup.boolean(),
//       })
//     )
//     .min(1, 'At least one line item is required'),
//   date: Yup.string().required('Date is required'),
//   dueDate: Yup.string().required('Due date is required'),
//   paymentTerm: Yup.string().required('Payment term is required'),
// });

export function InvoiceForm({
  invoice,
  onSubmit,
  onCancel,
  loading,
}: InvoiceFormProps) {
  const { companyId, currentUser } = useAuth();
  const { clients, loading: clientsLoading } = useFetchClients(companyId);
  const { services, loading: servicesLoading } = useFetchServices(companyId);
  const logActivity = useLogActivity();

  const [initialValues, setInitialValues] = useState<Invoice>({
    id: '',
    client_id: invoice?.client_id ?? 0,
    service_id: invoice?.service_id ?? 0,
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
    terms: 'Invoice terms go here.',
    paymentTerm: 'net-30',
    status: 'Draft',
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (invoice) {
      let parsedItems: InvoiceItem[] = [];
      try {
        parsedItems =
          typeof invoice.items === 'string'
            ? JSON.parse(invoice.items)
            : Array.isArray(invoice.items)
              ? invoice.items
              : [];
      } catch (err) {
        console.error('Error parsing items:', err);
      }

      setInitialValues({
        id: invoice?.id || '',
        client_id: invoice?.client_id ?? parseInt(clients[0]?.id || '0', 10),
        service_id: invoice?.service_id ?? parseInt(services[0]?.id || '0', 10),
        date: invoice?.date || format(new Date(), 'yyyy-MM-dd'),
        dueDate:
          invoice?.dueDate || format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        items: parsedItems,
        subtotal: invoice?.subtotal || 0,
        taxRate: invoice?.taxRate || 'us-tx',
        taxAmount: invoice?.taxAmount || 0,
        discountType: invoice?.discountType || 'percentage',
        discountValue: invoice?.discountValue || 0,
        discountAmount: invoice?.discountAmount || 0,
        total: invoice?.total || 0,
        notes: invoice?.notes || '',
        terms: invoice?.terms || 'Invoice terms go here.',
        paymentTerm: invoice?.paymentTerm || 'net-30',
        status: invoice?.status || 'Draft',
      });
    }
  }, [invoice, clients, services]);

  const calculateTotals = (
    items: InvoiceItem[],
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
    const taxAmount =
      ((taxableAmount - discountAmount) * selectedTaxRate) / 100;
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
        client_id: invoice?.client_id ?? parseInt(clients[0]?.id || '0', 10),
        service_id: invoice?.service_id ?? parseInt(services[0]?.id || '0', 10),
      }));
    }
  }, [clients, clientsLoading, services, servicesLoading, invoice]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={InvoiceFormSchema}
      onSubmit={async (values) => {
        const totals = calculateTotals(
          values.items || [],
          values.taxRate,
          values.discountType,
          values.discountValue
        );
        await onSubmit({ ...values, ...totals });
        await logActivity({
          level: 'INFO',
          message: invoice ? 'Invoice updated' : 'Invoice created',
          userId: currentUser?.id || '',
          entity: 'Invoice',
          entityId: values.id,
          source: 'Frontend',
          meta: { updatedInvoice: values },
        });
      }}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-8 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100">
          {/* Client and Service Selection */}
          <div>
            <h2 className="text-2xl font-semibold">
              {invoice ? 'Edit Invoice' : 'New Invoice'}
            </h2>
          </div>
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
                {values.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-700"
                  >
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Description
                      </label>
                      <TipTapEditor
                        content={item.description}
                        onChange={(content) =>
                          setFieldValue(`items[${index}].description`, content)
                        }
                      />
                      {errors.items &&
                        Array.isArray(errors.items) &&
                        typeof errors.items[index] === 'object' &&
                        'description' in errors.items[index] &&
                        touched.items &&
                        touched.items[index]?.description && (
                          <p className="text-red-500 text-sm">
                            {(errors.items[index] as any).description}
                          </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Quantity Input */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Quantity
                        </label>
                        <Field
                          name={`items[${index}].quantity`}
                          type="number"
                          className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        {errors.items &&
                          Array.isArray(errors.items) &&
                          typeof errors.items[index] === 'object' &&
                          'quantity' in errors.items[index] &&
                          touched.items &&
                          touched.items[index]?.quantity && (
                            <p className="text-red-500 text-sm">
                              {(errors.items[index] as any).quantity}
                            </p>
                          )}
                      </div>

                      {/* Unit Price Input */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Unit Price
                        </label>
                        <Field
                          name={`items[${index}].unitPrice`}
                          type="number"
                          className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        {errors.items &&
                          Array.isArray(errors.items) &&
                          typeof errors.items[index] === 'object' &&
                          'unitPrice' in errors.items[index] &&
                          touched.items &&
                          touched.items[index]?.unitPrice && (
                            <p className="text-red-500 text-sm">
                              {(errors.items[index] as any).unitPrice}
                            </p>
                          )}
                      </div>

                      {/* Media Upload Section */}
                      <div className="col-span-2">
                        <div>
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
                            typeof errors.items[index] === 'object' &&
                            'title' in errors.items[index] &&
                            touched.items &&
                            touched.items[index]?.title && (
                              <p className="text-red-500 text-sm">
                                {(errors.items[index] as any).title}
                              </p>
                            )}
                        </div>
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
                                  const updatedFiles = (
                                    field.value || []
                                  ).filter((file: string) => file !== fileUrl);
                                  form.setFieldValue(field.name, updatedFiles);
                                }}
                                setUploading={setIsUploading}
                                accept="image/jpeg,image/png,image/*,application/pdf,video/quicktime"
                                folder="invoices"
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
                                    form.setFieldValue(
                                      field.name,
                                      updatedFiles
                                    );
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
                    </div>

                    {/* Taxable and Remove Button */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name={`items[${index}].taxable`}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-slate-600">
                          Taxable
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    push({
                      id: uuidv4(),
                      description: '',
                      quantity: 1,
                      unitPrice: 0,
                      taxable: false,
                      media: [],
                      title: '', // Initialize title
                    })
                  }
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  <Plus className="inline-block" /> Add Item
                </button>
              </div>
            )}
          </FieldArray>

          {/* Notes and Terms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`inline-flex items-center px-4 py-2 rounded-lg ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800'
              }`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Invoice'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
