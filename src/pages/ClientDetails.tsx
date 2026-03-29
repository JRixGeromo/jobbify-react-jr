import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Tag,
  MessageCircle,
  Bell,
  Settings,
  FileText,
  Receipt,
  Package,
  User,
  DollarSign,
  Save,
  X,
  Edit2,
} from 'lucide-react';
import { jobs } from '../data/jobs';
import { quotes } from '../data/quotes';
import { invoices } from '../data/invoices';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  clientTags,
  clientActivities,
  clientContacts,
  clientPreferences,
} from '../data/client-activity';
import { format } from 'date-fns';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CLIENT_BY_ID_QUERY, GET_JOBS_BY_CLIENT_ID_QUERY, GET_QUOTES_BY_CLIENT_ID_QUERY, GET_INVOICES_BY_CLIENT_ID_QUERY, GET_SERVICES_BY_COMPANY_ID_QUERY, GET_LOGS_BY_ENTITY_ID_QUERY } from '@/graphql/queries';
import { UPDATE_CLIENT } from '@/graphql/mutations';
import { toast } from 'sonner';
import { LocationInput } from '@/components/LocationInput';
import { ServiceItem } from '../types/services';
import { Quote } from '../types/quotes';
import { Invoice } from '../types/invoices';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useLogActivity } from '../utils/loggingService';
import { useAuth } from '../contexts/AuthContext';

type TabType =
  | 'overview'
  | 'jobs'
  | 'quotes'
  | 'invoices'
  | 'products'
  | 'contacts';

interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  photo: string | null;
  notes: string;
  company_id: number;
  created_by: string;
}

interface ClientData {
  id?: string;
  first_name?: string;
  last_name?: string;
  email_address?: string;
  phone_number?: string;
  address?: string;
  image_path?: string | null;
  company?: string;
  notes?: string;
  company_id?: number;
  created_by?: string;
}

interface JobData {
  id: string;
  clients: { id: string; full_name: string };
  status_id: number;
  services: { id: string; name: string }[];
  start_date: string;
  start_time: string;
  statuses: { id: string; title: string };
}

interface LogData {
  id: string;
  timestamp: string;
  level: string;
  message: string;
  entity: string;
  entity_id: string;
  source: string;
  meta: object;
}

