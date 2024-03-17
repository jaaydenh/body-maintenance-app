import { Tab } from "@headlessui/react";

function StepperItem({
  step,
  completed,
  children,
}: {
  step: number;
  completed: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tab className="group flex-1 shrink basis-0 outline-none">
      <div className="inline-flex min-h-7 w-full min-w-24 items-center align-middle text-xs">
        <span
          className={`flex size-7 flex-shrink-0 items-center justify-center rounded-full font-medium text-gray-800 ${completed ? "bg-blue-400 text-white" : "bg-gray-100"}`}
        >
          {step}
        </span>
        <div
          className={`ms-2 h-px w-full flex-1  group-last:hidden ${completed ? " bg-blue-400" : "bg-gray-200"} `}
        ></div>
      </div>
      <div className="mt-3">
        <span
          className={`block text-left text-sm font-medium ${completed ? " text-blue-400" : "text-white"}`}
        >
          {children}
        </span>
      </div>
    </Tab>
  );
}

export default StepperItem;
