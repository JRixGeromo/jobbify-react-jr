import React, { useEffect, useState } from 'react';
import {
  Plus,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { Job, JobStatus } from '../data/jobs';
import JobCard from '../components/jobs/JobCard';
import { JobList } from '../components/jobs/JobList';
import { JobBoard } from '../components/jobs/JobBoard';
import { JobTimeline } from '../components/jobs/JobTimeline';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useNavigate } from 'react-router-dom';
import { useFetchClients } from '@/hooks/useFetchClient';
import { useAuth } from '@/contexts/AuthContext';
import { useFetchJobs } from '@/hooks/useFetchJobs';
import { JobNew } from '@/types/jobs';

type ViewMode = 'list' | 'board' | 'card' | 'timeline';
type SortOption = 'date' | 'client' | 'price' | 'status';

function JobsPage() {
  const navigate = useNavigate();
  const { companyId } = useAuth();
  const { clients, loading: clientsLoading } = useFetchClients(companyId);
  const {
    jobs: initialJobs,
    loading: jobsLoading,
    refetch,
  } = useFetchJobs(companyId);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [statusFilter, setStatusFilter] = useState<string | ''>('');
  const [jobs, setJobs] = useState<JobNew[]>([]); // Start with an empty array

  // Synchronize `jobs` with `initialJobs` when it changes
  useEffect(() => {
    if (initialJobs) {
      setJobs(initialJobs);
    }
  }, [initialJobs]); // Runs whenever `initialJobs` changes

  const jobsWithClientNames = jobs.map((job) => {
    const client = clients.find((c) => c.id === job.clients.id);
    return {
      ...job,
      clientName: client?.first_name && client?.last_name ? `${client.first_name} ${client.last_name}` : 'Unknown Client',
    };
  });


  const filteredJobs = jobsWithClientNames.filter(
    (job) =>
      (job.clientName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        job.services.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter.length === 0 || statusFilter.includes(job.statuses.title))
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return (
          new Date(b.schedule_date).getTime() -
          new Date(a.schedule_date).getTime()
        );
      case 'client':
        return a.clientName.localeCompare(b.clientName);
      case 'price':
        return (
          // parseFloat(b.price.replace(/[^0-9.-]+/g, '')) -
          // parseFloat(a.price.replace(/[^0-9.-]+/g, ''))
          100
        );
      case 'status':
        return a.statuses.title.localeCompare(b.statuses.title);
      default:
        return 0;
    }
  });

  console.log('Sorted Jobs:', sortedJobs);

  const ViewToggle = () => (
    <div className="flex gap-2 border border-slate-200 rounded-lg p-1">
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
      <button
        onClick={() => setViewMode('board')}
        className={`p-2 rounded ${
          viewMode === 'board'
            ? 'bg-purple-50 text-purple-700'
            : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => setViewMode('card')}
        className={`p-2 rounded ${
          viewMode === 'card'
            ? 'bg-purple-50 text-purple-700'
            : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
        }`}
      >
        <Calendar className="h-4 w-4" />
      </button>
      <button
        onClick={() => setViewMode('timeline')}
        className={`p-2 rounded ${
          viewMode === 'timeline'
            ? 'bg-purple-50 text-purple-700'
            : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
        }`}
      >
        <Clock className="h-4 w-4" />
      </button>
    </div>
  );

  const refetchJobs = async () => {
    try {
      const { data: refreshedData } = await refetch();
      console.log('Clients refreshed:', refreshedData);
      if (refreshedData?.jobsCollection?.edges) {
        const fetchJobs = refreshedData.jobsCollection.edges.map(
          ({ node }) => node
        );
        setJobs(fetchJobs);
      }
    } catch (error) {
      console.error('Failed to refetch jobs:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs />
        <div className="mt-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Jobs</h1>
            <p className="text-slate-600">Manage and track all service jobs</p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate('/jobs/new')}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Job
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
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
          <ViewToggle />
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
                <option value="date">Date</option>
                <option value="client">Client</option>
                <option value="price">Price</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Scheduled',
                  'In Progress',
                  'On Hold',
                  'Completed',
                  'Cancelled',
                ].map((status) => (
                  <button
                    key={status}
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusFilter.includes(status as JobStatus)
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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

      {viewMode === 'card' && (
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
          <div className="divide-y divide-purple-100">
            {sortedJobs.map((job) => {
              // Ensure job.services is a string before parsing
              const parsedServices: { name: string }[] = typeof job.services === 'string' ? JSON.parse(job.services) : job.services;
              console.log('Parsed Services:', parsedServices);

              // Extract the service name
              const serviceName: string = parsedServices.length > 0 ? parsedServices[0].name : 'No Service';
              console.log('Service Name:', serviceName);

              const imagePathArray = JSON.parse(job.image_path);
              const imagePath = imagePathArray.length > 0 ? imagePathArray[0] : '';

              return (
                <JobCard
                  key={job.id}
                  id={job.id}
                  location={job.location}
                  notes={job.notes}
                  recurringSchedule={job.recurring_schedule}
                  scheduleDate={job.schedule_date}
                  startTime={job.start_time}
                  endTime={job.end_time}
                  imagePath={imagePath}
                  serviceName={serviceName}
                  statusName={job.statuses.title}
                  price={job.price}
                  refetchJobs={refetchJobs}
                />
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'list' && <JobList jobs={sortedJobs} />}
      {viewMode === 'board' && <JobBoard jobs={sortedJobs} />}
      {viewMode === 'timeline' && <JobTimeline jobs={sortedJobs} />}
    </div>
  );
}

export default JobsPage;
