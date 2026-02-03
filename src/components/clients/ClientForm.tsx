import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import CreateClientPage from '@/pages/CreateClientPage';
import { useMutation } from '@apollo/client';
import { CREATE_CLIENT } from '@/graphql/mutations';
import { toast } from 'sonner';
import { LocationInput } from '@/components/LocationInput';

// Define a custom Location type to avoid conflicts with the DOM API
interface CustomLocation {
  address: string;
  lat: number;
  lng: number;
}

interface ClientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ClientForm({ 
  onSuccess,
  onCancel
 }: ClientFormProps) {
  const { companyId } = useAuth();
  const [createClient, { error }] = useMutation(CREATE_CLIENT);
  const JobFormSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    companyName: Yup.string(),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Phone must be a number')
      .min(10, 'Phone must be at least 10 digits')
      .required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    // profilePhoto: Yup.mixed(),
  });

  const initialValues = {
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    profilePhoto: null,
  };

  const handleSubmit = async (values : any) => {
    try {
      const { data } = await createClient({
        variables: {
          input: {
            first_name: values.firstName,
            last_name: values.lastName,
            email_address: values.email,
            phone_number: values.phone,
            address: values.address,
            company: values.companyName,
            notes: values.notes,
            company_id: companyId
          },
        },
      });
  
      // If the client was created successfully
      toast.success('Client created successfully!', {
        description: `Has been added to your clients.`,
      });
  
      // Close the modal after successful client creation
      onSuccess(); // This will close the modal
  
    } catch (error : any) {
      // Handle error (show a toast error or alert)
      toast.error('There was an error creating the client.', {
        description: error.message || 'Please try again.',
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={JobFormSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <User size={24} />
              <h2>Basic Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Field
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                />
                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Field
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <Field
                  type="text"
                  id="companyName"
                  name="companyName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                />
              </div>
              {/* <div>
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">
                  Profile Photo
                </label>
                <input
                  type="file"
                  id="profilePhoto"
                  onChange={(e) =>
                    setFieldValue('profilePhoto', e.currentTarget.files?.[0] || null)
                  }
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div> */}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <Phone size={24} />
              <h2>Contact Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Field
                  type="tel"
                  id="phone"
                  name="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white border p-2"
                />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <MapPin size={24} />
              <h2>Address</h2>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Full Address
              </label>
              <Field name="address">
                {({ field, form }: any) => (
                  <LocationInput
                    value={{ address: field.value, lat: 0, lng: 0 }}
                    onChange={(location: CustomLocation | null) => {
                      if (location) {
                        form.setFieldValue(field.name, location.address);
                      }
                    }}
                    placeholder="Enter full address"
                  />
                )}
              </Field>
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                transition-colors duration-200 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Profile
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
