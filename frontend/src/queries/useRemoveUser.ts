import { useMutation } from '@tanstack/react-query';
import { delay } from '@/utils/delay.ts';

const useRemoveUser = () => {
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async ({
      tableName,
      userId,
      userIdName,
    }: {
      tableName: string;
      userId: string;
      userIdName: string;
    }) => {
      const time = Date.now();

      const response = await fetch(
        `http://localhost:3000/record/remove-user/tableName/${tableName}/userId/${userId}/userIdName/${userIdName}`,
        {
          method: 'DELETE',
        }
      );

      const timeDiff = Date.now() - time;

      if (timeDiff < 500) await delay(500, timeDiff);

      if (!response.ok) throw new Error('Failed to delete user');

      return await response.json();
    },
  });

  return { mutate, isPending, isSuccess, isError };
};

export { useRemoveUser };
