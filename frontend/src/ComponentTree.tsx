import { useContext, useState } from "react";
import { DataContext, GlobalContext } from "./Context.tsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button.tsx";
import DragNDropComponent from "./DragNDropComponent";
import FieldsComponent from "./FieldsComponent";
import Records from "./Records";
import styles from "./component-tree.module.css";

function ComponentTree() {
  const { fields, visibleFields } = useContext<GlobalContext>(DataContext);
  const [visibleCompIndex, setVisibleCompIndex] = useState(0);
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showRightIcon, setShowRightIcon] = useState(false);

  function handleButtonVisibility(value: number) {
    switch (value) {
      case 0:
        setShowLeftIcon(false);
        setShowRightIcon(fields.length > 0);
        break;
      case 1:
        setShowLeftIcon(true);
        setShowRightIcon(visibleFields.length > 0);
        break;
      case 2:
        setShowLeftIcon(fields.length > 0);
        setShowRightIcon(false);
        break;
    }
  }

  function handleLeftButtonClick() {
    setVisibleCompIndex((prev) => {
      handleButtonVisibility(prev - 1);
      return prev - 1;
    });
  }

  function handleRightButtonClick() {
    if (visibleCompIndex === 1 && visibleFields.length === 0) return;

    setVisibleCompIndex((prev) => {
      handleButtonVisibility(prev + 1);
      return prev + 1;
    });
  }

  return (
    <div className={styles.layout}>
      <div className={styles.nav_buttons}>
        {showLeftIcon ? (
          <Button onClick={handleLeftButtonClick} variant="outline" size="icon">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        ) : (
          <div></div>
        )}

        {showRightIcon ? (
          <Button
            onClick={handleRightButtonClick}
            variant="outline"
            size="icon"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      {fields.length === 0 || visibleCompIndex === 0 ? (
        <DragNDropComponent
          setVisibleCompIndex={setVisibleCompIndex}
          handleButtonVisibility={handleButtonVisibility}
        />
      ) : null}

      {fields.length > 0 && visibleCompIndex === 1 ? (
        <FieldsComponent
          setShowRightIcon={setShowRightIcon}
          setVisibleCompIndex={setVisibleCompIndex}
          handleButtonVisibility={handleButtonVisibility}
        />
      ) : null}

      {visibleFields.length > 0 && visibleCompIndex === 2 ? <Records /> : null}
    </div>
  );
}

export default ComponentTree;
