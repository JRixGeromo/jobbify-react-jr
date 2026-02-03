import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  Search,
  Filter,
  Plus,
  Building2,
  MapPin,
  Tags,
  Activity,
  Clock,
  LayoutGrid,
  List,
  Trash2,
  Pencil,
} from 'lucide-react';
import { clientTags, clientActivities } from '../data/client-activity';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CLIENTS_QUERY } from '@/graphql/queries';
import { DELETE_CLIENT_MUTATION, DELETE_JOBS_BY_CLIENT_MUTATION } from '@/graphql/mutations';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Modal } from '../components/Modal';
import { DeleteClientButton } from '../components/clients/DeleteClientButton';

type SortOption = 'name' | 'recent' | 'oldest';
type ViewMode = 'grid' | 'list';
type Client = {
  id: string;
  full_name: string;
  email_address: string;
  phone_number: string;
  address: string;
  image_path: string;
  tags?: string[];
  company_name?: string;
  company?: string;
};

function ClientsPage() {
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loadingSession, setLoadingSession] = useState(true); // track the loading state for session data
  const [showModal, setShowModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        setCompanyId(user.user_metadata?.company_id); // Set companyId after fetching session
      }
      setLoadingSession(false); // Set loading to false once session data is fetched
    };

    fetchUserData();
  }, []);

  const { loading, error, data, refetch } = useQuery<{
    clientsCollection: { edges: { node: Client }[] };
  }>(GET_CLIENTS_QUERY, {
    variables: { companyId },
    skip: loadingSession || !companyId,
  });

  const [deleteClient] = useMutation(DELETE_CLIENT_MUTATION);
  const [deleteJobsByClient] = useMutation(DELETE_JOBS_BY_CLIENT_MUTATION);

  const fetchClients = async () => {
    try {
      if (data?.clientsCollection?.edges) {
        const fetchedClients = data.clientsCollection.edges.map(
          ({ node }) => ({
            ...node,
            company_name: node.company,
          })
        );
        setClients(fetchedClients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      // Delete associated jobs first
      const { data: jobsData } = await deleteJobsByClient({ variables: { clientId: clientToDelete } });
      console.log('Jobs deleted:', jobsData.deleteFromjobsCollection.affectedCount);

      // Then delete the client
      await deleteClient({ variables: { id: clientToDelete } });

      toast.success('Client and associated jobs successfully deleted!', {
        description: `Client and their jobs have been removed from your list.`,
      });
      refetch();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client. Please try again.');
    } finally {
      setShowModal(false);
      setClientToDelete(null);
    }
  };

  const confirmDeleteClient = (clientId: string) => {
    setClientToDelete(clientId);
    setShowModal(true);
  };

  useEffect(() => {
    fetchClients();
  }, [data]);

  const filteredClients = clients.filter((client) => {
    const fullName = client.full_name || '';
    const emailAddress = client.email_address || '';
    const phoneNumber = client.phone_number || '';
    const address = client.address || '';

    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    const nameA = a.full_name || '';
    const nameB = b.full_name || '';

    switch (sortBy) {
      case 'name':
        return nameA.localeCompare(nameB);
      // case 'recent':
      //   return new Date(b.clientSince).getTime() - new Date(a.clientSince).getTime();
      // case 'oldest':
      //   return new Date(a.clientSince).getTime() - new Date(b.clientSince).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="p-6">
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteClient}
        title="Confirm Deletion"
        message="Are you sure you want to delete this client and all associated jobs?"
      >
        <></>
      </Modal>
      <div className="mb-6">
        <Breadcrumbs />
        <div className="mt-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Clients</h1>
            <p className="text-slate-600">Manage your client relationships</p>
          </div>
          <button
            onClick={() => navigate('/clients/new')}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients..."
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
          <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="name">Name</option>
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {clientTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag.id)
                          ? prev.filter((t) => t !== tag.id)
                          : [...prev, tag.id]
                      )
                    }
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.id)
                        ? tag.color
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedClients.map((client) => (
            <div
              onClick={() => navigate(`/clients/${client.id}`)}
              className="bg-white rounded-lg shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <img
                  src={client.image_path}
                  alt={client.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-slate-800">
                    {client.full_name}
                  </h3>
                  <p className="text-sm text-purple-600">
                    {client.company_name || 'No Company Name'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {client.phone_number}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {client.email_address}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-map-pin flex-shrink-0 mr-2"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="truncate">{client.address}</span>
                </div>
              </div>
              <div className="flex justify-end items-center space-x-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    confirmDeleteClient(client.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <Link
                  key={client.id}
                  to={`/clients/${client.id}`}
                  className="text-blue-600"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
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
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Since
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {sortedClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="hover:bg-purple-50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={client.image_path}
                        alt={client.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-slate-800">
                          {client.full_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {client.phone_number}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {client.email_address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-map-pin flex-shrink-0 mr-2"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span className="truncate">{client.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {/* {client.clientSince} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClientsPage;
