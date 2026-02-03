import React, { ReactNode } from 'react';

interface StatusCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  trend: string;
}

function StatusCard({ icon, title, value, trend }: StatusCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-emerald-50">{icon}</div>
      </div>
      <h3 className="mt-4 text-sm font-medium text-slate-500">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <span className="text-sm text-emerald-600">{trend}</span>
      </div>
    </div>
  );
}

export default StatusCard;
