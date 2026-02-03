import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Job, JobStatus, getStatusColor } from '../../data/jobs';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, GripVertical } from 'lucide-react';
import { clients } from '../../data/clients';
import { JobNew } from '@/types/jobs';

interface JobBoardProps {
  jobs: JobNew[];
}

const columns: { status: JobStatus; title: string }[] = [
  { status: 'Scheduled', title: 'Scheduled' },
  { status: 'In Progress', title: 'In Progress' },
  { status: 'On Hold', title: 'On Hold' },
  { status: 'Completed', title: 'Completed' },
  { status: 'Cancelled', title: 'Cancelled' },
];

export function JobBoard({ jobs: initialJobs }: JobBoardProps) {
  const [jobs, setJobs] = useState(initialJobs);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newStatus = destination.droppableId as JobStatus;

    setJobs(
      jobs.map((job) =>
        job.id === result.draggableId ? { ...job, status: newStatus } : job
      )
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {columns.map(({ status, title }) => (
          <div key={status} className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">{title}</h3>
              <span className="text-xs text-slate-500">
                {jobs.filter((job) => job.statuses.title === status).length}
              </span>
            </div>

            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-4 min-h-[200px] transition-colors ${
                    snapshot.isDraggingOver ? 'bg-emerald-50' : ''
                  }`}
                >
                  {jobs
                    .filter((job) => job.statuses.title === status)
                    .map((job, index) => {
                      const client = clients.find(
                        (c) => c.id === job.clients.id
                      );
                      return (
                        <Draggable
                          key={job.id}
                          draggableId={job.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white rounded-lg p-4 shadow-sm border border-emerald-100 ${
                                snapshot.isDragging ? 'shadow-md' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-1 text-slate-400 hover:text-slate-600"
                                >
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Link to={`/jobs/${job.id}`}>
                                    <h4 className="font-medium text-slate-800 mb-2">
                                      {job.services.id}
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center text-slate-600">
                                        <Clock className="h-4 w-4 mr-2" />
                                        {/* {job.schedule_time} */}
                                      </div>
                                      <div className="flex items-center text-slate-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span className="truncate">
                                          {job.location}
                                        </span>
                                      </div>
                                      <div className="flex items-center text-slate-600">
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        {job.price}
                                      </div>
                                    </div>
                                    {client && (
                                      <div className="mt-3 flex items-center gap-2">
                                        <img
                                          src={client.photo}
                                          alt={client.name}
                                          className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-sm text-slate-600 truncate">
                                          {client.name}
                                        </span>
                                      </div>
                                    )}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
