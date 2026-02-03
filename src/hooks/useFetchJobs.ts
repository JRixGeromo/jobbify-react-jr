import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_JOBS_QUERY } from '../graphql/queries'; // Adjust the path to your query file
import { JobNew } from '@/types/jobs';

export const useFetchJobs = (companyId: string | null) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const { loading, error, data, refetch } = useQuery<{
    jobsCollection: { edges: { node: JobNew }[] };
  }>(GET_JOBS_QUERY, {
    variables: { companyId },
    skip: !companyId, // Skip the query if companyId is not provided
  });

  useEffect(() => {
    if (data?.jobsCollection?.edges) {
      const fetchedJobs = data.jobsCollection.edges.map(({ node }) => node);
      setJobs(fetchedJobs);
    }
  }, [data]);

  return { jobs, loading, error, refetch };
};
