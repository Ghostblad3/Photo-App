import { useMutation } from '@tanstack/react-query';
import { delay } from '@/utils/delay.ts';

const useUpdateUser = (tableName: string, userId: string) => {
  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async (updatedUserProps: { [key: string]: string }) => {
      const time = Date.now();

      const result = await fetch('http://localhost:3000/record/update-user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableName: tableName,
          userId: userId,
          user: updatedUserProps,
        }),
      });

      const timeDiff = Date.now() - time;

      if (timeDiff < 500) await delay(500, timeDiff);

      if (!result.ok) throw new Error('Failed to update user information');
    },
  });

  return { mutate, isPending, isSuccess, isError };
};

export { useUpdateUser };
