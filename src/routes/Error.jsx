import { useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div className="p-8 text-red-600">
      <h2 className="text-2xl font-bold">Oops! Something went wrong.</h2>
      <p>{error.message || "Unknown error occurred."}</p>
    </div>
  );
};

export default ErrorPage;
