import { useEffect, useRef, DragEvent, ChangeEvent, useState } from 'react';
import { read, utils } from 'xlsx';
import { z } from 'zod';
import { useFieldsStore } from './stores/fieldsStore';
import { useDataStore } from './stores/dataStore';
import { useNavigationStore } from './stores/navigationStore';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/global-components/SpinningLoader.tsx';
import { delay } from '@/utils/delay.ts';

const usersType = z
  .array(
    z
      .record(
        z
          .string()
          .min(5)
          .max(20)
          .regex(
            /^(?!rec_id$)(?!photo_id$)(?!\$)[a-zA-Z_$][a-zA-Z0-9_]*(?<!\$)$/
          ),
        z.string().min(1).max(50)
      )
      .refine(
        (user) => {
          const keys = Object.keys(user);

          return keys.length > 0 && keys.length < 11;
        },
        {
          message: 'A user must have at least 1 and at most 10 keys',
        }
      )
      .refine(
        (user) => {
          const keys = Object.keys(user);

          return keys.length === new Set(keys).size;
        },
        {
          message: 'A user must have unique props',
        }
      )
  )
  .min(1)
  .max(2_000)
  .refine(
    (users) => {
      if (users.length === 0) return false;

      const keys = Object.keys(users[0]);
      const firstKey = keys[0];

      const allUsersFirstValue = users.map((user) => user[firstKey]);
      const uniqueUsersFirstValue = new Set(allUsersFirstValue);

      return users.length === uniqueUsersFirstValue.size;
    },
    {
      message: 'Users cannot have duplicate primary keys',
    }
  )
  .refine(
    (users) => {
      if (users.length === 0) return false;

      const [firstUser, ...restUsers] = users;
      const firstUserKeys = Object.keys(firstUser);
      const uniqueKeys = new Set(firstUserKeys);

      restUsers.forEach((user) => {
        const keys = Object.keys(user);

        if (keys.length !== firstUserKeys.length) return false;

        keys.forEach((key) => {
          uniqueKeys.add(key);
        });
      });

      return uniqueKeys.size === firstUserKeys.length;
    },
    {
      message: 'Users must have the same props',
    }
  );

function DragAndDropExcelFile() {
  const { setFields, setVisibleFields } = useFieldsStore(
    (state) => state.actions
  );
  const data = useDataStore((state) => state.props.data);
  const { setData } = useDataStore((state) => state.actions);
  const { setAllowLeft, setAllowRight, incrementIndex } = useNavigationStore(
    (state) => state.actions
  );
  const allowLeft = useNavigationStore((state) => state.props.allowLeft);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (allowLeft) {
      setAllowLeft(false);
    }

    if (data.length > 0) {
      setAllowRight(true);
    } else {
      setAllowRight(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    fileReader(event.dataTransfer.files[0]);
  }

  async function inputOnChange(event: ChangeEvent<HTMLInputElement>) {
    const e = event.target;
    const files = e.files;

    if (files) {
      fileReader(files[0]);
    }
  }

  function fileReader(file: File) {
    setLoading(true);
    const start = Date.now();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const workbook = read(e?.target?.result, { type: 'string' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = utils.sheet_to_json(worksheet).map((row) => {
        const temp: { [key: string]: string } = {};
        const rowCasted = row as { [key: string]: string };

        Object.keys(rowCasted).forEach((key) => {
          temp[key] = String(rowCasted[key]).toString();
        });

        return temp;
      });

      const result = usersType.safeParse(json);

      const elapseTime = Date.now() - start;

      if (elapseTime < 500) await delay(500, elapseTime);

      if (!result.success) {
        setLoading(false);

        return;
      }

      setFields(Object.keys(json[0]));
      setData(json);
      setVisibleFields([]);
      setLoading(false);

      if (json.length > 0) {
        incrementIndex();
      }
    };

    reader.readAsArrayBuffer(file);
  }

  return (
    <div>
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <LoadingSpinner size={32} />
        </div>
      )}
      <div
        className="flex flex-col items-center justify-evenly space-y-12 rounded-xl border-2 border-dashed border-zinc-300 p-5"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h1 className="text-3xl text-slate-400">
          Drag and drop an excel file here
        </h1>
        <h3 className="text-lg text-slate-400">Or, if you prefer...</h3>
        <input
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          multiple
          onChange={inputOnChange}
          hidden
          ref={inputRef}
        />
        <Button className="" onClick={() => inputRef.current!.click()}>
          Select an excel file from your computer
        </Button>
      </div>
    </div>
  );
}

export { DragAndDropExcelFile };
