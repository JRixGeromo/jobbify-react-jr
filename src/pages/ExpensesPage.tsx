import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Receipt,
  Calendar,
  DollarSign,
  Building2,
  Tag,
} from 'lucide-react';
import { Modal } from '../components/ui/modal';
import {
  Expense,
  ExpenseCategory,
  expenses as initialExpenses,
} from '../data/expenses';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ExpenseForm } from '../components/expenses/ExpenseForm';

type ViewMode = 'grid' | 'list';
type SortOption = 'date' | 'amount' | 'category' | 'status';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    ExpenseCategory[]
  >([]);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const handleSubmit = (formData: Partial<Expense>) => {
    if (editingExpense) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === editingExpense.id
            ? { ...expense, ...formData }
            : expense
        )
      );
    } else {
      const newExpense: Expense = {
        id: Date.now().toString(),
        ...(formData as Omit<Expense, 'id'>),
      };
      setExpenses([...expenses, newExpense]);
    }
    handleCloseModal();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      (expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategories.length === 0 ||
        selectedCategories.includes(expense.category)) &&
      (statusFilter.length === 0 || statusFilter.includes(expense.status))
  );

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'amount':
        return b.amount - a.amount;
      case 'category':
        return a.category.localeCompare(b.category);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs />
        <div className="mt-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Expenses</h1>
            <p className="text-slate-600">Track and manage business expenses</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <div className="space-y-2">
                {[
                  'Materials',
                  'Equipment',
                  'Vehicle',
                  'Office',
                  'Marketing',
                  'Insurance',
                  'Utilities',
                  'Payroll',
                  'Other',
                ].map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(
                        category as ExpenseCategory
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            category as ExpenseCategory,
                          ]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category)
                          );
                        }
                      }}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
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
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <div className="space-y-2">
                {['Pending', 'Approved', 'Rejected'].map((status) => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStatusFilter([...statusFilter, status]);
                        } else {
                          setStatusFilter(
                            statusFilter.filter((s) => s !== status)
                          );
                        }
                      }}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white rounded-lg shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Receipt className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {expense.description}
                    </h3>
                    <span className="text-sm text-purple-600">
                      {expense.category}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}
                >
                  {expense.status}
                </span>
              </div>

              {expense.receipt && (
                <img
                  src={expense.receipt}
                  alt="Receipt"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}

              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {expense.date}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <DollarSign className="h-4 w-4 mr-2" />$
                  {expense.amount.toFixed(2)}
                </div>
                {expense.vendor && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    {expense.vendor}
                  </div>
                )}
                {expense.jobId && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Tag className="h-4 w-4 mr-2" />
                    Job #{expense.jobId}
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(expense)}
                  className="px-3 py-1 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
          <table className="min-w-full divide-y divide-purple-100">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-100">
              {sortedExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-purple-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-900">
                        {expense.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">
                      {expense.description}
                    </div>
                    {expense.vendor && (
                      <div className="text-sm text-slate-500">
                        {expense.vendor}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-900">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-slate-900">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}
                    >
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
