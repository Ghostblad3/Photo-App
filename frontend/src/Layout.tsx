import { useEffect, useState } from "react";
import { Menu as MenuIcon } from "lucide-react";

import Content from "./Content";
import Menu from "./Menu";
import photo from "./assets/photo.png";

function Layout() {
  const [currentComponent, setCurrentComponent] = useState(0);
  const [isFixedMenu, setIsFixedMenu] = useState(window.innerWidth < 768);
  const [isVisible, setIsVisible] = useState(window.innerWidth > 768);
  const [, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth((prev) => {
        const newWidth = window.innerWidth;
        if (newWidth < 768 && prev >= 768) {
          setIsVisible(false);
          return newWidth;
        }

        if (newWidth >= 768 && prev < 768) {
          setIsVisible(true);
          return newWidth;
        }

        return prev;
      });

      if (window.innerWidth < 768) {
        setIsFixedMenu((prev) => (prev === true ? prev : true));
      } else {
        setIsFixedMenu((prev) => (prev === false ? prev : false));
      }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-dvh w-full overflow-y-hidden">
      <div className="flex size-full flex-col overflow-y-auto">
        <div className="flex h-11 w-full shrink-0 items-center gap-2.5 bg-[#0d1b2a] pl-4">
          {isFixedMenu && (
            <MenuIcon
              className="cursor-pointer text-white"
              onClick={() => {
                setIsVisible((prev) => !prev);
              }}
            />
          )}
          <img className="size-6" src={photo} alt="photo" />
          <h1 className="xs:hidden mb-[0.127rem] text-base text-white">
            MY Dashboard
          </h1>
        </div>
        <div className="flex h-[calc(100%-2.75rem)] w-full">
          <Menu
            currentComponent={currentComponent}
            setCurrentComponent={setCurrentComponent}
            isVisible={isVisible}
            isFixedMenu={isFixedMenu}
            setIsVisible={setIsVisible}
          />
          <div
            className={`overflow-y-auto ${
              isVisible && !isFixedMenu ? "w-[calc(100%-192px)]" : "w-full"
            }`}
          >
            <Content currentComponent={currentComponent} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
