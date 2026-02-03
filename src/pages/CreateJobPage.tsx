import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  User,
  Calendar,
  Save,
  Repeat,
  Phone,
  Mail,
} from 'lucide-react';
import { Job, JobStatus, RecurringType } from '../data/jobs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TipTapEditor } from '../components/editor/TipTapEditor';
import { FileUpload } from '../components/ui/file-upload';
import { TaskList } from '../components/jobs/TaskList';
import { CREATE_JOB, CREATE_JOB_TASKS, UPDATE_JOB } from '@/graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { supabase } from '@/lib/supabase';
import { useFetchClients } from '@/hooks/useFetchClient';
import { useFetchServices } from '@/hooks/useFetchServices';
import { useFetchStatuses } from '@/hooks/useFetchStatuses';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ThumbnailList } from '@/components/ui/ThumbnailList/ThumbnailList';
import { Field, Form, Formik, FieldProps } from 'formik';
import * as Yup from 'yup';
import { LocationInput } from '@/components/LocationInput';
import { GET_JOB_BY_ID } from '@/graphql/queries';
import { Modal } from '@/components/Modal';
import { ClientForm } from '@/components/clients/ClientForm';
import { ServiceForm } from '@/components/services/ServiceForm';
import Select, { MultiValue } from 'react-select';
import { Client } from '@/types/clients';
import '../styles/responsive.css';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

  interface Service {
    id: string
    name: string
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    tasks?: [];
  }

  interface JobNew {
    clientId: string;
    service: Service[]; // Explicitly define service as Service[]
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    address: string;
    price: string;
    status: string;
    photo: string[];
    notes: string;
    tasks: any[];
    recurring: string;
  }

