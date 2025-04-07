import { useEffect, useState } from "react";
import { heroDetails } from "../constants";
import { Link } from "react-router";

export default function Hero() {
  const backgroundImages = heroDetails.map((item) => item.image);
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev === heroDetails.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [currentBg]);

  return (
    <>
      {heroDetails.map((item, index) => (
        <div
          key={item.id}
          className={`relative w-full h-screen overflow-hidden -mt-[60px] bg-black/70 ${
            item.id === currentBg + 1 ? "block" : "hidden"
          }`}
        >
          <div
            className={`absolute inset-0 w-full h-screen bg-cover bg-center`}
            style={{ backgroundImage: `url(${backgroundImages[index]})` }}
          />
          <div className="bg-black/60 absolute w-full h-full z-10" />
          <div className="flex flex-col w-full items-center absolute top-1/5 z-30">
            <h1 className="text-2xl md:text-4xl lg:text-5xl mb-4 text-white">
              {item.title}
            </h1>
            <p className="text-sm md:text-xl text-gray-300 italic">
              {item.subtitle}
            </p>
            <div className="flex justify-center gap-6 w-3xl mt-24">
              <Link
                to="/events"
                className="bg-blue-600 flex text-white rounded-2xl py-6 w-full text-2xl font-bold justify-center cursor-pointer hover:scale-105"
              >
                Find Events
              </Link>
              <Link
                to="/host"
                className="bg-white flex text-blue-500 rounded-2xl py-6 w-full text-2xl font-bold justify-center cursor-pointer hover:scale-105"
              >
                Host an Event
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

{
  /* 
            <>
      <PreloadImages images={backgroundsImages} />
      <div
        className={` relative w-full h-screen overflow-hidden -mt-[60px] bg-black/70`}
      >
        <AnimatePresence>
          <motion.div
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1] }}
            //   exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
            className={`absolute inset-0 w-full h-screen bg-cover bg-center`}
            style={{ backgroundImage: `url(${backgroundsImages[currentBg]})` }}
          />
          
        </AnimatePresence>
        <div className="bg-black/60 absolute w-full h-full z-10" />
        <div className="flex flex-col w-full items-center absolute top-1/5  z-30">
          <h1 className="text-2xl md:text-4xl lg:text-5xl mb-4 text-white">
            {heroDetails[currentBg].title}
          </h1>
          <p className="text-sm md:text-xl text-gray-300 italic">
            {heroDetails[currentBg].subtitle}
          </p>
          <div className="flex justify-center gap-6 w-3xl mt-24">
            <button className="bg-blue-600 flex text-white rounded-2xl py-6 w-full text-2xl font-bold justify-center cursor-pointer hover:scale-105">
              Find Events
            </button>
            <button className="bg-white flex text-blue-500 rounded-2xl py-6 w-full text-2xl font-bold justify-center cursor-pointer hover:scale-105">
              Host an Event
            </button>
          </div>
        </div>
      </div>
    </>
            */
}
