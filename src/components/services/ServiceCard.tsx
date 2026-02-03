import React from 'react';
import { Wrench, Clock, DollarSign, Pencil, Trash2 } from 'lucide-react';
import { Service } from '../../data/services';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Wrench className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-800">{service.name}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(service)}
            className="p-1 text-slate-400 hover:text-purple-600 rounded-full hover:bg-purple-50"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-4">{service.description}</p>
      <div className="space-y-2">
        <div className="flex items-center text-sm text-slate-600">
          <Clock className="h-4 w-4 mr-2" />
          {service.duration}
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <DollarSign className="h-4 w-4 mr-2" />
          Starting from {service.startingPrice}
        </div>
      </div>
    </div>
  );
}
