import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  Receipt,
  Calendar,
  User,
  DollarSign,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Trash2,
  Edit,
} from 'lucide-react';
import { GET_INVOICES } from '../graphql/queries';
import { DELETE_INVOICE } from '../graphql/mutations';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { useFetchClients } from '@/hooks/useFetchClient';
import { useFetchServices } from '@/hooks/useFetchServices';
import { Modal } from '../components/Modal';
import { AlertDialog } from '@/components/ui/alert-dialog';

type ViewMode = 'grid' | 'list';
type SortOption = 'date' | 'client' | 'amount' | 'status' | 'dueDate';

interface InvoiceNode {
  id: string;
  client_id: string;
  service_id: string;
  date: string;
  payment_due_date: string;
  total: string;
  status: string;
  notes: string;
  terms: string;
}

interface InvoiceEdge {
  node: InvoiceNode;
}

interface InvoicesData {
  invoicesCollection: {
    edges: InvoiceEdge[];
  };
}

export default function InvoicesPage() {
  const { companyId } = useAuth();
  const navigate = useNavigate();

  const [deleteInvoice, { loading: deleteLoading }] = useMutation(DELETE_INVOICE, {
    update(cache, { data: { deleteInvoice } }) {
      const existingData = cache.readQuery<InvoicesData>({
        query: GET_INVOICES,
        variables: { companyId },
      });

      if (existingData && deleteInvoice) {
        const updatedInvoices = existingData.invoicesCollection.edges.filter(
          (edge) => edge.node.id !== invoiceToDelete
        );

        cache.writeQuery({
          query: GET_INVOICES,
          data: {
            invoicesCollection: {
              ...existingData.invoicesCollection,
              edges: updatedInvoices,
            },
          },
          variables: { companyId },
        });
      }
    },
  });

  const PAGE_SIZE = 9;
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [beforeCursor, setBeforeCursor] = useState<string | null>(null);
  const [isNext, setIsNext] = useState<boolean>(true);

  const {
    data,
    loading: fetchingInvoices,
    error,
  } = useQuery(GET_INVOICES, {
    variables: isNext
      ? { first: PAGE_SIZE, after: afterCursor, companyId }
      : { last: PAGE_SIZE, before: beforeCursor, companyId },
    skip: !companyId,
  });

  const { clients, loading: clientsLoading } = useFetchClients(companyId);
  const { services, loading: servicesLoading } = useFetchServices(companyId);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  const confirmDeleteInvoice = (id: string) => {
    setInvoiceToDelete(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      await deleteInvoice({ variables: { id: invoiceToDelete } });
      alert('Invoice deleted successfully');
    } catch (err) {
      console.error('Error deleting invoice:', err);
    } finally {
      setShowModal(false);
      setInvoiceToDelete(null);
    }
  };

  if (fetchingInvoices || clientsLoading || servicesLoading) {
    return <div>Loading invoices...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const invoices: InvoiceNode[] =
    data?.invoicesCollection?.edges?.map((edge: InvoiceEdge) => edge.node) ||
    [];
  const { hasNextPage, hasPreviousPage, startCursor, endCursor } =
    data?.invoicesCollection?.pageInfo || {};

  const clientMap = new Map(
    clients.map((client) => [String(client.id), `${client.first_name} ${client.last_name}`])
  );
  const serviceMap = new Map(
    services.map((service) => [String(service.id), service.name])
  );

  const filteredInvoices = invoices.filter((invoice) => {
    const clientName =
      clientMap.get(String(invoice.client_id))?.toLowerCase() || '';
    const serviceName =
      serviceMap.get(String(invoice.service_id))?.toLowerCase() || '';
    return (
      (clientName.includes(searchQuery.toLowerCase()) ||
        serviceName.includes(searchQuery.toLowerCase())) &&
      (statusFilter.length === 0 || statusFilter.includes(invoice.status))
    );
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    const clientA = clientMap.get(String(a.client_id)) || '';
    const clientB = clientMap.get(String(b.client_id)) || '';
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'dueDate':
        return (
          new Date(b.payment_due_date).getTime() -
          new Date(a.payment_due_date).getTime()
        );
      case 'client':
        return clientA.localeCompare(clientB);
      case 'amount':
        return parseFloat(b.total) - parseFloat(a.total);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const handleNextPage = () => {
    if (hasNextPage) {
      setAfterCursor(endCursor);
      setBeforeCursor(null);
      setIsNext(true);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setBeforeCursor(startCursor);
      setAfterCursor(null);
      setIsNext(false);
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        description="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      <div className="flex flex-col min-h-screen p-6 bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
        <div className="flex-grow">
          <div className="mb-6">
            <Breadcrumbs />
            <div className="mt-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Invoices
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Track payments and manage invoices
                </p>
              </div>
              <button
                onClick={() => navigate('/invoices/new')}
                className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Invoice
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-md rounded-lg border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-3 py-2 rounded-lg border ${
                  showFilters
                    ? 'border-purple-200 bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-400'
                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-200 hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <div className="flex gap-2 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-100 mb-1">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-700 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="date">Invoice Date</option>
                    <option value="dueDate">Due Date</option>
                    <option value="client">Client</option>
                    <option value="amount">Amount</option>
                    <option value="status">Status</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-100 mb-1">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Draft', 'Sent', 'Paid', 'Overdue'].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setStatusFilter((prev) =>
                            prev.includes(status)
                              ? prev.filter((s) => s !== status)
                              : [...prev, status]
                          )
                        }
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          statusFilter.includes(status)
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300'
                            : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-purple-100 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-700 rounded-lg">
                      <Receipt className="h-5 w-5 text-purple-600 dark:text-purple-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {serviceMap.get(String(invoice.service_id)) ||
                          'Unknown Service'}
                      </h3>
                      <p className="text-sm text-purple-600 dark:text-purple-300">
                        {clientMap.get(String(invoice.client_id)) ||
                          'Unknown Client'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due:{' '}
                      {invoice.payment_due_date
                        ? new Date(invoice.payment_due_date).toLocaleDateString()
                        : 'N/A'}
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {parseFloat(invoice.total).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent div's onClick from triggering
                        navigate(`/invoices/edit/${invoice.id}`); // Navigate to edit page
                      }}
                      className="px-3 py-1 text-sm text-blue-600 dark:text-blue-300 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-700 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteInvoice(invoice.id);
                      }}
                      disabled={deleteLoading}
                      className={`px-3 py-1 text-sm ${
                        deleteLoading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'text-red-600 dark:text-red-300 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-700'
                      } rounded-lg`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-purple-100 dark:border-slate-700 overflow-hidden">
              <table className="min-w-full divide-y divide-purple-100 dark:divide-slate-700">
                <thead className="bg-purple-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 dark:divide-slate-700">
                  {sortedInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      className="hover:bg-purple-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Receipt className="h-5 w-5 text-purple-600 dark:text-purple-200 mr-3" />
                          <span className="font-medium text-slate-800 dark:text-slate-100">
                            {serviceMap.get(String(invoice.service_id)) ||
                              'Unknown Service'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-2" />
                          <span className="text-slate-600 dark:text-slate-300">
                            {clientMap.get(String(invoice.client_id)) ||
                              'Unknown Client'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-2" />
                          <span className="text-slate-600 dark:text-slate-300">
                            {invoice.payment_due_date
                              ? new Date(
                                  invoice.payment_due_date
                                ).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          ${parseFloat(invoice.total).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            invoice.status === 'Paid'
                              ? 'bg-emerald-100 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-200'
                              : invoice.status === 'Overdue'
                                ? 'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-200'
                                : 'bg-amber-100 dark:bg-amber-700 text-amber-800 dark:text-amber-200'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex gap-2 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent parent div's onClick from triggering
                            navigate(`/invoices/edit/${invoice.id}`);
                          }}
                          className="px-3 py-1 text-sm text-blue-600 dark:text-blue-300 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-700 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteInvoice(invoice.id);
                          }}
                          disabled={deleteLoading}
                          className={`px-3 py-1 text-sm ${
                            deleteLoading
                              ? 'opacity-50 cursor-not-allowed'
                              : 'text-red-600 dark:text-red-300 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-700'
                          } rounded-lg`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 ml-4"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
