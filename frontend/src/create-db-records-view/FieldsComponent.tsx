import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import fieldsStore from "./stores/fieldsStore";
import navitationStore from "./stores/navigationStore";
import dataStore from "./stores/dataStore";

function FieldsComponent() {
  const setVisibleFields = fieldsStore(
    (state) => state.actions.setVisibleFields
  );
  const fields = fieldsStore((state) => state.props.fields);
  const visibleFields = fieldsStore((state) => state.props.visibleFields);
  const { setAllowLeft, setAllowRight, incrementIndex } = navitationStore(
    (state) => state.actions
  );
  const data = dataStore((state) => state.props.data);
  const setDisplayableData = dataStore(
    (state) => state.actions.setDisplayableData
  );

  useEffect(() => {
    setAllowLeft(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (visibleFields.length > 0) {
      setAllowRight(true);
    } else {
      setAllowRight(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleFields]);

  useEffect(() => {
    setDisplayableData(
      data.map((item) => {
        const temp: { [key: string]: string } = {};

        visibleFields.forEach((field) => (temp[field] = item[field]));

        return temp;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleFields, data]);

  return (
    <>
      {fields.length > 0 && (
        <div className="w-full border space-y-12 p-5 rounded-md">
          <div className="space-y-1">
            <h1 className="font-bold text-2xl decoration-slate-100">
              Select fields
            </h1>
            <p className="text-slate-500">
              Select the fields that you want to be stored in the user table.
            </p>
          </div>

          <div className="flex flex-col flex-wrap gap-2.5 h-[6.25rem]">
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

                    if (visibleFields.length > 0) {
                      setAllowRight(true);
                    } else {
                      setAllowRight(false);
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
          <Button
            className="w-full"
            onClick={() => {
              if (visibleFields.length > 0) {
                incrementIndex();
              }
            }}
          >
            Show records
          </Button>
        </div>
      )}
    </>
  );
}

export default FieldsComponent;
