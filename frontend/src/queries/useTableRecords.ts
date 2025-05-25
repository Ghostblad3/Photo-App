import { useQuery } from '@tanstack/react-query';
import { delay } from '@/utils/delay.ts';

const useTableRecords = (tableName: string) => {
  const { isSuccess, isError, isFetching, data, refetch } = useQuery({
    queryKey: ['tableRecords', tableName],
    queryFn: async () => {
      const time = Date.now();

      const firstRequestResponse = await fetch(
        `http://localhost:3000/record/get-user-data/tableName/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!firstRequestResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const {
        status,
        data,
      }: {
        status: string;
        data: { [key: string]: string }[];
        error: { message: string };
      } = await firstRequestResponse.json();

      if (status === 'error') {
        throw new Error('Error');
      }

      const secondRequestResponse = await fetch(
        `http://localhost:3000/screenshot/retrieve-user-data-with-screenshots/tableName/${tableName}`,
        {
          cache: 'no-store',
        }
      );

      if (!secondRequestResponse.ok) {
        throw new Error('Failed to fetch user data with screenshots');
      }

      const {
        status: secondRequestStatus,
        data: secondRequestData,
      }: {
        status: string;
        data: { [key: string]: string }[];
        error: { message: string };
      } = await secondRequestResponse.json();

      if (secondRequestStatus === 'error') {
        throw new Error('Error');
      }

      const userDataUpdated = data;
      const firstUser = data[0];

      const keys = Object.keys(firstUser)[0];
      const idKey = keys[0];

      userDataUpdated.forEach((user) => {
        const currUserWithScreenshotData = secondRequestData.find(
          (u) => u[idKey] === user[idKey]
        );

        if (currUserWithScreenshotData) {
          user.has_screenshot = 'yes';
          user.screenshot_day = currUserWithScreenshotData.dayNumber;
          user.photo_timestamp = new Date(
            currUserWithScreenshotData.photo_timestamp
          ).toLocaleString('it-IT');
        } else {
          user.has_screenshot = 'no';
          user.screenshot_day = '-';
          user.photo_timestamp = '-';
        }
      });

      const timeTaken = Date.now() - time;

      if (timeTaken < 500) await delay(500, timeTaken);

      return { data: userDataUpdated };
    },
    enabled: false,
  });

  return { isSuccess, isError, isFetching, data, refetch };
};

export { useTableRecords };
