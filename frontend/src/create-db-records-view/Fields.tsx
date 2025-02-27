import { useEffect } from 'react';
import { useFieldsStore } from './stores/fieldsStore';
import { useNavigationStore } from './stores/navigationStore';
import { useDataStore } from './stores/dataStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

function Fields() {
  const setVisibleFields = useFieldsStore(
    (state) => state.actions.setVisibleFields
  );
  const fields = useFieldsStore((state) => state.props.fields);
  const visibleFields = useFieldsStore((state) => state.props.visibleFields);
  const { setAllowLeft, setAllowRight, incrementIndex } = useNavigationStore(
    (state) => state.actions
  );
  const data = useDataStore((state) => state.props.data);
  const setDisplayableData = useDataStore(
    (state) => state.actions.setDisplayableData
  );

  useEffect(() => {
    setAllowLeft(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAllowRight(visibleFields.length > 0);

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
        <div className="w-full space-y-12 rounded-md border p-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold decoration-slate-100">
              Select fields
            </h1>
            <p className="text-slate-500">
              Select the fields that you want to be stored in the user table.
            </p>
          </div>

          <div className="flex h-[6.25rem] flex-col flex-wrap gap-2.5">
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

export { Fields };
