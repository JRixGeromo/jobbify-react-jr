import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Save,
  Building2,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FileUpload } from '../components/ui/file-upload';
import { useMutation } from '@apollo/client';
import { CREATE_CLIENT } from '@/graphql/mutations';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { LocationInput } from '@/components/LocationInput';

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

export default function CreateClientPage() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState({ address: '', lat: 0, lng: 0 });

  useEffect(() => {
    // Fetch user session and set userId & companyId
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        setUserId(user.id); // User UUID
        setCompanyId(user.user_metadata?.company_id); // User's company_id from metadata
      }
    };

    fetchUserData();
  }, []);

  const navigate = useNavigate();
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

  const [createClient, { error }] = useMutation(CREATE_CLIENT);
  const [imageUrl, setImageUrl] = useState('');
  const uuid = uuidv4();
  // Function to upload a file
  const uploadFile = async (file: any) => {
    const imagePath = `/uploads/clients/${uuid}/${file.name}`;
    const { data, error } = await supabase.storage
      .from('jobbify')
      .upload(imagePath, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Generate public URL for the image
    const { data: imageUrlData } = supabase.storage
      .from('jobbify') // Replace with your actual bucket name
      .getPublicUrl(imagePath);
    // Check if the public URL exists before proceeding
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createClient({
        variables: {
          input: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email_address: formData.email,
            phone_number: formData.phone,
            address: address.address,
            company: formData.company,
            image_path: formData.photo,
            notes: formData.notes,
            company_id: companyId,
            created_by: userId,
          },
        },
      });

      toast.success('Client created successfully!', {
        description: `has been added to your clients.`,
        action: {
          label: 'View all clients',
          onClick: () => navigate('/clients'),
        },
      });
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
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/clients"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Link>
        <Breadcrumbs />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-800">Add New Client</h1>
          <p className="text-slate-600">Create a new client profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Basic Information
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
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
                <div>
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

                <div>
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    onChange={(e: any) => {
                      console.log('heyy!');
                      const file = e.target.files[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Contact Information
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-slate-800">
                    Address
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <LocationInput
                  value={address}
                  onChange={(location) => {
                    console.log('Selected location:', location);
                    setAddress(location || { address: '', lat: 0, lng: 0 });
                  }}
                  placeholder="Enter client address"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Additional Notes
                </h2>
              </div>
              <div className="p-6">
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
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/clients')}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Client
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Preview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Client preview"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-purple-600" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-slate-800">
                    {formData.firstName} {formData.lastName}
                  </h4>
                  {formData.company && (
                    <p className="text-sm text-purple-600">
                      {formData.company}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {formData.email || 'email@example.com'}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {formData.phone || '(555) 555-5555'}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {formData.address || 'Address'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Tips</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>• Use a professional photo for better client recognition</p>
              <p>• Include all available contact methods</p>
              <p>• Add detailed notes about client preferences</p>
              <p>• Verify contact information accuracy</p>
              <p>• Include any specific requirements or preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
