"use client";

import { useState, createContext, useEffect } from "react";

import { createRoutines } from "../actions/actions";
import CreateTaskMultiStepForm from "./CreateTaskMultiStepForm";

export const FORM_STATE = {
  selectedIndex: 0,
  steps: {
    routineCount: {
      valid: false,
      dirty: false,
      canSelectStep: true,
      value: {
        routineCount: 3,
      },
    },
    routineLength: {
      valid: false,
      dirty: false,
      value: {
        routineLength: 10,
      },
    },
  },
};

export const FORM_STEPS = [
  {
    label: `Routines`,
  },
  {
    label: `Duration`,
  },
  {
    label: `Complete`,
  },
];

export const FormStateContext = createContext({
  form: FORM_STATE,
  setForm: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    form: typeof FORM_STATE | ((form: typeof FORM_STATE) => typeof FORM_STATE),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) => {},
});

function CreateTaskMultiStepFormContainer() {
  const [form, setForm] = useState(FORM_STATE);

  useEffect(() => {
    async function callServerAction(form: typeof FORM_STATE) {
      await createRoutines(form);
    }

    const lastStepIndex = FORM_STEPS.length - 1;
    if (form.selectedIndex === lastStepIndex) {
      callServerAction(form).catch((e) => {
        console.log("server action error: " + e);
      });
    }
  }, [form.selectedIndex]);

  return (
    <FormStateContext.Provider
      value={{
        form,
        setForm,
      }}
    >
      <CreateTaskMultiStepForm />
    </FormStateContext.Provider>
  );
}

export default CreateTaskMultiStepFormContainer;
