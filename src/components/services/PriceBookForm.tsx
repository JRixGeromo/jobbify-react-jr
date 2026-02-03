import React, { useState } from 'react';
import {
  PriceBookItem,
  ItemType,
  PriceUnit,
  SubscriptionFrequency,
} from '@/types/services';
import { categories } from '@/data/price-book';
import { FileUpload } from '../ui/file-upload';

interface PriceBookFormProps {
  item?: PriceBookItem | null;
  onSubmit: (data: Partial<PriceBookItem>) => void;
  onCancel: () => void;
}

export function PriceBookForm({
  item,
  onSubmit,
  onCancel,
}: PriceBookFormProps) {
  const [formData, setFormData] = useState<Partial<PriceBookItem>>(
    item || {
      type: 'Service',
      name: '',
      description: '',
      sku: '',
      category: categories[0],
      price: 0,
      unit: 'per_hour',
      tags: [],
    }
  );
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mediaFile) {
      const imageUrl = URL.createObjectURL(mediaFile);
      onSubmit({ ...formData, image: imageUrl });
    } else {
      onSubmit(formData);
    }
  };

  const handleFileSelect = (url: string) => {
    console.log(url);
    // Update state or perform other actions with the URL
  };

  const handleFileRemove = () => {
    setMediaFile(null);
    setFormData({ ...formData, image: undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as ItemType })
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
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          SKU
        </label>
        <input
          type="text"
          value={formData.sku || ''}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Image
        </label>
        <FileUpload
          onFileSelect={handleFileSelect}
          onRemove={handleFileRemove}
          setUploading={setIsUploading}
          accept="image/jpeg,image/png"
          folder="uploads"
          maxSize={5}
          multiple={false}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Price
          </label>
          <input
            type="number"
            value={formData.price || ''}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
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
              setFormData({ ...formData, unit: e.target.value as PriceUnit })
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
        <>
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subscription Details
            </label>
            <textarea
              value={formData.subscriptionDetails || ''}
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
        </>
      )}

      {(formData.type === 'Material' || formData.type === 'Product') && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cost
              </label>
              <input
                type="number"
                value={formData.cost || ''}
                onChange={(e) =>
                  setFormData({ ...formData, cost: parseFloat(e.target.value) })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                value={formData.supplier || ''}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Stock
              </label>
              <input
                type="number"
                value={formData.inStock || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inStock: parseInt(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Minimum Stock
              </label>
              <input
                type="number"
                value={formData.minStock || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minStock: parseInt(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                min="0"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags?.join(', ') || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              tags: e.target.value
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
            })
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="e.g., plumbing, repairs, tools"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-600 hover:text-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          {item ? 'Update' : 'Add'} Item
        </button>
      </div>
    </form>
  );
}
