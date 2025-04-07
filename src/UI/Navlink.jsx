import { NavLink } from "react-router";

export default function Navlink({ children, isActive, to }) {
  const classes =
    'relative before:content-[""] before:absolute before:bg-blue-600 before:-bottom-3 before:w-full before:h-[2px]';

  return (
    <li>
      <NavLink
        to={to}
        className={`text-2xl text-gray-700 hover:text-blue-600 duration-300 ${
          isActive ? classes : ""
        }`}
      >
        {children}
      </NavLink>
    </li>
  );
}
