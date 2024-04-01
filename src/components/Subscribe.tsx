"use client";

import { useFormState } from "react-dom";

import { createContact } from "../app/actions/actions";

const initialState = {
  message: "",
};

function Subscribe() {
  const [state, formAction] = useFormState(createContact, initialState);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mb-5">
          <h2 className="text-2xl font-bold md:text-3xl md:leading-tight dark:text-white">
            Join the waitlist
          </h2>
          <p className="mt-3 text-gray-300 dark:text-gray-400">
            Follow our progress and be the first to try it out.
          </p>
        </div>

        <form action={formAction}>
          <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:gap-3 lg:mt-8">
            <div className="w-full">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                required
                className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm text-black focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="Enter your email"
              />
            </div>
            <button
              className="inline-flex w-full items-center justify-center gap-x-2 whitespace-nowrap rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 sm:w-auto dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              type="submit"
            >
              Subscribe
            </button>
          </div>
          <div className="mt-4 w-full">{state?.message}</div>
        </form>
      </div>
    </div>
  );
}

export default Subscribe;
