import { useQuery } from '@tanstack/react-query';
import { delay } from '@/utils/delay.ts';

const useTableColumnNames = (tableName: string, _delay: number) => {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['table-info-table-column-names', tableName],
    queryFn: async () => {
      const time = Date.now();

      const response = await fetch(
        `http://localhost:3000/table/table-column-names/${tableName}`,
        {
          cache: 'no-store',
        },
      );

      if (!response.ok) {
        await delay(_delay - (time - Date.now()));
        throw new Error('Failed to fetch table column names');
      }

      const {
        status,
        data,
      }: {
        status: string;
        data: string[];
        error: { message: string };
      } = await response.json();

      if (status === 'error') {
        await delay(_delay - (time - Date.now()));
        throw new Error('Failed to fetch table column names');
      }

      await delay(_delay - (time - Date.now()));
      return { data };
    },
    enabled: tableName !== '',
    retry: false,
  });

  return { data, isFetching, isError };
};

export { useTableColumnNames };
