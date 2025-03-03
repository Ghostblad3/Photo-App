import { useRef, DragEvent, ChangeEvent } from 'react';
import { useAddNewScreenshotStore } from './stores/addNewScreenshotStore';
import { Button } from '@/components/ui/button';

function DragAndDropPng() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setScreenshotAsBase64 = useAddNewScreenshotStore(
    (state) => state.actions.setScreenshotAsBase64,
  );

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    fileReader(event.dataTransfer.files[0]);
  }

  async function inputOnChange(event: ChangeEvent<HTMLInputElement>) {
    const e = event.target as HTMLInputElement;
    const files = e.files;

    if (files) fileReader(files[0]);
  }

  function fileReader(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') setScreenshotAsBase64(e.target?.result);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="mx-4 flex h-[25rem] w-[calc(100%-2.5rem)] flex-col items-center justify-evenly rounded-xl border-2 border-dashed border-zinc-300"
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

export { DragAndDropPng };
