import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { CircleAlert } from 'lucide-react';
import { useDataStore } from './stores/dataStore';
import { useNavigationStore } from './stores/navigationStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCreateTable } from '@/queries/useCreateTable.ts';
import { useAddUsers } from '@/queries/useAddUsers.ts';

function CreateTable() {
  const displayableData = useDataStore((state) => state.props.displayableData);
  const resetDataStore = useDataStore((state) => state.actions.resetDataStore);
  const { resetNavigationStore } = useNavigationStore((state) => state.actions);
  const setAllowRight = useNavigationStore(
    (state) => state.actions.setAllowRight
  );

  const inputRef = useRef('');
  const [tableName, setTableName] = useState('');
  const [inputErrors, setInputErrors] = useState<{
    typeOne: boolean;
    typeTwo: boolean;
    typeThree: boolean;
  }>({ typeOne: false, typeTwo: false, typeThree: false });
  const [allowCreateTable, setAllowCreateTable] = useState(false);

  const {
    mutate: createTableMutate,
    isPending: createTablePending,
    isSuccess: createTableSuccess,
    isError: createTableError,
  } = useCreateTable(tableName, displayableData);

  const {
    mutate: createUsersMutate,
    isPending: createUsersPending,
    isSuccess: createUsersSuccess,
    isError: createUsersError,
  } = useAddUsers();

  useEffect(() => {
    if (allowCreateTable) createTableMutate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowCreateTable]);

  useEffect(() => {
    if (createTablePending) return;

    if (createTableError) setAllowCreateTable(false);

    if (createTableSuccess) createUsersMutate({ tableName, displayableData });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTablePending, createTableSuccess, createTableError]);

  useEffect(() => {
    if (createUsersPending) return;

    if (createUsersSuccess || createUsersError) {
      resetDataStore();
      resetNavigationStore();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUsersPending, createUsersSuccess, createUsersError]);

  useEffect(() => {
    setAllowRight(false);
  }, [setAllowRight]);

  function inputHandler(e: ChangeEvent<HTMLInputElement>) {
    inputRef.current = e.target.value;
    const _input = inputRef.current;

    let inputErrors = { typeOne: false, typeTwo: false, typeThree: false };

    if (_input.length < 5 || _input.length > 20) {
      inputErrors = { ...inputErrors, typeOne: true };
    }

    if (_input.endsWith('_photos')) {
      inputErrors = { ...inputErrors, typeTwo: true };
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(_input)) {
      inputErrors = { ...inputErrors, typeThree: true };
    }

    setInputErrors(inputErrors);

    if (!inputErrors.typeOne && inputErrors.typeTwo && inputErrors.typeThree) {
      setTableName(inputRef.current);
    }
  }

  function buttonHandler() {
    if (
      inputErrors.typeOne ||
      inputErrors.typeTwo ||
      inputErrors.typeThree ||
      createTablePending ||
      createUsersPending
    )
      return;

    setAllowCreateTable(true);
  }

  return (
    <div className="w-full space-y-12 rounded-md border p-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold decoration-slate-100">
          Create New Table
        </h1>
        <p className="text-slate-500">Enter a name for your new table.</p>
      </div>

      <div className="flex flex-col space-y-2.5">
        <Label htmlFor="name" className="font-bold">
          Table Name
        </Label>
        <Input id="name" placeholder="Table name" onChange={inputHandler} />
        {inputErrors.typeOne && (
          <div className="flex gap-2.5">
            <CircleAlert className="shrink-0 text-red-500" />
            <p className="text-red-500">
              The table name must be between 5 and 20 characters.
            </p>
          </div>
        )}
        {inputErrors.typeTwo && (
          <div className="flex gap-2.5">
            <CircleAlert className="shrink-0 text-red-500" />
            <p className="text-red-500">
              The table name must not end with "_photos".
            </p>
          </div>
        )}
        {inputErrors.typeThree && (
          <div className="flex gap-2.5">
            <CircleAlert className="shrink-0 text-red-500" />
            <p className="text-red-500">
              The table name must contain only letters, numbers, and
              underscores. It can only start with letters and underscores.
            </p>
          </div>
        )}
        <Button onClick={buttonHandler} disabled={tableName === ''}>
          Create table
        </Button>
      </div>
    </div>
  );
}

export { CreateTable };
