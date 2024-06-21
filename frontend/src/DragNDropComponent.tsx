/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useContext } from "react";
import { read, utils } from "xlsx";
import { DataContext, GlobalContext } from "./Context";
import { Button } from "@/components/ui/button";
import classes from "./dragndrop.module.css";

function DragNDropComponent({
  setVisibleCompIndex,
  handleButtonVisibility,
}: {
  setVisibleCompIndex: React.Dispatch<React.SetStateAction<number>>;
  handleButtonVisibility: (value: number) => void;
}) {
  const { setFields, setData, setVisibleFields } =
    useContext<GlobalContext>(DataContext);
  //const [, setFiles] = useState<string[]>([]);
  const inputRef = useRef<any>();

  function handleDragOver(event: Event) {
    event.preventDefault();
  }

  function handleDrop(event: Event) {
    event.preventDefault();

    fileReader(event.dataTransfer.files[0]);
  }

  async function inputOnChange(event: Event) {
    const e = event.target as HTMLInputElement;
    const files = e.files;

    if (files) {
      fileReader(files[0]);
    }
  }

  function fileReader(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = read(e?.target?.result, { type: "string" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: any = utils.sheet_to_json(worksheet);

      setFields(Object.keys(json[0]));
      setData(json);
      setVisibleFields([]);
      setVisibleCompIndex((prev) => {
        handleButtonVisibility(prev + 1);
        return prev + 1;
      });
    };

    reader.readAsArrayBuffer(file);
  }

  return (
    <>
      <div
        className={classes.dragdrop}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h2>Drag and Drop Files to Upload</h2>

        <input
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          multiple
          onChange={inputOnChange}
          hidden
          ref={inputRef}
        />
        <Button
          className={classes.selectButton}
          onClick={() => inputRef.current.click()}
        >
          Select Files
        </Button>
      </div>
    </>
  );
}

export default DragNDropComponent;
