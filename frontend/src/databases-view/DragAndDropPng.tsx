import { useRef } from "react";
import { Button } from "@/components/ui/button";
import addNewScreenshotStore from "./stores/addNewScreenshotStore";

function DragAndDropPng() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setScreenshotAsBase64 = addNewScreenshotStore(
    (state) => state.actions.setScreenshotAsBase64
  );

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
        setScreenshotAsBase64(e.target?.result);
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="h-[25rem] w-[calc(100%-2.5rem)] mx-4 flex flex-col justify-evenly items-center border-2 border-zinc-300 border-dashed rounded-xl"
    >
      <input
        type="file"
        accept="image/png"
        multiple
        onChange={inputOnChange}
        hidden
        ref={inputRef}
      />

      <h1 className="text-3xl text-slate-400">Drag and drop a png file here</h1>

      <h3 className="text-lg text-slate-400">Or, if you prefer...</h3>

      <Button onClick={() => inputRef!.current!.click()}>
        Select a png file from your computer
      </Button>
    </div>
  );
}

export default DragAndDropPng;
