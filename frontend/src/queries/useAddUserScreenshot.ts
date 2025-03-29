import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { delay } from '@/utils/delay.ts';

const useAddUserScreenshot = (
  screenshotBlob: Blob,
  userIdName: string,
  userId: string,
  dayNumber: string,
  tableName: string
) => {
  const [progress, setProgress] = useState(0);
  const { mutate, data, isIdle, isPending, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      const time = Date.now();
      const buffer = await screenshotBlob?.arrayBuffer();
      const array = Array.from(new Uint8Array(buffer!));

      await delay(1000);

      const response = await new Promise<{
        code: number;
        responseString: string;
      }>((resolve, reject) => {
        const req = new XMLHttpRequest();

        req.open(
          'POST',
          'http://localhost:3000/screenshot/add-user-screenshot',
          true
        );
        req.setRequestHeader('Content-Type', 'application/json');

        // Add event listener to upload listening for progress. Function fires
        // regularly, with progress contained in "e" object
        req.upload.addEventListener('progress', (e) => {
          // Every time progress occurs
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        });

        // Fires when upload is complete
        req.addEventListener('load', () => {
          resolve({ code: req.status, responseString: req.response });
        });

        req.addEventListener('error', () => {
          reject('error');
        });

        req.send(
          JSON.stringify({
            userIdName,
            userId,
            dayNumber,
            tableName,
            screenshot: {
              type: 'Buffer',
              data: array,
            },
          })
        );
      });

      const endTime = Date.now();

      if (endTime - time < 500) await delay(500, endTime - time);

      const { code, responseString } = response;

      if (code !== 201) throw new Error('Error creating screenshot');

      const result: {
        status: string;
        data: { photo_timestamp: string };
        error: { message: string };
      } = JSON.parse(responseString);

      await delay(1000);

      const { data } = result;

      return data;
    },
  });

  return { mutate, data, isIdle, isPending, isSuccess, isError, progress };
};

export { useAddUserScreenshot };
