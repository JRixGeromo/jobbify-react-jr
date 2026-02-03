import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMPANY_PROFILE } from '../../graphql/queries';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { CompanyProfileForm } from '../../components/settings/CompanyProfileForm';
import { Building2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function CompanyProfilePage() {
  const { currentUser, companyId } = useAuth();

  const { data, loading, error } = useQuery(GET_COMPANY_PROFILE, {
    variables: { companyId },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/settings"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Link>
        <Breadcrumbs />
        <div className="mt-4 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Company Profile
            </h1>
            <p className="text-slate-600">
              Manage your company information and branding
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-purple-100">
          <CompanyProfileForm
            profile={data?.companiesCollection?.edges[0]?.node}
            userId={currentUser?.id || ''}
          />
        </div>
      </div>
    </div>
  );
}
