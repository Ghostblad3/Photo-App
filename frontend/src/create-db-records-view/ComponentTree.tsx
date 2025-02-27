import { useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { DragAndDropExcelFile } from './DragAndDropExcelFile';
import { Fields } from './Fields';
import { CreateTable } from './CreateTable';
import { useFieldsStore } from './stores/fieldsStore';
import { useNavigationStore } from './stores/navigationStore';
import { Records } from './Records';
import { useDataStore } from './stores/dataStore';
import { Button } from '@/components/ui/button.tsx';

function ComponentTree() {
  const fields = useFieldsStore((state) => state.props.fields);
  const visibleFields = useFieldsStore((state) => state.props.visibleFields);
  const resetFieldsStore = useFieldsStore(
    (state) => state.actions.resetFieldsStore,
  );
  const data = useDataStore((state) => state.props.data);
  const resetDataStore = useDataStore((state) => state.actions.resetDataStore);
  const index = useNavigationStore((state) => state.props.index);
  const allowLeft = useNavigationStore((state) => state.props.allowLeft);
  const allowRight = useNavigationStore((state) => state.props.allowRight);
  const { decrementIndex, incrementIndex, resetNavigationStore } =
    useNavigationStore((state) => state.actions);

  useEffect(() => {
    return () => {
      resetNavigationStore();
      resetFieldsStore();
      resetDataStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLeftButtonClick() {
    if (index > 0) {
      decrementIndex();
    }
  }

  function handleRightButtonClick() {
    if (index < 3) {
      incrementIndex();
    }
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex justify-between">
        {!allowLeft && <span className="size-10"></span>}
        {allowLeft && (
          <Button onClick={handleLeftButtonClick} variant="outline" size="icon">
            <ChevronLeftIcon className="size-4" />
          </Button>
        )}
        {!allowRight && <span className="size-10"></span>}
        {allowRight && (
          <Button
            onClick={handleRightButtonClick}
            variant="outline"
            size="icon"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        )}
      </div>
      {(fields.length === 0 || index === 0) && <DragAndDropExcelFile />}
      {fields.length > 0 && index === 1 && <Fields />}
      {visibleFields.length > 0 && index === 2 && <Records />}
      {fields.length > 0 && data.length > 0 && index === 3 && <CreateTable />}
    </div>
  );
}

export { ComponentTree };
