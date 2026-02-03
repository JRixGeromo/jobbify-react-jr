import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Clock,
  DollarSign,
  Tag,
  Edit2,
  Trash2,
  Box,
  Repeat,
} from 'lucide-react';
import { priceBookItems, PriceBookItem } from '../../data/price-book';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { TipTapEditor } from '../../components/editor/TipTapEditor';
import { useAuth } from '@/contexts/AuthContext';
import { GET_SERVICE_BY_ID } from '@/graphql/queries';
import { useQuery } from '@apollo/client';

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const { currentUser } = useAuth(); // Get current user from Auth Context
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const {
    data: item,
    loading,
    error,
  } = useQuery(GET_SERVICE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  useEffect(() => {
    if (item) {
      const fetchService = item.servicesCollection.edges[0]?.node;
      if (fetchService) {
        setService(fetchService);
      }
    }
  }, [item]);

  if (!service) {
    return <div>Service not found</div>;
  }
  const getTypeIcon = () => {
    switch (service.type) {
      case 'Service':
        return <Clock className="h-5 w-5 text-purple-600" />;
      case 'Material':
        return <Box className="h-5 w-5 text-purple-600" />;
      case 'Product':
        return <Package className="h-5 w-5 text-purple-600" />;
      case 'Subscription':
        return <Repeat className="h-5 w-5 text-purple-600" />;
    }
  };

  const formatPrice = (
    price: number | null | undefined,
    unit: string,
    frequency?: string
  ) => {
    if (price == null) {
      return 'N/A'; // Fallback value when price is null or undefined
    }

    const formattedPrice = price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    if (service?.type === 'Subscription' && frequency) {
      return `${formattedPrice}/${frequency}`;
    }

    switch (unit) {
      case 'per_hour':
        return `${formattedPrice}/hr`;
      case 'per_day':
        return `${formattedPrice}/day`;
      case 'per_unit':
        return formattedPrice;
      case 'per_sqft':
        return `${formattedPrice}/sq.ft`;
      case 'per_project':
        return formattedPrice;
      default:
        return formattedPrice;
    }
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    {getTypeIcon()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                      {service.name}
                    </h1>
                    <p className="text-purple-600">{service.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/services/edit/${service.id}`)}
                    className="p-2 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      // Handle delete
                      navigate('/services');
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100">
            <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
              <h2 className="text-lg font-semibold text-slate-800">Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">SKU</p>
                  <p className="font-medium text-slate-800">{service.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Category</p>
                  <p className="font-medium text-slate-800">
                    {service.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Price</p>
                  <p className="font-medium text-slate-800">
                    {formatPrice(
                      service.price,
                      service.unit,
                      service.sub_frequency
                    )}
                  </p>
                </div>
                {service.type === 'Subscription' && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Frequency</p>
                    <p className="font-medium text-slate-800 capitalize">
                      {service.sub_frequency}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Description</p>
                  <p className="text-slate-800">{service.description}</p>
                </div>

                {service.sub_details && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Subscription Details
                    </p>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-slate-800">{service.sub_details}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Media */}
          {service.image && (
            <div className="bg-white rounded-lg shadow-sm border border-purple-100">
              <div className="border-b border-purple-100 px-6 py-4 bg-purple-50">
                <h2 className="text-lg font-semibold text-slate-800">Media</h2>
              </div>
              <div className="p-6">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              {service.type === 'Material' || service.type === 'Product' ? (
                <>
                  <div>
                    <p className="text-sm text-slate-500">Current Stock</p>
                    <p className="text-2xl font-semibold text-slate-800">
                      {service.inStock || 0} units
                    </p>
                  </div>
                  {service.minStock && (
                    <div>
                      <p className="text-sm text-slate-500">Minimum Stock</p>
                      <p className="text-2xl font-semibold text-slate-800">
                        {service.minStock} units
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-slate-500">Active Jobs</p>
                    <p className="text-2xl font-semibold text-slate-800">12</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Completed Jobs</p>
                    <p className="text-2xl font-semibold text-slate-800">48</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-slate-500">Revenue (30 days)</p>
                <p className="text-2xl font-semibold text-slate-800">$4,850</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {service.tags && JSON.parse(service.tags).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(service.tags).map((tag: any) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
