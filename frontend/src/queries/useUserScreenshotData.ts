import { useQuery } from '@tanstack/react-query';

const useUserScreenshotData = (tableName: string) => {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['user-data', tableName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-screenshots-all-days/${tableName}`,
        {
          cache: 'no-store',
        },
      );

      if (!response.ok) throw new Error('Failed to fetch user data');

      const result: {
        status: string;
        data: { [key: string]: string }[];
        error: { message: string };
      } = await response.json();

      const { data } = result;

      if (data.length === 0) return { data: [], keys: [] };

      const firstObject = data[0];
      const keys = Object.keys(firstObject).filter(
        (key) => key !== 'screenshot',
      );

      return { data, keys };
    },
    enabled: tableName !== '',
  });

  return { data, isFetching, isError };
};

export { useUserScreenshotData };