import { useQuery } from '@tanstack/react-query';

const useTableScreenshotsSize = (tableName: string) => {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['table-info-screenshots-size', tableName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/table/screenshots-size/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch screenshots size');
      }

      const {
        status,
        data,
      }: {
        status: string;
        data: number;
        error: { message: string };
      } = await response.json();

      if (status === 'error')
        throw new Error('Failed to fetch screenshots size');

      return { data };
    },
    enabled: tableName !== '',
  });

  return { data, isFetching, isError };
};

export { useTableScreenshotsSize };
