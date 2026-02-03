import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_SERVICES_QUERY } from '../graphql/queries'; // Adjust the path to your query file

export const useFetchServices = (companyId: string | null) => {
  const [services, setServices] = useState<any[]>([]);
  const { loading, error, data, refetch } = useQuery<{
    servicesCollection: { edges: { node: any }[] };
  }>(GET_SERVICES_QUERY, {
    variables: { companyId },
    skip: !companyId, // Skip the query if companyId is not provided
  });

  useEffect(() => {
    if (data?.servicesCollection?.edges) {
      const fetchedServices = data.servicesCollection.edges.map(
        ({ node }) => node
      );
      setServices(fetchedServices);
    }
  }, [data]);

  return { services, loading, error, refetch };
};
