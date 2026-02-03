import React from 'react';
import { Package, Clock, DollarSign, Pencil, Trash2, Box } from 'lucide-react';
import { PriceBookItem } from '../../data/price-book';
import { ServiceItem } from '@/data/services';

interface PriceBookListProps {
  items: ServiceItem[];
  onEdit: (item: ServiceItem) => void;
  onDelete: (id: string) => void;
}

export function PriceBookList({ items, onEdit, onDelete }: PriceBookListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Service':
        return <Clock className="h-5 w-5 text-purple-600" />;
      case 'Material':
        return <Box className="h-5 w-5 text-purple-600" />;
      case 'Product':
        return <Package className="h-5 w-5 text-purple-600" />;
    }
  };

  const formatPrice = (price: number, unit: string) => {
    const formattedPrice = price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

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
    <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
      <table className="min-w-full divide-y divide-purple-100">
        <thead className="bg-purple-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-purple-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">
                      {item.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {item.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-600">{item.category}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-600">{item.sku}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-medium text-slate-800">
                  {formatPrice(item.price, item.unit)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {item.inStock !== undefined ? (
                  <span
                    className={`text-sm font-medium ${
                      item.inStock <= (item.minStock || 0)
                        ? 'text-red-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {item.inStock} units
                  </span>
                ) : (
                  <span className="text-sm text-slate-500">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1 text-slate-400 hover:text-purple-600 rounded-full hover:bg-purple-50"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
