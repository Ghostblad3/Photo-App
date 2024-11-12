import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { ReloadIcon } from "@radix-ui/react-icons";

import useOperationStore from "../global-stores/operationStore";

import useUserDataStore from "./stores/userDataStore";
import addNewScreenshotStore from "./stores/addNewScreenshotStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

import "react-image-crop/dist/ReactCrop.css";

const aspect = 16 / 9;

function ImageCrop() {
  const tableName = addNewScreenshotStore((state) => state.props.tableName);
  const userIdName = addNewScreenshotStore((state) => state.props.userIdName);
  const userId = addNewScreenshotStore((state) => state.props.userId);
  const screenshotAsBase64 = addNewScreenshotStore(
    (state) => state.props.screenshotAsBase64
  );
  const setShowDialog = addNewScreenshotStore(
    (state) => state.actions.setShowDialog
  );
  const { updateUser } = useUserDataStore((state) => state.actions);
  const { addOperation, changeOperationStatus, removeOperation } =
    useOperationStore((state) => state.actions);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [screenshotBlob, setScreenshotBlob] = useState<Blob>();
  const inputRef = useRef("");
  const [progress, setProgress] = useState(0);
  const [buttonEnabled, setButtonEnabled] = useState(true);

  const hash = useRef(crypto.randomUUID());

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;

      const newCrop: Crop = {
        height: 100,
        unit: "px",
        width: 100,
        x: width / 2 - 50,
        y: height / 2 - 50,
      };

      setCrop(newCrop);
    }
  }

  async function processImage() {
    if (inputRef.current === "") {
      return;
    }

    setButtonEnabled(false);

    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;

    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    let scaleX = image.naturalWidth / image.width;
    let scaleY = image.naturalHeight / image.height;

    scaleX = 1;
    scaleY = 1;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    setScreenshotBlob(blob);
  }

  useEffect(() => {
    const func = async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    };

    func();
  }, [completedCrop, scale, rotate]);

  useEffect(() => {
    if (screenshotBlob) {
      mutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenshotBlob]);

  const mutation = useMutation({
    mutationFn: async () => {
      addOperation(
        hash.current,
        "pending",
        "create",
        "Creating a new screenshot for user",
        false
      );

      const time = Date.now();

      const buffer = await screenshotBlob?.arrayBuffer();
      const array = Array.from(new Uint8Array(buffer!));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await new Promise<{
        code: number;
        responseString: string;
      }>((resolve, reject) => {
        const req = new XMLHttpRequest();

        req.open(
          "POST",
          "http://localhost:3000/screenshot/add-user-screenshot",
          true
        );
        req.setRequestHeader("Content-Type", "application/json");

        // Add event listener to upload listening for progress. Function fires
        // regularly, with progress contained in "e" object
        req.upload.addEventListener("progress", (e) => {
          // Every time progress occurs
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        });

        // Fires when upload is complete
        req.addEventListener("load", () => {
          resolve({ code: req.status, responseString: req.response });
        });

        req.addEventListener("error", () => {
          reject("error");
        });

        req.send(
          JSON.stringify({
            userIdName,
            userId,
            dayNumber: inputRef.current,
            tableName,
            screenshot: {
              type: "Buffer",
              data: array,
            },
          })
        );
      });

      const endTime = Date.now();

      if (endTime - time < 500) {
        await new Promise((resolve) =>
          setTimeout(resolve, 500 - (endTime - time))
        );
      }

      const { code, responseString } = response;

      if (code !== 201) {
        throw new Error("Error creating screenshot");
      }

      const result: {
        status: string;
        data: { photo_timestamp: string };
        error: { message: string };
      } = JSON.parse(responseString);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { data } = result;
      const { photo_timestamp } = data;

      return photo_timestamp;
    },
    onError: () => {
      modifyStatus(
        hash.current,
        "error",
        "Failed to create a new screenshot",
        true
      );
    },
    onSuccess: (data, _, __) => {
      updateUser(userId, {
        has_screenshot: "yes",
        screenshot_day: inputRef.current,
        photo_timestamp: new Date(data).toLocaleString("it-IT"),
      });

      modifyStatus(
        hash.current,
        "success",
        "Successfully created a new screenshot",
        true
      );
    },
    onSettled: () => {
      setShowDialog(false);
    },
    retry: false,
  });

  async function modifyStatus(
    hash: string,
    status: "pending" | "success" | "error",
    message: string,
    show: boolean
  ) {
    changeOperationStatus(hash, status, message, show);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    removeOperation(hash);
  }

  return (
    <>
      {mutation.isIdle && (
        <div className="flex w-full flex-col justify-center">
          {!!screenshotAsBase64 && (
            <ReactCrop
              crop={crop}
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              onChange={(crop, _pixelCrop) => {
                setCrop({
                  width: 100,
                  unit: "px",
                  height: 100,
                  x: crop.x,
                  y: crop.y,
                });
              }}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minHeight={100}
              className="mx-auto flex justify-center"
            >
              <div className="mx-auto">
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={screenshotAsBase64}
                  style={{
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                  }}
                  onLoad={onImageLoad}
                />
              </div>
            </ReactCrop>
          )}
          {!!completedCrop && (
            <div className="mt-2.5 flex w-full flex-col justify-center gap-2.5 px-5">
              <div className="flex gap-5">
                <label htmlFor="scale-input">Scale: </label>
                <input
                  id="scale-input"
                  type="number"
                  step="0.1"
                  className="max-w-20"
                  value={scale}
                  disabled={!screenshotAsBase64}
                  onChange={(e) => setScale(Number(e.target.value))}
                />

                <label htmlFor="rotate-input">Rotate: </label>
                <input
                  id="rotate-input"
                  type="number"
                  className="max-w-20"
                  value={rotate}
                  disabled={!screenshotAsBase64}
                  onChange={(e) =>
                    setRotate(
                      Math.min(180, Math.max(-180, Number(e.target.value)))
                    )
                  }
                />
              </div>
              <canvas
                ref={previewCanvasRef}
                style={{
                  objectFit: "contain",
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
                className="mx-auto"
              />
              <Input
                placeholder="Screenshot day number"
                className="my-2.5"
                onChange={(e) => {
                  inputRef.current = e.target.value;
                }}
              />
              <Button onClick={processImage} disabled={!buttonEnabled}>
                {mutation.isPending && (
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                )}
                Save cropped image
              </Button>
            </div>
          )}
        </div>
      )}
      {!mutation.isIdle && (
        <div className="flex h-[12.5rem] flex-col items-center justify-center">
          <h1 className="text-xl">Uploading</h1>
          <div className="mt-10 flex w-full items-center justify-center gap-2.5">
            <Progress value={progress} className="mt-[0.188rem] h-2.5 w-3/5" />
            <p className="">{progress} %</p>
          </div>
        </div>
      )}
    </>
  );
}

const TO_RADIANS = Math.PI / 180;

async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // scaleX = 1;
  // scaleY = 1;

  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = 1; // window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}

export default ImageCrop;