export default function CreateJobPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the id from the URL
  const [formData, setFormData] = useState<Partial<JobNew>>({
    clientId: '',
    service: [] as Service[],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: new Date().toISOString().split('T')[0],
    endTime: '09:00',
    address: '',
    price: '',
    status: '1',
    photo: [],
    notes: '',
    tasks: [],
    recurring: 'one-time',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [createJob, { loading, error }] = useMutation(CREATE_JOB);
  const [updateJob, { loading : updateLoading, error : updateError }] = useMutation(UPDATE_JOB);
  const { companyId } = useAuth();
  const { clients : initialClients, refetch : reClients } = useFetchClients(companyId);
  const { services : initialServices, refetch : reServices } = useFetchServices(companyId);
  const { statuses } = useFetchStatuses('JOBS');
  const [clients, setClients] = useState<Client[]>([]); 
  const [services, setServices] = useState<Service[]>([]); 
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialClients) {
      setClients(initialClients);
    }
  }, [initialClients]);

  useEffect(() => {
    if (initialServices) {
      setServices(initialServices);
    }
  }, [initialServices]);

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_JOB_BY_ID, {
    variables: { id },
    skip: !id, // Skip fetching if no id is provided
  });

  useEffect(() => {
    if (id && data) {
      let jobsData = data?.jobsCollection?.edges[0]?.node;
      console.log('Fetched Job Data:', jobsData);

      setFormData({
        ...formData,
        clientId: jobsData.clients.id || '',
        service: JSON.parse(jobsData.services) || [],
        tasks: JSON.parse(jobsData.tasks) || [],
        address: jobsData.location || '',
        price: `${jobsData.price}` || '',
        status: jobsData.statuses.id || '1',
        photo: JSON.parse(jobsData.image_path) || [],
        notes: jobsData.notes || '',
        recurring: jobsData.recurring_schedule || 'one-time',
        startDate: jobsData.start_date || new Date().toISOString().split('T')[0],
        endDate: jobsData.end_date || new Date().toISOString().split('T')[0],
        startTime: jobsData.start_time || '09:00',
        endTime: jobsData.end_time || '09:00',
      });
    }
  }, [id, data]);

  const handleSubmit = async (values: any) => {
    try {
      const input = {
        client_id: values.clientId || '',
        services: JSON.stringify(values.service || []),
        status_id: values.status || '1',
        location: values.address || '',
        notes: values.notes || '',
        image_path: JSON.stringify(values.photo || []),
        is_recurring: values.recurring === 'one-time' ? 0 : 1,
        recurring_schedule: values.recurring || 'one-time',
        company_id: companyId || '',
        price: values.price || '0',
        tasks: JSON.stringify(values.tasks || []),
      };
      console.log('Input Data:', input);

      if (id && data) {
        await updateJob({ variables: { id, set: input } });
      } else {
        await createJob({ variables: { input } });
      }

      toast.success(`Job ${id ? 'updated' : 'created'} successfully!`, {
        description: `has been ${id ? 'included' : 'added'} to your jobs.`,
        action: {
          label: 'View all jobs',
          onClick: () => navigate('/jobs'),
        },
      });
    } catch (err) {
      console.error('Error creating quote:', err);
    }
  };

  const handleImageChange = (imageUrl: string | string[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: [
        ...(prevFormData.photo || []),
        ...(Array.isArray(imageUrl) ? imageUrl : [imageUrl]),
      ],
    }));
  };

  const removeFile = (fileName: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: (prevFormData.photo || []).filter((file) => file !== fileName),
    }));
  };

  const JobFormSchema = Yup.object().shape({
    clientId: Yup.number().required('Please select a client'),
    service: Yup.array().min(1, 'Please select at least one service'),
    startDate: Yup.date().required('Start date is required').nullable(),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date cannot be before start date')
      .nullable(),
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),
    price: Yup.number()
      .required('Price is required')
      .min(1, 'Price cannot be negative'),
    address: Yup.string().required('Location is required'),
    notes: Yup.string(),
  });

  const selectedClient = clients.find((c) => c.id === formData.clientId);
  const [clientModalOpen, setclientModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  
  const refetchClients = async () => {
    try {
      const { data: refreshedData } = await reClients();
      if (refreshedData?.clientsCollection?.edges) {
        const fetchClients = refreshedData.clientsCollection.edges.map(
          ({ node }) => node
        );
        setClients(fetchClients);
      }
    } catch (error) {
      console.error('Failed to refetch clients:', error);
    }
  };

  const refetchServices= async () => {
    try {
      const { data: refreshedData } = await reServices();
      if (refreshedData?.servicesCollection?.edges) {
        const fetchServices = refreshedData.servicesCollection.edges.map(
          ({ node }) => node
        );
        setServices(fetchServices);
      }
    } catch (error) {
      console.error('Failed to refetch services:', error);
    }
  };

  useEffect(() => {
    console.log('Formik Notes updated:', formData.notes);
  }, [formData.notes]);

  useEffect(() => {
    console.log('Initial Formik Values:', formData);
  }, [formData]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/jobs"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
        <Breadcrumbs />
        <div className="mt-4">
          {id ? (
            <h1 className="text-2xl font-bold text-slate-800">Update Job</h1>
          ) : (
            <h1 className="text-2xl font-bold text-slate-800">
              Create New Job
            </h1>
          )}
          <p className="text-slate-600">Schedule a new service job</p>
        </div>
      </div>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={JobFormSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => {
          console.log('Formik Notes:', values.notes);
          return (
            <Form
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Prevent form submission
                }
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Client Selection */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-100 my-5">
                    <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-purple-600" />
                        <h2 className="text-lg font-semibold text-slate-800">
                          Client Information
                        </h2>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <label
                              htmlFor="client"
                              className="block text-sm font-medium text-slate-700 mb-1"
                            >
                              Client
                            </label>
                            <button
                              type="button"
                              onClick={() => setclientModalOpen(true)}
                              className="text-ellipsis"
                            >
                              + New Client
                            </button>

                          </div>
                          <Field
                            as="select"
                            name="clientId"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2"
                          >
                            <option value="" disabled>
                              -- Select Client --
                            </option>
                            {clients.map((client) => (
                              <option key={client.id} value={client.id}>
                                {`${client.first_name} ${client.last_name}`}
                              </option>
                            ))}
                          </Field>
                          {errors.clientId && touched.clientId && (
                            <p className="text-red-500 text-sm">
                              {errors.clientId}
                            </p> // Error message for service
                          )}
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <label
                              htmlFor="client"
                              className="block text-sm font-medium text-slate-700 mb-1"
                            >
                              Service
                            </label>
                            <button
                              type="button"
                              onClick={() => setServiceModalOpen(true)}
                              className="text-ellipsis"
                            >
                              + New Service
                            </button>
                          </div>
                          <Field
                            as="select"
                            name="service"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2"
                            value={values.service?.[0]?.id || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              const selectedService = services.find(service => service.id === e.target.value);
                              if (selectedService) {
                                setFieldValue('service', [{ id: selectedService.id, name: selectedService.name }]);
                              }
                            }}
                          >
                            <option value="" disabled>
                              -- Select Service --
                            </option>
                            {services.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </div>

                      {selectedClient && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-slate-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {selectedClient.phone_number}
                          </div>
                          <div className="flex items-center text-sm text-slate-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {selectedClient.email_address}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {values.service?.map((service: Service, index) => (
                    <div key={service.id} className="bg-white rounded-lg shadow-sm border border-purple-100 my-5">
                      <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-purple-600" />
                          <h2 className="text-lg font-semibold text-slate-800">
                            {service.name}
                          </h2>
                        </div>
                      </div>
                      <div className="p-6">
                        <h2 className="text-lg font-semibold text-slate-800">
                          Tasks
                        </h2>
                        <Field name="tasks">
                          {({ field, form }: any) => {
                            const filteredTasks = (field.value || []).filter(
                              (task: any) => task.serviceId === service.id
                            );

                            return (
                              <TaskList
                                tasks={filteredTasks}
                                onTasksChange={(tasks) => {
                                  const updatedTasks = tasks.map((task: any) => ({
                                    ...task,
                                    serviceId: service.id,
                                    serviceName: service.name,
                                  }));

                                  const otherTasks = (field.value || []).filter(
                                    (task: any) => task.serviceId !== service.id
                                  );

                                  form.setFieldValue(field.name, [...otherTasks, ...updatedTasks]);
                                }}
                              />
                            );
                          }}
                        </Field>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Start Date
                            </label>
                            <Field
                              name={`service[${index}].startDate`}
                              type="date"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              End Date
                            </label>
                            <Field
                              name={`service[${index}].endDate`}
                              type="date"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2"
                              min={service.startDate}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Start Time
                            </label>
                            <Field
                              name={`service[${index}].startTime`}
                              type="time"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              End Time
                            </label>
                            <Field
                              name={`service[${index}].endTime`}
                              type="time"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Recurring Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-100 my-5">
                    <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <h2 className="text-lg font-semibold text-slate-800">
                          Recurring
                        </h2>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Recurring Schedule
                        </label>
                        <Field
                          name="recurring"
                          as="select"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        >
                          <option value="one-time">One-time</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </Field>
                        {errors.recurring && touched.recurring && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.recurring}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-100 my-5">
                    <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <h2 className="text-lg font-semibold text-slate-800">
                          Location
                        </h2>
                      </div>
                    </div>
                    <div className="p-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Service Address
                        </label>
                        <Field name="address">
                          {({ field, form }: FieldProps) => (
                            <LocationInput
                              value={{ address: field.value, lat: 0, lng: 0 }}
                              onChange={(location: Location | null) => {
                                if (location) {
                                  form.setFieldValue(field.name, location.address);
                                }
                              }}
                              placeholder="Enter event location"
                            />
                          )}
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-100 my-5">
                    <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                      <h2 className="text-lg font-semibold text-slate-800">
                        Notes
                      </h2>
                    </div>
                    <div className="p-6">
                      <Field name="notes">
                        {({ field, form }: any) => (
                          <TipTapEditor
                            content={field.value || ''}
                            onChange={(content) => form.setFieldValue('notes', content)}
                          />
                        )}
                      </Field>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-100 my-5">
                    <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                      <h2 className="text-lg font-semibold text-slate-800">
                        Media
                      </h2>
                    </div>
                    <div className="p-6">
                      <Field name="photo">
                        {({ field, form }: any) => (
                          <FileUpload
                            onFileSelect={(imageUrl) =>
                              form.setFieldValue(field.name, [
                                ...(field.value || []),
                                ...(Array.isArray(imageUrl)
                                  ? imageUrl
                                  : [imageUrl]),
                              ])
                            }
                            onRemove={() => {
                              form.setFieldValue(
                                field.name,
                                (field.value || []).filter(
                                  (file: string) => file !== ''
                                )
                              );
                            }}
                            setUploading={setIsUploading}
                            accept="image/jpeg,image/png"
                            folder="uploads"
                            maxSize={5}
                            multiple={true}
                          />
                        )}
                      </Field>
                      <br />
                      {values.photo && values.photo.length > 0 ? (
                        <ThumbnailList
                          urls={values.photo}
                          onRemove={(url) => removeFile(url)}
                          onAdd={() => console.log('Add more')}
                          showAddButton={true}
                        />
                      ) : (
                        <p>No photos available</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Price */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Price
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Service Price
                      </label>
                      <div className="relative">
                        {/* <DollarSign className="absolute left-3 top-10 -translate-y-1/2 text-slate-400 h-4 w-4" /> */}
                        <Field
                          name="price"
                          type="text"
                          placeholder="0.00"
                          className="w-full rounded-lg border border-slate-300 pl-3 pr-4 py-2"
                        />
                        {errors.price && touched.price && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Status
                    </h3>
                    <Field
                      name="status"
                      as="select"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    >
                      {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.title}
                        </option>
                      ))}
                    </Field>
                    {errors.status && touched.status && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.status}
                      </div>
                    )}
                  </div>

                  {/* Recurring Info */}
                  {values.recurring !== 'one-time' && (
                    <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Repeat className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-slate-800">
                          Recurring Job
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600">
                        This job will be automatically scheduled{' '}
                        {values.recurring}.
                      </p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/jobs')}
                    className="mx-full px-4 py-2 text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {id ? `Update Job` : `Create Job`}
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>

      <Modal
        isOpen={clientModalOpen}
        onClose={() => setclientModalOpen(false)}
        title="Add New Client"
        message="Fill in the details to add a new client."
      >
        <ClientForm
          onSuccess={() => {
            refetchClients();
            setclientModalOpen(false);
          }}
          onCancel={() => setclientModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title="Add New Service"
        message="Fill in the details to add a new service."
      >
        <ServiceForm
          onSuccess={() => {
            refetchServices();
            setServiceModalOpen(false);
          }}
          onCancel={() => setServiceModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
