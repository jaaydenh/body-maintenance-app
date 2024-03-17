import { useCallback, useContext } from "react";
import { produce } from "immer";
import { Tab } from "@headlessui/react";
import Link from "next/link";

import {
  FormStateContext,
  FORM_STEPS,
} from "./CreateTaskMultiStepFormContainer";
import RoutineCountForm from "./RoutineCountForm";
import RoutineDurationForm from "./RoutineDurationForm";
import StepperItem from "./StepperItem";

function CreateTaskMultiStepForm() {
  const { form, setForm } = useContext(FormStateContext);

  const next = useCallback(() => {
    console.log("next");
    setForm(
      produce((form) => {
        form.selectedIndex += 1;
      }),
    );
  }, [setForm]);

  const prev = useCallback(() => {
    setForm(
      produce((form) => {
        form.selectedIndex -= 1;
      }),
    );
  }, [setForm]);

  const setSelectedIndex = useCallback(
    (index: number) => {
      setForm(
        produce((form) => {
          form.selectedIndex = index;
        }),
      );
    },
    [setForm],
  );

  const selectedIndex = form.selectedIndex;

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className={"relative my-12 ml-20 flex flex-row gap-x-2"}>
        {FORM_STEPS.map((step, index) => {
          // const canSelectStep = Object.values(form.steps)
          //   .slice(0, index)
          //   .every((step) => step.valid && !step.dirty);

          return (
            <StepperItem
              key={index}
              step={index + 1}
              completed={selectedIndex > index}
              // onSelect={() => {
              //   if (canSelectStep) {
              //     setSelectedIndex(index);
              //   }
              // }}
            >
              {step.label}
            </StepperItem>
          );
        })}
      </Tab.List>

      <Tab.Panels>
        <Tab.Panel>
          <div className={"flex w-full flex-col space-y-6"}>
            <RoutineCountForm onNext={next} />
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div className={"flex w-full flex-col space-y-6"}>
            <RoutineDurationForm onNext={next} onPrev={prev} />
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div className={"flex w-full flex-col items-center space-y-6"}>
            <div>You are ready to get started with your first routine!</div>
            <Link href="/">
              <button className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50  ">
                Complete
              </button>
            </Link>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

export default CreateTaskMultiStepForm;
