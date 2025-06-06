import { useQuery } from '@tanstack/react-query';

const useCountScreenshots = (tableName: string) => {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['user-count-screenshots', tableName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/table/count-screenshots/tableName/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) throw new Error('Failed to fetch user data');

      const {
        status,
        data,
      }: {
        status: string;
        data: number;
        error: { message: string };
      } = await response.json();

      if (status === 'error') throw new Error('Error');

      return { data };
    },
    enabled: tableName !== '',
  });

  return { data, isFetching, isError };
};

export { useCountScreenshots };
