export default function Input({
  name,
  label,
  className,
  required,
  // eslint-disable-next-line no-unused-vars
  as: Tag = "input",
  error,
  ...props
}) {
  return (
    <>
      <label className="text-lg" htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      <Tag
        id={name}
        name={name}
        className={`outline-none border border-gray-400 p-2 rounded w-full mt-1 mb-3${
          className && className
        }`}
        required={required}
        {...props}
      />
      {error && (
        <span className="block text-red-500 -mt-1 mb-2 text-lg">{error}</span>
      )}
    </>
  );
}
