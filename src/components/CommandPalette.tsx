import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'lucide-react';
import {
  Plus,
  FileText,
  Receipt,
  Briefcase,
  Users,
  Settings,
  Calendar,
} from 'lucide-react';

interface CommandItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    {
      id: 'new-job',
      name: 'New Job',
      description: 'Create a new service job',
      icon: <Briefcase className="h-5 w-5" />,
      action: () => navigate('/jobs/new'),
    },
    {
      id: 'new-invoice',
      name: 'New Invoice',
      description: 'Create a new invoice',
      icon: <Receipt className="h-5 w-5" />,
      action: () => navigate('/invoices/new'),
    },
    {
      id: 'new-quote',
      name: 'New Quote',
      description: 'Create a new quote',
      icon: <FileText className="h-5 w-5" />,
      action: () => navigate('/quotes/new'),
    },
    {
      id: 'new-client',
      name: 'New Client',
      description: 'Add a new client',
      icon: <Users className="h-5 w-5" />,
      action: () => navigate('/clients/new'),
    },
    {
      id: 'schedule',
      name: 'View Schedule',
      description: 'Open job schedule',
      icon: <Calendar className="h-5 w-5" />,
      action: () => navigate('/jobs?view=timeline'),
    },
    {
      id: 'settings',
      name: 'Settings',
      description: 'Open settings',
      icon: <Settings className="h-5 w-5" />,
      action: () => navigate('/settings'),
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.name.toLowerCase().includes(search.toLowerCase()) ||
      command.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg">
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <Command className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0"
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredCommands.map((command) => (
            <button
              key={command.id}
              onClick={() => {
                command.action();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                {command.icon}
              </span>
              <div>
                <div className="font-medium text-slate-800">{command.name}</div>
                <div className="text-xs text-slate-500">
                  {command.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
