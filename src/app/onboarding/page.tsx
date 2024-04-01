import { unstable_noStore as noStore } from "next/cache";
import React from "react";

import CreateTaskMultiStepFormContainer from "../_components/CreateTaskMultiStepFormContainer";

export default async function Onboarding() {
  noStore();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <CreateTaskMultiStepFormContainer />
    </main>
  );
}
