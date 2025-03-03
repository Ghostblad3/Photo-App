import { useMutation } from '@tanstack/react-query';
import { delay } from '@/utils/delay.ts';

const useCreateTable = (tableName: string, displayableData: { [p: string]: string }[]) => {
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      const time = Date.now();
      const keys = Object.keys(displayableData[0]);
      const response = await fetch('http://localhost:3000/table/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName,
          columnNames: keys,
        }),
      });

      const endTime = Date.now() - time;

      if (!response.ok) {
        if (endTime < 1000) await delay(1000, endTime);

        if (response.status === 409) throw new Error('Failed to create table, because table already exists');
        else throw new Error('Failed to create table');
      }
    },
  });

  return { mutate, isPending, isSuccess, isError };
};

export { useCreateTable };