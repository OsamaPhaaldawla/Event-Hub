import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

export default function TypeSelector({ handleClick, types }) {
  const typeList = useRef(null);
  const [selectedType, setSelectedType] = useState(null);
  const [notScrollable, setNotScrollable] = useState(false);

  function handleScroll(dir) {
    if (dir === "left") {
      typeList.current.scrollLeft -= 200;
    } else {
      typeList.current.scrollLeft += 200;
    }
  }

  function scrollablality() {
    if (typeList.current) {
      setNotScrollable(
        typeList.current.clientWidth + 32 <
          typeList.current.parentElement.clientWidth
      );
    }
  }

  window.onresize = () => scrollablality();

  useEffect(() => {
    scrollablality();
  }, [typeList, notScrollable]);

  function onTypeClick(type) {
    if (type === selectedType) {
      setSelectedType(null);
      handleClick(null);
    } else {
      setSelectedType(type);
      handleClick(type);
    }
  }

  return (
    <div className="flex my-4 overflox-x-auto scrollbar-hide relative px-4 w-full">
      <div
        className="flex overflow-x-auto gap-2 scrollbar-hide scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-600 py-3 scroll-smooth w-fit"
        ref={typeList}
      >
        {!notScrollable && (
          <div onClick={() => handleScroll("left")}>
            <FaArrowAltCircleLeft className="hidden md:block absolute -left-2 z-10 rounded-full w-10 h-10 p-1 cursor-pointer top-1/2 -translate-y-1/2 bg-white hover:scale-105" />
          </div>
        )}
        {types.map((type) => (
          <button
            key={type}
            onClick={() => onTypeClick(type)}
            className={`whitespace-nowrap px-3 py-1 rounded-full border text-sm font-medium ${
              selectedType === type && "bg-gray-400"
            }`}
          >
            {type}
          </button>
        ))}

        {!notScrollable && (
          <div onClick={() => handleScroll("right")}>
            <FaArrowAltCircleRight className="hidden md:block absolute -right-2 z-10 rounded-full w-10 h-10 p-1 cursor-pointer top-1/2 -translate-y-1/2 bg-white hover:scale-105" />
          </div>
        )}
      </div>
    </div>
  );
}
