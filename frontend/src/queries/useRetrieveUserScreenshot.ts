import { useQuery } from '@tanstack/react-query';
import { delay } from '@/utils/delay.ts';

const useRetrieveUserScreenshot = (
  tableName: string,
  hash: string,
  keyName: string,
  userInfo: {
    [p: string]: string;
  }
) => {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['screenshot', hash],
    queryFn: async () => {
      const timeNow = new Date();

      const response = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-screenshot/${keyName}/${userInfo[keyName]}/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user screenshot');
      }

      const timeDiff = Date.now() - timeNow.getTime();

      if (timeDiff < 500) await delay(500, timeDiff);

      const {
        status,
        data,
      }: {
        status: string;
        data: string;
        error: { message: string };
      } = await response.json();

      if (status === 'error') throw new Error('Error');

      return { data };
    },
  });

  return { data, isFetching, isError };
};

export { useRetrieveUserScreenshot };
