import React from 'react';
import { ChevronDown } from 'lucide-react';
import { getStatusColorNew } from '../../data/jobs';
import { useFetchStatuses } from '@/hooks/useFetchStatuses';
import { useAuth } from '@/contexts/AuthContext';

interface StatusSelectProps {
  status: string;
  onChange: (status: any) => void;
}

export function StatusSelect({ status, onChange }: StatusSelectProps) {
  const { statuses } = useFetchStatuses('JOBS');
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColorNew(
          status
        )}`}
      >
        {status}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {statuses.map((statusOption: any) => (
              <button
                key={statusOption.id}
                onClick={() => {
                  onChange(statusOption);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  status === statusOption.title
                    ? 'bg-emerald-50 text-emerald-900'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {statusOption.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
