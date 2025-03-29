import { useEffect, useState } from 'react';
import { useTableNamesStore } from './stores/tableNamesStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDeleteTable } from '@/queries/useDeleteTable.ts';

function DeleteCheckBoxButton() {
  const selectedTableName = useTableNamesStore(
    (state) => state.props.selectedTableName,
  );
  const removeSelectedTable = useTableNamesStore(
    (state) => state.actions.removeSelectedTable,
  );
  const [isChecked, setIsChecked] = useState(false);
  const { mutate, isPending, isSuccess } = useDeleteTable(selectedTableName);

  useEffect(() => {
    if (isSuccess) removeSelectedTable();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  function buttonHandler() {
    if (!isChecked || selectedTableName === '' || isPending) return;

    mutate();
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-2.5">
        <Checkbox
          id="checkbox"
          onCheckedChange={(e) => setIsChecked(e === true)}
        />
        <Label htmlFor="checkbox" className="font-semibold">
          I am sure i want to delete the selected table
        </Label>
      </div>
      <Button onClick={buttonHandler}>Delete table</Button>
    </div>
  );
}

export { DeleteCheckBoxButton };
