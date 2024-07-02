import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-context-menu";
import addNewScreenshotStore from "./stores/addNewScreenshotStore";

function DragAndDropPngComponent() {
  // const [image, setImage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { addNewScreenshotStoreProps, setAddNewScreenshotStoreProps } =
    addNewScreenshotStore((state) => ({
      addNewScreenshotStoreProps: state.addNewScreenshotStoreProps,
      setAddNewScreenshotStoreProps: state.setAddNewScreenshotStoreProps,
    }));

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    fileReader(event.dataTransfer.files[0]);
  }

  async function inputOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const e = event.target as HTMLInputElement;
    const files = e.files;

    if (files) {
      fileReader(files[0]);
    }
  }

  function fileReader(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        // setImage(e.target?.result);
        setAddNewScreenshotStoreProps({
          ...addNewScreenshotStoreProps,
          screenshotAsBase64: e.target?.result,
        });
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="h-[400px] w-[calc(100%-40px)] mx-4 flex flex-col justify-evenly items-center border-2 border-zinc-300 border-dashed rounded-xl"
    >
      <input
        type="file"
        accept="image/png"
        multiple
        onChange={inputOnChange}
        hidden
        ref={inputRef}
      />

      <Label className="text-3xl text-slate-400">Drag and a png here</Label>

      <Label className="text-lg text-slate-400">Or, if you prefer...</Label>

      <Button onClick={() => inputRef!.current!.click()}>
        Select a png from your computer
      </Button>
    </div>
  );
}

export default DragAndDropPngComponent;
