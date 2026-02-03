import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, DollarSign, Tag, Save } from 'lucide-react';
import {
  ItemType,
  categories,
  SubscriptionFrequency,
} from '../../data/price-book';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { FileUpload } from '../../components/ui/file-upload';
import { TipTapEditor } from '../../components/editor/TipTapEditor';
import { PriceUnit } from '@/types/services';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@apollo/client';
import { CREATE_SERVICE } from '@/graphql/mutations';
import { TagsInput } from 'react-tag-input-component';
import { ServiceItem } from '@/data/services';

export default function AddServicePage() {
  const navigate = useNavigate();
  const { companyId } = useAuth();
  const [createService, { loading: createLoading, error: createError }] =
    useMutation(CREATE_SERVICE);
  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    type: '1',
    name: '',
    description: '',
    sku: '',
    category: '1',
    price: 0,
    unit: 'per_hour',
    image_path: '',
    subscriptionFrequency: '',
    subscriptionDetails: '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [detailedDescription, setDetailedDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const input = {
        type: formData.type,
        category: formData.category,
        name: formData.name,
        sku: formData.sku,
        price: formData.price,
        unit: formData.unit,
        short_desc: formData.description,
        detailed_desc: detailedDescription,
        image_path: formData.image_path,
        company_id: companyId,
        tags: JSON.stringify(tags),
        sub_frequency: formData.subscriptionFrequency,
        sub_details: formData.subscriptionDetails,
      };

      try {
        const { data } = await createService({ variables: { input } });
      } catch (error) {
        console.error('Error creating jobs:', error);
      }

      toast.success('Service created successfully!', {
        description: `has been added to your services.`,
        action: {
          label: 'View all services',
          onClick: () => navigate('/services'),
        },
      });
    } catch (err) {
      console.error('Error creating quote:', err);
    }
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData({
      ...formData,
      image_path: imageUrl,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/services"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Link>
        <Breadcrumbs />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-800">Add New Service</h1>
          <p className="text-slate-600">
            Create a new service or subscription plan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Basic Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as ItemType,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      required
                    >
                      <option value="Service">Service</option>
                      <option value="Material">Material</option>
                      <option value="Product">Product</option>
                      <option value="Subscription">Subscription</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Pricing
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          unit: e.target.value as PriceUnit,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      required
                    >
                      <option value="per_hour">Per Hour</option>
                      <option value="per_day">Per Day</option>
                      <option value="per_unit">Per Unit</option>
                      <option value="per_sqft">Per Square Foot</option>
                      <option value="per_project">Per Project</option>
                    </select>
                  </div>
                </div>

                {formData.type === 'Subscription' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Subscription Frequency
                    </label>
                    <select
                      value={formData.subscriptionFrequency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subscriptionFrequency: e.target
                            .value as SubscriptionFrequency,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      required
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="biannual">Bi-Annual</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Description
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Detailed Description
                  </label>
                  <TipTapEditor
                    content={detailedDescription}
                    onChange={setDetailedDescription}
                  />
                </div>

                {formData.type === 'Subscription' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Subscription Details
                    </label>
                    <textarea
                      value={formData.subscriptionDetails}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subscriptionDetails: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      rows={3}
                      placeholder="Enter the details of what's included in this subscription plan"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Media */}
            <div className="bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <h2 className="text-lg font-semibold text-slate-800">Media</h2>
              </div>
              <div className="p-6">
                <FileUpload
                  onFileSelect={(imageUrl) => handleImageChange(imageUrl)}
                  onRemove={() => handleImageChange('')}
                  setUploading={setIsUploading}
                  accept="image/*,image/pdf,image/jpeg"
                  folder="services"
                  currentFile={formData.image_path}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <h2 className="text-lg font-semibold text-slate-800">Tags</h2>
              </div>
              <div className="p-6">
                <TagsInput value={tags} onChange={setTags} name="fruits" />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Service
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
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                {formData.image_path ? (
                  <img
                    src={formData.image_path}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-8 w-8 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-slate-800">
                  {formData.name || 'Service Name'}
                </h4>
                <p className="text-sm text-slate-600">
                  {formData.description || 'Service description'}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Price:</span>
                <span className="font-medium text-slate-800">
                  ${formData.price?.toFixed(2) || '0.00'}
                </span>
              </div>
              {formData.type === 'Subscription' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Frequency:</span>
                  <span className="font-medium text-slate-800 capitalize">
                    {formData.subscriptionFrequency || 'Not set'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Help */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Tips</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>• Use clear, descriptive names for your services</p>
              <p>• Include all relevant details in the description</p>
              <p>• Add high-quality images when possible</p>
              <p>• Use tags to improve searchability</p>
              {formData.type === 'Subscription' && (
                <>
                  <p>• Clearly outline what's included in the subscription</p>
                  <p>• Specify the frequency and duration</p>
                  <p>• Detail any special terms or conditions</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
