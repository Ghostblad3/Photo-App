import { useQuery } from '@tanstack/react-query';

const useTableCountRecords = (tableName: string) => {
  const { data, isError, isFetching } = useQuery({
    queryKey: ['table-info-count-records', tableName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/table/count-records/${tableName}`,
        {
          cache: 'no-store',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch record count');
      }

      const {
        status,
        data,
      }: {
        status: string;
        data: number;
        error: { message: string };
      } = await response.json();

      if (status === 'error') {
        throw new Error('Failed to fetch record count');
      }

      return { data };
    },
    enabled: tableName !== '',
    retry: false,
  });

  return { data, isError, isFetching };
};


export { useTableCountRecords };