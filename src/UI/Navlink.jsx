import { NavLink } from "react-router";

export default function Navlink({ children, isActive, to, className }) {
  const classes =
    'relative before:content-[""] before:absolute before:bg-blue-600 before:bottom-0 before:w-full before:h-[2px]';

  return (
    <li className="py-3">
      <NavLink
        to={to}
        className={`text-2xl text-gray-700 hover:text-blue-600 duration-300 w-full py-3 ${
          className ? className : ""
        } ${isActive ? classes : ""}`}
      >
        {children}
      </NavLink>
    </li>
  );
}