// Define a custom Location type to avoid conflicts with the DOM API
interface CustomLocation {
  address: string;
  lat: number;
  lng: number;
}

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [client, setClient] = useState<ClientData>();
  const [updateClient] = useMutation(UPDATE_CLIENT);
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    photo: null,
    notes: '',
    company_id: 0,
    created_by: '',
  });
  const logActivity = useLogActivity();

  const { loading: clientLoading, error: clientError, data: clientData } = useQuery(GET_CLIENT_BY_ID_QUERY, {
    variables: { id },
  });

  const { loading: jobsLoading, error: jobsError, data: jobsData } = useQuery(GET_JOBS_BY_CLIENT_ID_QUERY, {
    variables: { clientId: id },
  });

  const { loading: quotesLoading, error: quotesError, data: quotesData } = useQuery(GET_QUOTES_BY_CLIENT_ID_QUERY, {
    variables: { clientId: id },
  });

  const { loading: invoicesLoading, error: invoicesError, data: invoicesData } = useQuery(GET_INVOICES_BY_CLIENT_ID_QUERY, {
    variables: { clientId: id },
  });

  const { loading: servicesLoading, error: servicesError, data: servicesData } = useQuery(GET_SERVICES_BY_COMPANY_ID_QUERY, {
    variables: { companyId: client?.company_id },
  });

  const { loading: logsLoading, error: logsError, data: logsData } = useQuery(GET_LOGS_BY_ENTITY_ID_QUERY, {
    variables: { entityId: id },
  });

  useEffect(() => {
    if (clientData?.clientsCollection?.edges?.[0]?.node) {
      const client = clientData.clientsCollection.edges[0].node;
      console.log('Client Data:', client);

      setFormData({
        firstName: client.first_name || '',
        lastName: client.last_name || '',
        email: client.email_address || '',
        phone: client.phone_number || '',
        address: client.address || '',
        company: client.company || '',
        photo: client.image_path || null,
        notes: client.notes || '',
        company_id: client.company_id || 0,
        created_by: client.created_by || '',
      });
      setClient(client);
    }
  }, [clientData]);

  useEffect(() => {
    if (jobsData) {
      console.log('Jobs Data from Backend:', jobsData);
      jobsData.jobsCollection.edges.forEach((edge: { node: JobData }) => {
        console.log('Job Node:', edge.node);
      });
    }
  }, [jobsData]);

  useEffect(() => {
    if (client) {
      console.log('client ID:', client.id);
    }
  }, [client]);

  if (clientLoading || jobsLoading || quotesLoading || invoicesLoading || servicesLoading || logsLoading) return <p>Loading...</p>;
  if (clientError) return <p>Error: {clientError.message}</p>;
  if (jobsError) return <p>Error: {jobsError.message}</p>;
  if (quotesError) return <p>Error: {quotesError.message}</p>;
  if (invoicesError) return <p>Error: {invoicesError.message}</p>;
  if (servicesError) return <p>Error: {servicesError.message}</p>;
  if (logsError) return <p>Error loading logs: {logsError.message}</p>;

  const clientJobs = jobsData?.jobsCollection?.edges
    .map((edge: { node: JobData }) => edge.node)
    .filter((job: JobData) => job.clients && job.clients.id === id);

  console.log('Client Jobs:', clientJobs);

  const clientQuotes = quotes.filter(
    (quote) => quote.client === `${formData.firstName} ${formData.lastName}`
  );
  const clientInvoices = invoices.filter(
    (invoice) => invoice.client === `${formData.firstName} ${formData.lastName}`
  );

  const uploadFile = async (file: any) => {
    const uuid = uuidv4();
    const imagePath = `/uploads/clients/${uuid}/${file.name}`;
    const { data, error } = await supabase.storage
      .from('labor-grid')
      .upload(imagePath, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    const { data: imageUrlData } = supabase.storage
      .from('labor-grid')
      .getPublicUrl(imagePath);

    if (!imageUrlData || !imageUrlData.publicUrl) {
      console.error('Error generating public URL for image');
      return null;
    }

    return imageUrlData.publicUrl;
  };

  const handleFileUpload = async (file: any) => {
    const imagePath = await uploadFile(file);

    if (imagePath) {
      console.log('File uploaded successfully:', imagePath);
      setFormData({ ...formData, photo: imagePath });
    } else {
      console.error('File upload failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data before save:', formData);
    try {
      const { data } = await updateClient({
        variables: {
          set: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email_address: formData.email,
            phone_number: formData.phone,
            address: formData.address,
            company: formData.company,
            image_path: formData.photo || undefined,
          },
          id: id,
        },
      });

      toast.success('Update created successfully!', {
        description: `has been added to your clients.`,
        action: {
          label: 'View all clients',
          onClick: () => navigate('/clients'),
        },
      });

      if (currentUser) {
        await logActivity({
          level: 'INFO',
          message: 'Client updated',
          userId: currentUser.id,
          entity: 'Client',
          entityId: id,
          source: 'Frontend',
          meta: { updatedClient: formData },
        });
      } else {
        console.error('User is not authenticated.');
      }

    } catch (error: any) {
      if (error.graphQLErrors?.length > 0) {
        const graphqlError = error.graphQLErrors[0];

        // Check for the unique constraint violation
        if (graphqlError.message.includes('duplicate key value')) {
          if (graphqlError.message.includes('unique_email')) {
            toast.error(
              'Email address already exists. Please use a different one.'
            );
          } else if (graphqlError.message.includes('unique_phone')) {
            toast.error(
              'Phone number already exists. Please use a different one.'
            );
          }
        } else {
          toast.error(graphqlError.message || 'Something went wrong!');
        }
      } else {
        toast.error('Failed to create client. Please try again.');
      }
    }

    const updatedClient: ClientData = {
      ...client,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email_address: formData.email,
      phone_number: formData.phone,
      address: formData.address,
      company: formData.company,
      image_path: formData.photo,
    };
    setClient(updatedClient);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
    { id: 'jobs', label: 'Jobs', icon: <Calendar className="h-4 w-4" /> },
    { id: 'quotes', label: 'Quotes', icon: <FileText className="h-4 w-4" /> },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      id: 'products',
      label: 'Product Mix',
      icon: <Package className="h-4 w-4" />,
    },
    { id: 'contacts', label: 'Contacts', icon: <Phone className="h-4 w-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="col-span-3 space-y-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Client Information
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            firstName: client?.first_name || '',
                            lastName: client?.last_name || '',
                            email: client?.email_address || '',
                            phone: client?.phone_number || '',
                            address: client?.address || '',
                            company: client?.company || '',
                            photo: client?.image_path || null,
                            notes: client?.notes || '',
                            company_id: client?.company_id || 0,
                            created_by: client?.created_by || '',
                          });
                        }}
                        className="text-slate-400 hover:text-slate-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <>
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Address
                      </label>
                      {isEditing ? (
                        <LocationInput
                          value={{ address: formData.address, lat: 0, lng: 0 }}
                          onChange={(location: CustomLocation | null) => {
                            if (location) {
                              setFormData({
                                ...formData,
                                address: location.address,
                              });
                            }
                          }}
                          placeholder="Enter full address"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        onChange={(e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleFileUpload(file);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        rows={4}
                        placeholder="Add any additional notes about the client..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-sm text-slate-600">
                      <User className="h-4 w-4 mr-3 text-slate-400" />
                      <span>Client since</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone className="h-4 w-4 mr-3 text-slate-400" />
                      {client?.phone_number}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Mail className="h-4 w-4 mr-3 text-slate-400" />
                      {client?.email_address}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="h-4 w-4 mr-3 text-slate-400" />
                      {client?.address}
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-slate-600">
                  <DollarSign className="h-4 w-4 mr-3 text-slate-400" />
                  <span>Total Revenue: $12,450</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                  <span>Total Jobs: {clientJobs.length}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <FileText className="h-4 w-4 mr-3 text-slate-400" />
                  <span>
                    Active Quotes:{' '}
                    {
                      clientQuotes.filter((q) => q.status === 'Pending')
                        .length
                    }
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Receipt className="h-4 w-4 mr-3 text-slate-400" />
                  <span>
                    Outstanding Invoices:{' '}
                    {clientInvoices.filter((i) => i.status === 'Sent').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {logsData?.logsCollection?.edges.map(({ node: log }: { node: LogData }) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                    <div>
                      <p className="text-sm text-slate-800">{log.message}</p>
                      <p className="text-xs text-slate-500">{format(new Date(log.timestamp), 'PPp')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Upcoming Jobs
                </h3>
                <div className="space-y-4">{renderJobs(1)}</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  In Progress
                </h3>
                <div className="space-y-4">{renderJobs(2)}</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Completed Jobs
                </h3>
                <div className="space-y-4">{renderJobs(4)}</div>
              </div>
            </div>
          </div>
        );

      case 'quotes':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
            <table className="min-w-full divide-y divide-purple-100">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Quote #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Service
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {quotesData?.quotesCollection?.edges.map(({ node: quote }: { node: Quote }) => (
                  <tr key={quote.id} className="hover:bg-purple-50">
                    <td className="px-6 py-4 text-sm text-slate-900">#{quote.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{quote.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{quote.service_id}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">${quote.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        quote.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : quote.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {quote.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'invoices':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
            <table className="min-w-full divide-y divide-purple-100">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Service ID
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {invoicesData?.invoicesCollection?.edges.map(({ node: invoice }: { node: Invoice }) => (
                  <tr key={invoice.id} className="hover:bg-purple-50">
                    <td className="px-6 py-4 text-sm text-slate-900">#{invoice.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{invoice.service_id}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">${Number(invoice.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        invoice.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : invoice.status === 'Overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Product Usage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">
                    Available Services
                  </h4>
                  <div className="space-y-3">
                    {servicesData?.servicesCollection?.edges.map(({ node: service }: { node: ServiceItem }) => (
                      <div key={service.id} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">{service.name}</span>
                        <span className="text-sm font-medium text-slate-800">${service.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-6">
            {clientContacts
              .filter((contact) => contact.clientId === id)
              .map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white rounded-lg shadow-sm border border-purple-100 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-purple-600">
                        {contact.type} Contact
                      </p>
                    </div>
                    {contact.isDefault && (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {contact.email}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {contact.address}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        );
    }
  };

  const renderJobs = (statusId: number) => {
    return clientJobs
      .filter((job: JobData) => job.statuses.id === statusId.toString())
      .map((job: JobData) => (
        <Link key={job.id} to={`/jobs/${job.id}`} className="block p-4 rounded-lg bg-slate-50 hover:bg-slate-100">
          <div className="font-medium text-slate-800">{job.services[0]?.name}</div>
          <div className="text-sm text-slate-600">{job.start_date} at {job.start_time}</div>
        </Link>
      ));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/clients"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Link>
        <Breadcrumbs />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {client?.image_path ? (
            <img
              src={client.image_path}
              alt={client?.first_name || "Client Image"}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {client?.first_name} {client?.last_name}
            </h1>
            <p className="text-slate-600">Client since {}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-purple-100">
        <nav className="flex flex-wrap space-x-4 md:space-x-0 md:flex-nowrap" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">{renderTabContent()}</div>
    </main>
  );
}
