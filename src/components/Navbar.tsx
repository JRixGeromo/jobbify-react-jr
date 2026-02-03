import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PlusCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center ml-12 lg:ml-0">
            <Sparkles className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-bold text-slate-800">
              Jobbify
            </span>
          </Link>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            <PlusCircle className="h-5 w-5 mr-2" />
            New Job
          </button>
        </div>
      </div>
    </nav>
  );
}
