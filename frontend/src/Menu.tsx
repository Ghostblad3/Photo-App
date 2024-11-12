import { Aperture, Database, FileX, Images, UserRoundPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Menu({
  currentComponent,
  setCurrentComponent,
  isVisible,
  isFixedMenu,
  setIsVisible,
}: {
  currentComponent: number;
  setCurrentComponent: React.Dispatch<React.SetStateAction<number>>;
  isVisible: boolean;
  isFixedMenu: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const mountRef = useRef(true);
  const [unmount, setUnmount] = useState(false);

  function handleClick(index: number) {
    if (isFixedMenu) {
      setIsVisible(false);
    }

    if (currentComponent === index) {
      return;
    }

    setCurrentComponent(index);
  }

  useEffect(() => {
    mountRef.current = false;
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => {
        setUnmount(true);
      }, 125);
    } else {
      setUnmount(false);
    }
  }, [isVisible]);

  const isFixed = isFixedMenu ? "z-[1000] fixed left-0" : "";

  if (unmount || (mountRef.current && isFixed)) return null;

  return (
    <div
      className={`${isFixed} ${
        !isVisible ? "animate-killAnimation" : ""
      } top-11 flex h-[calc(100vh-44px)] w-48 flex-[0_0_auto] flex-col overflow-y-auto bg-[#1b263b] text-[black]`}
    >
      <div className="mt-[4.375rem] flex items-center justify-center gap-2.5 text-lg text-[#adb5bd]">
        <Aperture />
        <h1 className="text-sm">Image manager</h1>
      </div>
      <ul className="mt-20 flex shrink-0 grow flex-col gap-1.5 overflow-y-auto">
        <li
          onClick={() => handleClick(0)}
          style={{
            color: `${currentComponent === 0 ? "white" : "#adb5bd"}`,
          }}
          className="mx-2.5 flex h-10 cursor-pointer items-center gap-4 pl-6 hover:text-white hover:underline"
        >
          <Database className="size-[1.3rem]" />
          <span className="mt-[-0.063rem] text-sm">Database</span>
        </li>
        <li
          onClick={() => handleClick(1)}
          style={{
            color: `${currentComponent === 1 ? "white" : "#adb5bd"}`,
          }}
          className="mx-2.5 flex h-10 cursor-pointer items-center gap-4 pl-6 hover:text-white hover:underline"
        >
          <UserRoundPlus className="size-[1.3rem]" />
          <span className="mt-[-0.063rem] text-sm">Add records</span>
        </li>
        <li
          onClick={() => handleClick(2)}
          style={{
            color: `${currentComponent === 2 ? "white" : "#adb5bd"}`,
          }}
          className="mx-2.5 flex h-10 cursor-pointer items-center gap-4 pl-6 hover:text-white hover:underline"
        >
          <FileX className="size-[1.3rem]" />
          <span className="mt-[-0.063rem] text-sm">Remove table</span>
        </li>
        <li
          onClick={() => handleClick(3)}
          style={{
            color: `${currentComponent === 3 ? "white" : "#adb5bd"}`,
          }}
          className="mx-2.5 flex h-10 cursor-pointer items-center gap-4 pl-6 hover:text-white hover:underline"
        >
          <Images className="size-[1.3rem]" />
          <span className="mt-[-0.063rem] text-sm">Images</span>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
