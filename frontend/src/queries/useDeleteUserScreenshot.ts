import { useMutation } from '@tanstack/react-query';
import { delay } from '@/utils/delay.ts';

const useDeleteUserScreenshot = (
  userIdName: string,
  userId: string,
  tableName: string
) => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async () => {
      const time = Date.now();

      const response = await fetch(
        `http://localhost:3000/screenshot/delete-user-screenshot/userIdName/${userIdName}/userId/${userId}/tableName/${tableName}`,
        {
          method: 'DELETE',
        }
      );

      const timeDiff = Date.now() - time;

      if (timeDiff < 500) await delay(500, timeDiff);

      if (!response.ok) throw new Error('Failed to delete user screenshot');
    },
  });

  return { mutate, isPending, isError, isSuccess };
};

export { useDeleteUserScreenshot };
