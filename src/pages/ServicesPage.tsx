import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, LayoutGrid, List } from 'lucide-react';
import {
  PriceBookItem,
  ItemType,
  categories,
  priceBookItems as initialItems,
} from '../data/price-book';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PriceBookCard } from '../components/services/PriceBookCard';
import { PriceBookList } from '../components/services/PriceBookList';
import { useAuth } from '@/contexts/AuthContext';
import { useFetchServices } from '@/hooks/useFetchServices';
import { ServiceItem } from '@/data/services';
import { useMutation } from '@apollo/client';
import { DELETE_SERVICE } from '@/graphql/mutations';
import { GET_SERVICES_QUERY } from '@/graphql/queries';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price_asc' | 'price_desc' | 'stock';

function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [inStockOnly, setInStockOnly] = useState(false);
  const navigate = useNavigate();
  const { companyId } = useAuth();
  const { services: initialItems } = useFetchServices(companyId);
  const [items, setItems] = useState<ServiceItem[]>(initialItems);
  const [deleteService, { loading: deleteLoading }] =
    useMutation(DELETE_SERVICE);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]); // Update items whenever initialItems changes

  console.log(items);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await deleteService({
          variables: { id },
          refetchQueries: [
            { query: GET_SERVICES_QUERY, variables: { companyId } },
          ],
        });
        alert('Service deleted successfully');
      } catch (err) {
        console.error('Error deleting service:', err);
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(item.type);
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);
    const matchesStock = !inStockOnly || (item.inStock && item.inStock > 0);

    return matchesSearch && matchesType && matchesCategory && matchesStock;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'stock':
        return (b.inStock || 0) - (a.inStock || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs />
        <div className="mt-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Price Book</h1>
            <p className="text-slate-600">
              Manage services, materials, and products
            </p>
          </div>
          <button
            onClick={() => navigate('/services/add')}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search price book..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md rounded-lg border border-slate-200 pl-9 pr-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-3 py-2 rounded-lg border ${
              showFilters
                ? 'border-purple-200 bg-purple-50 text-purple-700'
                : 'border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 hover:text-purple-700'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <div className="flex gap-2 border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type
              </label>
              <div className="space-y-2">
                {['Service', 'Material', 'Product', 'Subscription'].map(
                  (type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type as ItemType)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTypes([
                              ...selectedTypes,
                              type as ItemType,
                            ]);
                          } else {
                            setSelectedTypes(
                              selectedTypes.filter((t) => t !== type)
                            );
                          }
                        }}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-slate-600">
                        {type}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                multiple
                value={selectedCategories}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setSelectedCategories(values);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                size={4}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="name">Name</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="stock">Stock Level</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Stock Status
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-slate-600">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <PriceBookCard
              key={item.id}
              item={item}
              onEdit={(item) => navigate(`/services/edit/${item.id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <PriceBookList
          items={sortedItems}
          onEdit={(item) => navigate(`/services/edit/${item.id}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ServicesPage;
