"use client";

import { useContext, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { produce } from "immer";

import { FormStateContext } from "./CreateTaskMultiStepFormContainer";

type FormValues = {
  routineCount: number;
};
function RoutineCountForm(
  props: React.PropsWithChildren<{
    onNext: () => void;
  }>,
) {
  const { form, setForm } = useContext(FormStateContext);

  const { register, handleSubmit, control } = useForm<FormValues>({
    shouldUseNativeValidation: true,
    defaultValues: {
      routineCount: form.steps.routineCount.value.routineCount,
    },
  });

  const { isDirty } = useFormState({
    control,
  });

  useEffect(() => {
    setForm(
      produce((form) => {
        form.steps.routineCount.dirty = isDirty;
      }),
    );
  }, [isDirty, setForm]);

  return (
    <form
      onSubmit={handleSubmit((value) => {
        console.log("onsubmit");
        setForm(
          produce((formState) => {
            formState.steps.routineCount = {
              value,
              valid: true,
              dirty: false,
              canSelectStep: true,
            };
          }),
        );

        props.onNext();
      })}
    >
      <div className={"flex flex-col items-center space-y-16"}>
        <label
          htmlFor="routine-count"
          className="mx-8 mb-2 block text-lg font-medium dark:text-white"
        >
          How many routines would you like to schedule each day?
        </label>
        <input
          type="text"
          id="routine-count"
          className="block w-20 rounded-lg border-gray-200 px-4 py-3 text-sm text-black focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600"
          {...register("routineCount", { required: true, min: 1, max: 24 })}
        ></input>

        <button
          type="submit"
          className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default RoutineCountForm;
