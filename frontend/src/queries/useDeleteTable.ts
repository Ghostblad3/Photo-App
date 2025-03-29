import { useMutation } from '@tanstack/react-query';
import { delay } from '@/utils/delay.ts';

const useDeleteTable = (tableName: string) => {
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      const time = Date.now();

      const response = await fetch(
        `http://localhost:3000/table/delete/${tableName}`,
        {
          method: 'DELETE',
        }
      );

      const timeDiff = Date.now() - time;

      if (timeDiff < 500) await delay(500, timeDiff);

      if (!response.ok) throw new Error('Failed to delete table');
    },
  });

  return { mutate, isPending, isSuccess, isError };
};

export { useDeleteTable };
