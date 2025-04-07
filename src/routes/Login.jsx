import { Form, useLoaderData, useNavigate } from "react-router";
import Input from "../components/Form/Input";
import { useRef, useState } from "react";
import { useAuth } from "../context";

export default function Login({ header }) {
  const navigate = useNavigate();
  const [error, setError] = useState({
    emailError: "",
    passError: "",
  });
  const event = useLoaderData();
  const email = useRef(null);
  const pass = useRef(null);
  const { login } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    if (event) {
      if (email.current.value === event.hosterEmail) {
        if (pass.current.value === event.hosterPassword) {
          navigate(`/events/${event.id}/edit`);
        } else {
          setError((prevErrors) => ({
            ...prevErrors,
            passError: "Wrong password!",
          }));
        }
      } else {
        setError((prevErrors) => ({
          ...prevErrors,
          emailError: "Wrong email address!",
        }));
      }
    } else {
      login();
      navigate("/events");
    }
  }

  return (
    <div className="container mx-auto px-3 min-h-[60vh] flex justify-center items-center">
      <div className="w-1/3 justify-center items-center">
        <h1 className="text-center text-3xl font-semibold mb-4">{header}</h1>
        <Form onSubmit={handleSubmit}>
          <Input
            label="Email:"
            name="email"
            required
            type="email"
            ref={email}
            error={error.emailError}
          />
          <Input
            label="Password:"
            name="password"
            required
            type="password"
            ref={pass}
            error={error.passError}
          />
          <button
            type="submit"
            className="bg-green-500 px-4 py-2 text-white rounded mt-2 float-right"
          >
            Log in
          </button>
        </Form>
      </div>
    </div>
  );
}
