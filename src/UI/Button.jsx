import { BsTicketDetailedFill } from "react-icons/bs";

export default function Button({ children, disable = false }) {
  return (
    <div className="relative group">
      <button
        className="flex justify-center w-fit text-2xl items-center  text-white bg-blue-600 border-white border rounded-2xl p-4 hover:text-black hover:border-blue-600 hover:bg-white/90 group transition duration-300 cursor-pointer disabled:cursor-not-allowed"
        disabled={disable}
      >
        <BsTicketDetailedFill className="text-white/90 mr-2 group-hover:text-blue-600/90 transition duration-300" />
        {children}
      </button>
      {disable && (
        <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-blue-600 rounded opacity-0 group-hover:opacity-100 transition duration-300">
          Tickets are sold out
        </span>
      )}
    </div>
  );
}
