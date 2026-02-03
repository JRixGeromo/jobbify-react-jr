import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_STATUSES_BY_MODULE_QUERY } from '../graphql/queries'; // Adjust the path to your query file
import { Status } from '@/types/statuses';

export const useFetchStatuses = (module: string) => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const { loading, error, data, refetch } = useQuery<{
    statusesCollection: { edges: { node: Status }[] };
  }>(GET_STATUSES_BY_MODULE_QUERY, {
    variables: {
      module,
    },
    skip: !module, // Skip the query if module is not provided
  });

  useEffect(() => {
    if (data?.statusesCollection?.edges) {
      const fetchedStatuses = data.statusesCollection.edges.map(
        ({ node }) => node
      );
      setStatuses(fetchedStatuses);
    }
  }, [data]);

  return { statuses, loading, error, refetch };
};
