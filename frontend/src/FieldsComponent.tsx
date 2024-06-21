import { useContext } from "react";
import { DataContext } from "./Context";
import { Checkbox } from "@/components/ui/checkbox";
import classes from "./fields.module.css";
import { Button } from "@/components/ui/button";

interface Props {
  setShowRightIcon: React.Dispatch<React.SetStateAction<boolean>>;
  setVisibleCompIndex: React.Dispatch<React.SetStateAction<number>>;
  handleButtonVisibility: (value: number) => void;
}

function FieldsComponent({
  setShowRightIcon,
  setVisibleCompIndex,
  handleButtonVisibility,
}: Props) {
  const { fields, visibleFields, setVisibleFields } = useContext(DataContext);

  function handleShowRecords() {
    if (visibleFields.length === 0) return;

    setVisibleCompIndex((prev) => {
      handleButtonVisibility(prev + 1);
      return prev + 1;
    });
  }

  return (
    <>
      {fields.length > 0 && (
        <div className={classes.fieldContainer}>
          <h2 className={classes.title}>Fields</h2>

          <div className={classes.fields}>
            {fields.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={item}
                  checked={visibleFields.includes(item)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setVisibleFields([...visibleFields, item]);
                    } else {
                      setVisibleFields(
                        visibleFields.filter((field) => field !== item)
                      );
                    }

                    if (visibleFields.length === 0) {
                      setShowRightIcon(false);
                    }
                  }}
                />
                <label
                  htmlFor={item}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item}
                </label>
              </div>
            ))}
          </div>
          <Button onClick={handleShowRecords}>Show records</Button>
        </div>
      )}
    </>
  );
}

export default FieldsComponent;
