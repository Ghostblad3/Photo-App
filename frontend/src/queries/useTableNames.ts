import { useQuery } from '@tanstack/react-query';
import { delay } from '@/utils/delay.ts';

const useTableNames = (hash: string) => {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['tableNames-databases-view', hash],
    queryFn: async () => {
      const startTime = Date.now();

      const response = await fetch('http://localhost:3000/table/names', {
        cache: 'no-store',
      });

      const timeTaken = Date.now() - startTime;

      if (timeTaken < 500) await delay(500, timeTaken);

      if (!response.ok) throw new Error('Failed to fetch table names');

      const {
        status,
        data,
      }: {
        status: string;
        data: { name: string }[];
        error: { message: string };
      } = await response.json();

      if (status === 'error') throw new Error('Error');

      return { data: data.map((item) => item.name) };
    },
  });

  return { data, isFetching, isError };
};

export { useTableNames };
