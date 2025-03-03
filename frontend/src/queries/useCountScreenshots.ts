import { useQuery } from '@tanstack/react-query';

const useCountScreenshots = (tableName: string) => {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['user-count-screenshots', tableName],
    queryFn: async () => {
      const countResponse = await fetch(
        `http://localhost:3000/table/count-screenshots/${tableName}`,
        {
          cache: 'no-store',
        },
      );

      if (!countResponse.ok) throw new Error('Failed to fetch user data');

      const countResult: {
        status: string;
        data: number;
        error: { message: string };
      } = await countResponse.json();

      const { data } = countResult;

      return { data };
    },
    enabled: tableName !== '',
  });

  return { data, isFetching, isError };
};

export { useCountScreenshots };