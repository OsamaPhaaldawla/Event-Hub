import { IoIosArrowDropdownCircle } from "react-icons/io";

export default function SelectInput({
  options,
  label,
  placeHolder,
  name,
  error,
  venues = false,
  ...props
}) {
  return (
    <>
      <label className="text-lg">{label}</label>
      <div className="w-full relative mt-1">
        <select
          id={name}
          className="realtive outline-none border border-gray-400 p-2 rounded w-full  appearance-none relative max-h-20"
          required
          defaultValue={""}
          name={name}
          {...props}
        >
          <option value="" disabled>
            {placeHolder}
          </option>
          {options !== null
            ? options.map((option) => (
                <option
                  key={venues ? option.id : option}
                  value={venues ? option.id : option}
                >
                  {venues ? option.name : option}
                </option>
              ))
            : []}
        </select>
        <IoIosArrowDropdownCircle className="scale-150 absolute right-4 top-1/2 -translate-y-1/2" />
      </div>
      {error && (
        <span className="block text-red-500 mb-2 text-lg">{error}</span>
      )}
    </>
  );
}
