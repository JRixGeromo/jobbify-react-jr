import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Tag, Package, DollarSign, FileText } from 'lucide-react';
import { categories } from '@/data/price-book';
import { TipTapEditor } from '../editor/TipTapEditor';
import { CREATE_SERVICE } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ServiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ServiceFormSchema = Yup.object().shape({
  type: Yup.string().required('Type is required'),
  category: Yup.string().required('Category is required'),
  name: Yup.string().required('Name is required'),
  sku: Yup.string().required('SKU is required'),
  price: Yup.number().min(0, 'Price must be non-negative').required('Price is required'),
  unit: Yup.string().required('Unit is required'),
  subscriptionFrequency: Yup.string().when('type', (type : any, schema) => {
    return type === 'Subscription'
      ? schema.required('Subscription frequency is required')
      : schema;
  }),
  shortDescription: Yup.string().required('Short description is required'),
  detailedDescription: Yup.string(),
});

export function ServiceForm({ 
  onSuccess,
  onCancel }: ServiceFormProps) {
  const [createService, { loading: createLoading, error: createError }] =
  useMutation(CREATE_SERVICE);
  const { companyId } = useAuth();
  const initialValues = {
    type: '',
    category: '',
    name: '',
    sku: '',
    price: '',
    unit: '',
    subscriptionFrequency: '',
    shortDescription: '',
    detailedDescription: '',
    subscriptionDetails: ''
  };

  const handleSubmit = async (values : any) => {
    try {
      const { data } = await createService({
        variables: {
          input: {
            type: values.type,
            category: values.category,
            name: values.name,
            sku: values.sku,
            price: values.price,
            unit: values.unit,
            short_desc: values.shortDescription,
            detailed_desc: values.detailedDescription,
            image_path: values.image_path,
            company_id: companyId,
            sub_frequency: values.subscriptionFrequency,
            sub_details: values.subscriptionDetails,
          },
        },
      });
  
      // If the client was created successfully
      toast.success('Service created successfully!', {
        description: `Has been added to your services.`,
      });
  
      onSuccess(); // This will close the modal
  
    } catch (error : any) {
      // Handle error (show a toast error or alert)
      toast.error('There was an error creating the service.', {
        description: error.message || 'Please try again.',
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ServiceFormSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <Package size={24} />
              <h2>Basic Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <Field
                  as="select"
                  name="type"
                  id="type"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                >
                  <option value="">Select Type</option>
                  <option value="Service">Service</option>
                  <option value="Material">Material</option>
                  <option value="Product">Product</option>
                  <option value="Subscription">Subscription</option>
                </Field>
                {errors.type && touched.type && (
                  <div className="text-red-500 text-sm">{errors.type}</div>
                )}
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <Field
                  as="select"
                  name="category"
                  id="category"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Field>
                {errors.category && touched.category && (
                  <div className="text-red-500 text-sm">{errors.category}</div>
                )}
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                />
                {errors.name && touched.name && (
                  <div className="text-red-500 text-sm">{errors.name}</div>
                )}
              </div>
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <Field
                  type="text"
                  name="sku"
                  id="sku"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                />
                {errors.sku && touched.sku && (
                  <div className="text-red-500 text-sm">{errors.sku}</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <DollarSign size={24} />
              <h2>Pricing</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <Field
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                />
                {errors.price && touched.price && (
                  <div className="text-red-500 text-sm">{errors.price}</div>
                )}
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <Field
                  as="select"
                  name="unit"
                  id="unit"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                >
                  <option value="">Select Unit</option>
                  <option value="per_hour">Per Hour</option>
                  <option value="per_day">Per Day</option>
                  <option value="per_unit">Per Unit</option>
                  <option value="per_sqft">Per Square Foot</option>
                  <option value="per_project">Per Project</option>
                </Field>
                {errors.unit && touched.unit && (
                  <div className="text-red-500 text-sm">{errors.unit}</div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="subscriptionFrequency"
              className="block text-sm font-medium text-gray-700"
            >
              Subscription Frequency
            </label>
            <Field
              as="select"
              name="subscriptionFrequency"
              id="subscriptionFrequency"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Select Frequency</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="biannual">Bi-Annual</option>
              <option value="yearly">Yearly</option>
            </Field>
            {errors.subscriptionFrequency && touched.subscriptionFrequency && (
              <div className="text-red-500 text-sm">{errors.subscriptionFrequency}</div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <FileText size={24} />
              <h2>Description</h2>
            </div>
            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <Field
                type="text"
                name="shortDescription"
                id="shortDescription"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
              />
              {errors.shortDescription && touched.shortDescription && (
                <div className="text-red-500 text-sm">{errors.shortDescription}</div>
              )}
            </div>
            <div>
              <label htmlFor="detailedDescription" className="block text-sm font-medium text-gray-700">
                Detailed Description
              </label>
              <TipTapEditor
                content={values.detailedDescription}
                onChange={(content) => setFieldValue('detailedDescription', content)}
              />
            </div>

            <div>
              <label htmlFor="subscriptionDetails" className="block text-sm font-medium text-gray-700">
                Subscription Details
              </label>
              <TipTapEditor
                content={values.subscriptionDetails}
                onChange={(content) => setFieldValue('subscriptionDetails', content)}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
              transition-colors duration-200 focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Service
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 
              transition-colors duration-200 focus:outline-none focus:ring-2 
              focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
