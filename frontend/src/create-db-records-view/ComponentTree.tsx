import { useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import DragAndDropExcelFileComponent from "./DragAndDropExcelFileComponent";
import FieldsComponent from "./FieldsComponent";
import CreateTable from "./CreateTable";
import fieldsStore from "./stores/fieldsStore";
import navigationStore from "./stores/navigationStore";
import Records from "./Records";
import dataStore from "./stores/dataStore";

function ComponentTree() {
  const fields = fieldsStore((state) => state.props.fields);
  const visibleFields = fieldsStore((state) => state.props.visibleFields);
  const resetFieldsStore = fieldsStore(
    (state) => state.actions.resetFieldsStore
  );
  const data = dataStore((state) => state.props.data);
  const resetDataStore = dataStore((state) => state.actions.resetDataStore);
  const index = navigationStore((state) => state.props.index);
  const allowLeft = navigationStore((state) => state.props.allowLeft);
  const allowRight = navigationStore((state) => state.props.allowRight);
  const { decrementIndex, incrementIndex, resetNagivationStore } =
    navigationStore((state) => state.actions);

  useEffect(() => {
    return () => {
      resetNagivationStore();
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
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between">
        {!allowLeft && <span className="h-10 w-10"></span>}

        {allowLeft && (
          <Button onClick={handleLeftButtonClick} variant="outline" size="icon">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        )}

        {!allowRight && <span className="h-10 w-10"></span>}
        {allowRight && (
          <Button
            onClick={handleRightButtonClick}
            variant="outline"
            size="icon"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {(fields.length === 0 || index === 0) && (
        <DragAndDropExcelFileComponent />
      )}
      {fields.length > 0 && index === 1 && <FieldsComponent />}
      {visibleFields.length > 0 && index === 2 && <Records />}
      {fields.length > 0 && data.length > 0 && index === 3 && <CreateTable />}
    </div>
  );
}

export default ComponentTree;
