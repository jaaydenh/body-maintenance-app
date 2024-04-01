import { unstable_noStore as noStore } from "next/cache";
import React from "react";

import CreateTaskMultiStepFormContainer from "@/components/CreateTaskMultiStepFormContainer";

export default async function Onboarding() {
  noStore();

  return (
    <main className="flex flex-col items-center">
      <CreateTaskMultiStepFormContainer />
    </main>
  );
}
