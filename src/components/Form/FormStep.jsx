import { BiSolidCircle } from "react-icons/bi";

export default function FormStep({ step, line, className, active, children }) {
  return (
    <>
      <div className={className}>
        <div>
          <h4 className="text-2xl font-semibold">Step {step}</h4>
          <p>{children}</p>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <BiSolidCircle
            className={`scale-200 ${active ? "text-blue-600" : ""}`}
          />
          {line && (
            <div className="absolute left-1/2 top-[180%] h-20 w-[1px] bg-white" />
          )}
        </div>
      </div>
    </>
  );
}
