import { memo, useEffect, useRef, useState } from 'react';
import { CircleX } from 'lucide-react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useUserDataStore } from './stores/userDataStore';
import { useAddNewUserStore } from './stores/addNewUserStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAddUsers } from '@/queries/useAddUsers.ts';

const AddNewUserDialog = memo(() => {
  const userKeys = useUserDataStore((state) => state.props.userKeys);
  const { addUser } = useUserDataStore((state) => state.actions);
  const showDialog = useAddNewUserStore((state) => state.props.showDialog);
  const tableName = useAddNewUserStore((state) => state.props.tableName);
  const { setShowDialog, resetAddNewUserStore } = useAddNewUserStore(
    (state) => state.actions
  );
  const keysRef = useRef(
    userKeys.filter(
      (key) =>
        key !== 'has_screenshot' &&
        key !== 'screenshot_day' &&
        key !== 'photo_timestamp'
    )
  );
  const userRef = useRef<{ [key: string]: string }>(
    keysRef.current.reduce((acc: { [key: string]: string }, key) => {
      acc[key] = '';
      return acc;
    }, {})
  );
  const [fieldsModified, setFieldsModified] = useState<{
    [key: string]: boolean;
  }>(
    keysRef.current.reduce((acc: { [key: string]: boolean }, key) => {
      acc[key] = false;
      return acc;
    }, {})
  );
  const [buttonIsDisabled, setButtonIsDisabled] = useState(true);
  const { mutate, isSuccess, isPending, isError } = useAddUsers();

  useEffect(() => {
    if (!isPending && (isSuccess || isError)) setShowDialog(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, isSuccess, isError]);

  useEffect(() => {
    if (isSuccess) {
      addUser({
        ...userRef.current,
        has_screenshot: 'no',
        screenshot_day: '-',
        photo_timestamp: '-',
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    return () => {
      resetAddNewUserStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!Object.values(fieldsModified).some((value) => !value)) {
      setButtonIsDisabled(false);
      return;
    }

    if (!buttonIsDisabled) setButtonIsDisabled(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldsModified]);

  function addNewUserButtonHandler() {
    mutate({ tableName, displayableData: [userRef.current] });
  }

  return (
    <Dialog open={showDialog} onOpenChange={(open) => setShowDialog(open)}>
      <DialogContent className="sm:max-w-[26.563rem]">
        <DialogHeader>
          <DialogTitle>Add new user</DialogTitle>
        </DialogHeader>
        {keysRef.current.map((key) => {
          return (
            <div key={key} className="mx-4">
              <p className="block space-y-1 text-sm font-semibold">{key}</p>
              <Input
                className="mt-1"
                defaultValue={''}
                onChange={(e) => {
                  userRef.current[key] = e.target.value;

                  if (e.target.value.length > 0) {
                    setFieldsModified((prev) => ({ ...prev, [key]: true }));
                  } else {
                    setFieldsModified((prev) => ({ ...prev, [key]: false }));
                  }
                }}
              />
              {(fieldsModified[key] && userRef.current[key].length === 0) ||
                (userRef.current[key].length > 50 && (
                  <div className="mt-2 flex items-center">
                    <CircleX className="mr-1 size-5 text-red-500" />
                    <Label className="text-red-500">
                      Field must be between 1 and 50 characters
                    </Label>
                  </div>
                ))}
            </div>
          );
        })}
        <Button
          className="mx-4 w-[calc(100%_-_2rem)]"
          onClick={addNewUserButtonHandler}
          disabled={isPending || buttonIsDisabled}
        >
          {isPending && <ReloadIcon className="mr-2 size-4 animate-spin" />}
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
});

export { AddNewUserDialog };
