import { useEffect, useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import Content from "./Content";
import Menu from "./Menu";
import photos from "./assets/photos.png";

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
      <div className="h-full w-full flex flex-col overflow-y-auto">
        <div className="flex-shrink-0 h-11 w-full flex items-center gap-2.5 pl-2 bg-[#33A5BF]">
          {isFixedMenu && (
            <MenuIcon
              className="cursor-pointer"
              onClick={() => {
                setIsVisible((prev) => !prev);
              }}
            />
          )}
          <img className="h-6 w-6" src={photos} alt="photos" />
          <h1 className="mb-[0.127rem] text-white text-lg xs:hidden">
            Next gen image management app
          </h1>
        </div>
        <div className="flex h-[calc(100%-2.75rem)]">
          <Menu
            currentComponent={currentComponent}
            setCurrentComponent={setCurrentComponent}
            isVisible={isVisible}
            isFixedMenu={isFixedMenu}
            setIsVisible={setIsVisible}
          />
          <Content currentComponent={currentComponent} />
        </div>
      </div>
    </div>
  );
}

export default Layout;
