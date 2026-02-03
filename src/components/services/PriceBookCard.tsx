import React from 'react';
import {
  Package,
  Clock,
  DollarSign,
  Pencil,
  Trash2,
  Box,
  Tag,
  Archive,
  Repeat,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceItem } from '@/data/services';

interface PriceBookCardProps {
  item: ServiceItem;
  onEdit: (item: ServiceItem) => void;
  onDelete: (id: string) => void;
}

export function PriceBookCard({ item, onEdit, onDelete }: PriceBookCardProps) {
  const getTypeIcon = () => {
    switch (item.type) {
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

  const formatPrice = (price: number, unit: string, frequency?: string) => {
    const formattedPrice = price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    if (item.type === 'Subscription' && frequency) {
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
    <Link to={`/services/${item.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">{getTypeIcon()}</div>
            <div>
              <h3 className="font-semibold text-slate-800">{item.name}</h3>
              <span className="text-sm text-purple-600">{item.type}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit(item);
              }}
              className="p-1 text-slate-400 hover:text-purple-600 rounded-full hover:bg-purple-50"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(item.id);
              }}
              className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {item.image_path && (
          <img
            src={item.image_path}
            alt={item.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <p className="text-sm text-slate-600 mb-4">{item.description}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">SKU:</span>
            <span className="font-medium text-slate-800">{item.sku}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Category:</span>
            <span className="font-medium text-slate-800">{item.category}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Price:</span>
            <span className="font-medium text-slate-800">
              {formatPrice(item.price, item.unit, item.subscriptionFrequency)}
            </span>
          </div>
          {item.type === 'Subscription' && item.subscriptionFrequency && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Frequency:</span>
              <span className="font-medium text-slate-800 capitalize">
                {item.subscriptionFrequency}
              </span>
            </div>
          )}
          {item.inStock !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Stock:</span>
              <span
                className={`font-medium ${
                  item.inStock <= (item.minStock || 0)
                    ? 'text-red-600'
                    : 'text-emerald-600'
                }`}
              >
                {item.inStock} units
              </span>
            </div>
          )}
        </div>

        {item.subscriptionDetails && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              {item.subscriptionDetails}
            </p>
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {JSON.parse(item.tags).map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
