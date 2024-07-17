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
      } top-[2.75rem] h-full overflow-y-auto w-[15.625rem] bg-[#192a33] flex flex-col @apply text-[white] flex-[0_0_auto]`}
    >
      <div className="mt-[4.375rem] text-lg items-center justify-center flex gap-2.5">
        <Aperture />
        <h1>Image manager</h1>
      </div>
      <div className="mt-7 border-[0.063rem] border-[solid] border-[white]"></div>
      <div>
        <ul className="mt-20 flex flex-col flex-grow flex-shrink-0 h-full overflow-y-auto gap-1.5">
          <li
            onClick={() => handleClick(0)}
            style={{
              color: `${currentComponent === 0 ? "white" : "#b1b1af"}`,
            }}
            className="h-10 cursor-pointer flex gap-4 items-center pl-8 mx-2.5 hover:text-white hover:underline"
          >
            <Database />
            <span className="mt-[-0.063rem]">Database</span>
          </li>
          <li
            onClick={() => handleClick(1)}
            style={{
              color: `${currentComponent === 1 ? "white" : "#b1b1af"}`,
            }}
            className="h-10 cursor-pointer flex gap-4 items-center pl-8 mx-2.5 hover:text-white hover:underline"
          >
            <UserRoundPlus />
            <span className="mt-[-0.063rem]">Add records</span>
          </li>
          <li
            onClick={() => handleClick(2)}
            style={{
              color: `${currentComponent === 2 ? "white" : "#b1b1af"}`,
            }}
            className="h-10 cursor-pointer flex gap-4 items-center pl-8 mx-2.5 hover:text-white hover:underline"
          >
            <FileX />
            <span className="mt-[-0.063rem]">Remove table</span>
          </li>
          <li
            onClick={() => handleClick(3)}
            style={{
              color: `${currentComponent === 3 ? "white" : "#b1b1af"}`,
            }}
            className="h-10 cursor-pointer flex gap-4 items-center pl-8 mx-2.5 hover:text-white hover:underline"
          >
            <Images />
            <span className="mt-[-0.063rem]">Images</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
