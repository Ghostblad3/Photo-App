import { useMutation } from '@tanstack/react-query';
import { delay } from '@/utils/delay.ts';

const useAddUsers = (tableName: string, displayableData: { [p: string]: string }[]) => {
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      const time = Date.now();
      const response = await fetch('http://localhost:3000/record/add-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users: displayableData,
          tableName,
        }),
      });

      const endTime = Date.now() - time;
      if (endTime < 2000) await delay(2000, endTime);

      if (!response.ok) throw new Error('Failed to add users to the table');
    },
  });

  return { mutate, isPending, isSuccess, isError };
};

export { useAddUsers };