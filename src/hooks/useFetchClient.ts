import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_CLIENTS_QUERY } from '../graphql/queries'; // Adjust the path to your query file
import { Client } from '@/types/clients';

export const useFetchClients = (companyId: string | null) => {
  const [clients, setClients] = useState<Client[]>([]);
  const { loading, error, data, refetch } = useQuery<{
    clientsCollection: { edges: { node: Client }[] };
  }>(GET_CLIENTS_QUERY, {
    variables: { companyId },
    skip: !companyId, // Skip the query if companyId is not provided
  });

  useEffect(() => {
    if (data?.clientsCollection?.edges) {
      const fetchedClients = data.clientsCollection.edges.map(
        ({ node }) => node
      );
      setClients(fetchedClients);
    }
  }, [data]);

  return { clients, loading, error, refetch };
};
