"use client";

import { useEffect, useContext } from "react";
import { useForm, useFormState } from "react-hook-form";
import { produce } from "immer";

import { FormStateContext } from "./CreateTaskMultiStepFormContainer";

type FormValues = {
  routineLength: number;
};

function RoutineDurationForm(
  props: React.PropsWithChildren<{
    onNext: () => void;
    onPrev: () => void;
  }>,
) {
  const { form, setForm } = useContext(FormStateContext);

  const { register, handleSubmit, control, watch } = useForm<FormValues>({
    shouldUseNativeValidation: true,
    defaultValues: form.steps.routineLength.value,
  });

  const { isDirty } = useFormState({ control });

  useEffect(() => {
    setForm(
      produce((form) => {
        form.steps.routineLength.dirty = isDirty;
      }),
    );
  }, [isDirty, setForm]);

  return (
    <form
      onSubmit={handleSubmit((value) => {
        setForm(
          produce((state) => {
            state.steps.routineLength = {
              valid: true,
              dirty: false,
              value,
            };
          }),
        );

        props.onNext();
      })}
    >
      <div className={"flex flex-col items-center space-y-16"}>
        <label
          htmlFor="routine-count"
          className="mx-8 mb-2 text-lg font-medium dark:text-white"
        >
          How long should each routine last?
        </label>

        <label className={"flex flex-col items-center space-x-4"}>
          <label
            htmlFor="steps-range-slider-usage"
            className="mx-8 mb-6 text-lg font-medium dark:text-white"
          >
            {watch("routineLength")} min
          </label>
          <input
            type="range"
            {...register("routineLength", { required: true, min: 5, max: 30 })}
            className="w-full cursor-pointer appearance-none rounded-full focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&::-moz-range-thumb]:h-2.5
            [&::-moz-range-thumb]:w-2.5
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-4
            [&::-moz-range-thumb]:border-blue-600
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:duration-150
            [&::-moz-range-thumb]:ease-in-out
            [&::-moz-range-track]:h-2
            
            [&::-moz-range-track]:w-full
            [&::-moz-range-track]:rounded-full
            [&::-moz-range-track]:bg-gray-100
            [&::-webkit-slider-runnable-track]:h-2
            [&::-webkit-slider-runnable-track]:w-full
            [&::-webkit-slider-runnable-track]:rounded-full
            [&::-webkit-slider-runnable-track]:bg-gray-100
            [&::-webkit-slider-runnable-track]:dark:bg-gray-700
            [&::-webkit-slider-thumb]:-mt-0.5
            [&::-webkit-slider-thumb]:h-2.5
            
            [&::-webkit-slider-thumb]:w-2.5
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)]
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:ease-in-out
            [&::-webkit-slider-thumb]:dark:bg-slate-700"
            id="steps-range-slider-usage"
            min="5"
            max="20"
            step="5"
          />
        </label>

        <div className={"flex space-x-2"}>
          <button
            type="submit"
            className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Next
          </button>
          <button
            color={"transparent"}
            onClick={props.onPrev}
            className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </form>
  );
}

export default RoutineDurationForm;
